import yargs from "yargs"

export default class Args {
    private _urls!: Array<string | number>
    private _dir!: string
    private _convert!: boolean
    private _format!: string

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
                default: `/home/${require("os").userInfo().username}/videos`,
                describe: "destination directory",
                string: true
            })
            .option('convert', {
                alias: "c",
                default: false,
                describe: "convert to mp3",
                boolean: true
            })
            .option('format', {
                alias: "f",
                default: "mp3",
                describe: "format to convert into",
                string: true
            })
            .help('help')
            .argv

        this._urls = args.url
        this._dir = args.dir
        this._convert = args.convert
        this._format = args.format
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

    get format(){
        return this._format
    }
}
