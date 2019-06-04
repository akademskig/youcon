import yargs from "yargs"
import { pathToFileURL } from "url";
import path from "path"
export default class Args {
    private _urls!: Array<string | number>
    private _dir!: string
    private _convert!: boolean

    constructor() {
        this.parseArgs()
    }
    parseArgs() {
        const args = yargs
            .option('url', {
                alias: "u",
                describe: "video url to download",
                array: true,
                demand: true
            })
            .option('dir', {
                alias: "d",
                default: "./videos",
                describe: "destination directory",
                string: true
            })
            .option('convert', {
                alias: "c",
                default: false,
                describe: "convert to mp3",
                boolean: true
            })
            .help('help')
            .argv

        this._urls = args.url
        this._dir = args.dir
        this._convert = args.convert
    }

    get urls() {
        return this._urls
    }

    get dir() {
        return this._dir
    }

    get convert() {
        return this._convert
    }
}
