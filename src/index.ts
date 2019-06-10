
import Args from "./args";
import Downloader from "./downloader";
import Instances from "./instances";
import FfmpegDownloader from "./ffmpeg-downloader";
export default class Youcon {

    private _args: Args
    private _downloader: Downloader
    private _updater: FfmpegDownloader

    constructor() {
        const { args, downloader,updater } = new Instances()
        this._args = args
        this._downloader = downloader
        this._updater = updater
    }
    /**
     * @param  {Array<string>} urls
     * - array of video urls to download
     * @param  {string} dir - optional
     * - destination directory - default /home/{user}/videos
     * @param  {boolean} convert - optional
     *  - should the videos be converted - default: false
     * @param  {string} format - optional
     *  - format to convert into - default: "mp3"
     */
    async init(urls?: Array<string>, dir?: string, convert?: boolean, format?: string) {
        this._args.setArgs(urls, dir, convert, format)
        if(this._args.update){
            await this._updater.init()
        }
        if (!Array.isArray(this._args.urls)) {
            throw new Error("The first argument must be an array!")
        }
        process.stdout.write(`\nDownloading ${this._args.urls.length} videos to directory ${this._args.dir}`)

        for (let url of this._args.urls)
            await this._downloader.downloadVideos(url.toString(), this._args.dir).catch(err => { throw err })
    }
}

export function init(urls?: Array<string>, dir?: string, convert?: boolean, format?: string) {
    new Youcon().init(urls, dir, convert, format).catch(err => {
        console.error("ERROR", err)
        process.exit(1)
    })
}
// init()
