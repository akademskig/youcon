import Args from "./args";
import Utils from "./utils";
import Downloader from "./downloader";
import Converter from "./converter";

export default class Instances {
    _args: Args
    _utils: Utils
    _downloader!: Downloader
    _converter!: Converter

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
}
