const VERSIONS = `http://ffbinaries.com/api/v1/versions`
const LATEST = `http://ffbinaries.com/api/v1/version/latest`
// const VERSION = ` http://ffbinaries.com/api/v1/version/:version`
import request, { Response } from "request"
import progress from "request-progress"
import fs from "fs"
import path from "path"
import Utils from "../utils";
import extract from "extract-zip"
export default class FfmpegDownloader {

    version!: string
    url!: string
    platform!: string
    utils!: Utils
    ffPath!: string
    constructor(utils: Utils) {
        this.utils = utils
    }

    async init() {
        await this.downloadLatestList()
        await this.downloadVersion()
    }

    listVersions() {
        return new Promise((resolve, reject) => {
            request.get(VERSIONS, { json: true }, (err: any, res: Response) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(res)
            })
        })
    }

    async downloadLatestList(): Promise<Response> {
        return new Promise((resolve, reject) => {
            request.get(LATEST, { json: true }, (err: any, res: Response, body: any) => {
                if (err) {
                    reject(err)
                    return
                }
                this.version = body.version
                const platform = this.utils.getPlatform()
                if (!platform) {
                    throw new Error("Unable to download ffmpeg")
                }
                this.url = body.bin[platform].ffmpeg
                this.platform = platform
                resolve(res)
            })

        })
    }

    async downloadVersion() {
        const ffDir = path.join(__dirname, `../../ffmpeg/${this.platform}/${this.version}`)
        await this.utils.checkDir(ffDir)
        this.ffPath = path.join(ffDir, "ffmpeg")
        const zipPath = this.ffPath + ".zip"
        if (this.utils.getPlatform() === "win")
            this.ffPath += ".exe"
        fs.writeFileSync(path.join(__dirname, "./ffpath.json"), Buffer.from(`{ "ffPath": "${this.ffPath}","ffVersion":"${this.version}"}`))

        return new Promise((resolve, reject) => {
            process.stdout.write(`Downloading ffmpeg v${this.version}`)
            this.utils.loader(true)
            progress(request.get(this.url, { json: true }))
                .on("end", async () => {
                    this.utils.loader(false)
                    await this.extract(zipPath, ffDir)
                    resolve()
                })
                .on("error", () => {
                    reject("An error occured")
                    return
                })
                .pipe(fs.createWriteStream(zipPath))
        })
    }

    async extract(path: string, dir: string) {
        return new Promise((resolve, reject) => {
            process.stdout.write(`\nExtracting ffmpeg v${this.version}`)
            this.utils.loader(true)
            extract(path, { dir: dir, defaultFileMode: 777 }, (err: Error | undefined) => {
                if (err) {
                    reject(err)
                    return
                }
                fs.unlink(path, (err: NodeJS.ErrnoException | null) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve()
                    this.utils.loader(false)
                })
            })
        })
    }
}
