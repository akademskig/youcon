import youtubedl from "youtube-dl";
import fs from "fs"
import path from "path"
import Args from "./args";
import humanize from "humanize"
import { getDuration, checkDir } from "./utils"
export default class Youtomp3 {

    args: Args
    load = false
    constructor() {
        this.args = new Args()
    }

    loader() {
        this.load = true
        const interval = setInterval(() => {
            if (!this.load) {
                clearInterval(interval)
            }
            else {
                process.stdout.write(" .")
            }
        }, 200)
    }
    async init(urls?: Array<string>, dir?: string, convert?: boolean, format?: string) {
        this.args.setArgs(urls, dir, convert, format)
        process.stdout.write(`Downloading ${this.args.urls.length} videos to directory ${this.args.dir}`)
        this.loader()
        for (let url of this.args.urls)
            await this.downloadVideos(url.toString(), this.args.dir)
    }

    async getVideoInfo(url: string): Promise<youtubedl.Info> {
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

    async convert(file: string, dir: string) {
        const fileArr = file.split(".")
        let ext = fileArr.pop() || "mp4"

        const filename = fileArr.join(".")
        console.log(`\nConverting ${file} to ${filename}.${this.args.format}`)
        await checkDir(`${dir}/${this.args.format}`)
        return new Promise((resolve, reject) => {
            const { exec } = require('child_process');
            const converter = exec(`ffmpeg -y -i "${dir}/${filename.concat(".", ext)}"  "${dir}/${this.args.format}/${filename}.${this.args.format}"`)
            converter.stderr.on("end", (c: any) => {
                //@ts-ignore
                process.stdout.cursorTo(0);
                //@ts-ignore
                process.stdout.clearLine(1);
                process.stdout.write('100.00% - DONE\n');
                resolve()
            })

            let duration = 0
            converter.stderr.on("data", (data: any) => {
                const durationIndex = data.search("Duration")

                if (durationIndex !== -1) {
                    // find the duration substring in ffmpeg output
                    let durData = data.substring(durationIndex, durationIndex + 18).split(" ")[1].trim()
                    duration = getDuration(durData)
                }
                else {
                    const timeIndex = data.search("time=")
                    if (timeIndex === -1)
                        return
                    const timeData = data.substring(timeIndex, timeIndex + 13).split("=")[1].trim()
                    const time = getDuration(timeData)
                    const percentage = ((time / duration) * 100).toFixed(2)
                    //@ts-ignore
                    process.stdout.cursorTo(0);
                    //@ts-ignore
                    process.stdout.clearLine(1);
                    process.stdout.write(percentage + "%");
                }
            })
        })

    }
    async downloadVideos(url: string, dir: string) {
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
            await checkDir(dir)
            this.load = false
            video = youtubedl(url,
                ['--format=18'],
                { cwd: dir });

            video.on('info', (info: youtubedl.Info) => {
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

                if (this.args.convert)
                    await this.convert(filename, dir).catch(err => reject(err))
                resolve()
            })

            video.pipe(fs.createWriteStream(`${path.join(dir, filename)}`));
        })
    }
}

export function init() {
    new Youtomp3().init().catch(err => {
        console.error("ERROR", err)
        process.exit(1)
    })
}
// init()
