
import Args from "./args";
import Downloader from "./downloader";
import Instances from "./instances";
export default class Youtomp3 {

    private _args: Args
    private _downloader: Downloader

    constructor(args: Args, downloader: Downloader) {
        this._args = args
        this._downloader = downloader
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
        process.stdout.write(`Downloading ${this._args.urls.length} videos to directory ${this._args.dir}`)
        for (let url of this._args.urls)
            await this._downloader.downloadVideos(url.toString(), this._args.dir)
    }
}

export function init() {
    const { args, downloader } = new Instances()
    new Youtomp3(args, downloader).init().catch(err => {
        console.error("ERROR", err)
        process.exit(1)
    })
}
// init()
