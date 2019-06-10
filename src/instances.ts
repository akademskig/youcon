import Args from "./args";
import Utils from "./utils";
import Downloader from "./downloader";
import Converter from "./converter";
import FfmpegDownloader from "./ffmpeg-downloader";

export default class Instances {
    private _args: Args
    private _utils: Utils
    private _downloader!: Downloader
    private _converter!: Converter
    private _updater!: FfmpegDownloader

    constructor() {
        this._args = new Args()
        this._utils = new Utils()
    }

    get args(): Args {
        return this._args
    }

    get utils(): Utils {
        return this._utils
    }

    get downloader(): Downloader {
        if (!this._downloader) {
            this._downloader = new Downloader(this._utils, this._args, this.converter)
        }
        return this._downloader
    }

    get converter(): Converter {
        if (!this._converter) {
            this._converter = new Converter(this._utils)
        }
        return this._converter
    }
    get updater(): FfmpegDownloader {
        if (!this._updater) {
            this._updater = new FfmpegDownloader(this._utils)
        }
        return this._updater
    }
}
