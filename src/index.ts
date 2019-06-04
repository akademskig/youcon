import youtubedl from "youtube-dl";
import fs from "fs"
import path from "path"
import Args from "./args";
import humanize from "humanize"
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
                process.stdout.write("#")
            }
        }, 300)
    }
    async init() {
        console.log(`Downloading ${this.args.urls.length} videos to directory ${this.args.dir}`)
        this.loader()
        for (let url of this.args.urls)
            await this.downloadVideos(url.toString(), this.args.dir)
    }

    async getVideoInfo(url: string): Promise<youtubedl.Info> {
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

    async checkDir(dir: string) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(dir))
                return fs.mkdir(dir, (err) => {
                    if (err)
                        reject(err)
                    resolve()
                })
            else
                resolve()
        })

    }

    async converToMp3(file: string, dir: string) {

        const fileArr = file.split(".")
        let ext = fileArr.pop() || "mp4"

        const filename = fileArr.join(".")
        console.log(`Converting ${file} to ${filename}.mp3`)
        this.loader()
        return new Promise((resolve, reject) => {
            const { exec } = require('child_process');
            exec(`ffmpeg -y -i "${dir}/${filename.concat(".", ext)}"  "${dir}/${filename}.mp3"`, (err: Error, stdout: any, stderr: any) => {
                if (err) {
                    console.error(err)
                    reject(err)
                    return;
                }
                this.load = false
                resolve()
            });
        })

    }
    async downloadVideos(url: string, dir: string) {
        return new Promise(async (resolve, reject) => {
            let video: youtubedl.Youtubedl
            let videoInfo = await this.getVideoInfo(url)
            let filename = videoInfo._filename
            let position = 0;
            let videoSize: number
            if (!videoInfo) {
                throw new Error(`Unable to get video info from url ${url}`)
            }
            await this.checkDir(dir)
            this.load = true
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
                console.log(`\nVideo ${filename} - done`)
                if (this.args.convert)
                    await this.converToMp3(filename, dir).catch(err => reject(err))
                resolve()
            })

            video.pipe(fs.createWriteStream(`${path.join(dir, filename)}`));
        })
    }
}

export function init() {
    new Youtomp3().init().catch(err => {
        console.error(err)
        process.exit(1)
    })
}
