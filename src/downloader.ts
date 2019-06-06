import youtubedl from "youtube-dl";
import fs from "fs"
import path from "path"
import Utils from "./utils";
import Args from "./args";
import humanize from "humanize"
import Converter from "./converter";

export default class Downloader {
    private _utils: Utils
    private _args: Args
    private _converter: Converter
    constructor(utils: Utils, args: Args, converter: Converter) {
        this._utils = utils
        this._args = args
        this._converter = converter
    }
    /**
     * @param  {string} url - video url
     *  - Get video information from youtube
     */
    async getVideoInfo(url: string): Promise<youtubedl.Info> {
        // check if url is a video url
        if (!url.match("/watch?"))
            throw new Error("Invalid video url")
        return new Promise((res, rej) => {
            return youtubedl.getInfo(url, (err, info) => {
                if (err)
                    rej(err)
                else {
                    res(info)
                }
            })
        })
    }

    /**
     * @param  {string} url - video url
     * @param  {string} dir - destination directory
     */
    async downloadVideos(url: string, dir: string) {
        this._utils.loader(true)

        return new Promise(async (resolve, reject) => {
            let video: youtubedl.Youtubedl
            let videoInfo
            try {
                videoInfo = await this.getVideoInfo(url)
            }
            catch (err) {
                reject(err)
                return
            }
            let filename = videoInfo._filename
            let position = 0;
            let videoSize: number
            if (!videoInfo) {
                throw new Error(`Unable to get video info from url ${url}`)
            }
            await this._utils.checkDir(dir)
            video = youtubedl(url,
                ['--format=18'],
                { cwd: dir });

            video.on('info', (info: youtubedl.Info) => {
                this._utils.loader(false)
                videoSize = info.size
                console.log(`\nDownloading ${info._filename}`)
                console.log('size: ' + humanize.filesize(info.size));
            });

            video.on('data', (chunk: any) => {
                position += chunk.length;
                if (videoSize) {
                    var percent = (position / videoSize * 100).toFixed(2);
                    //@ts-ignore
                    process.stdout.cursorTo(0);
                    //@ts-ignore
                    process.stdout.clearLine(1);
                    process.stdout.write(percent + '%');
                }
            });
            video.on('end', async () => {
                process.stdout.write(' - DONE\n');
                if (this._args.convert)
                    await this._converter.convert(filename, dir, this._args.format).catch((err: Error) => reject(err))
                resolve()
            })

            video.pipe(fs.createWriteStream(`${path.join(dir, filename)}`));
        })
    }
}
