import Utils from "./utils";
import { execFile } from "child_process"
import ProcessExec from "../types/process";
import { ExecFileError } from "../types/execFileError";

export default class Converter {
    private _utils: Utils
    constructor(utils: Utils) {
        this._utils = utils
    }
    /**
     * @param  {string} file - filename to convert
     * @param  {string} dir - destination directory
     * @param  {string} format - format to convert into
     */
    async convert(file: string, dir: string, format: string) {
        const fileArr = file.split(".")
        let ext = fileArr.pop() || "mp4"

        const filename = fileArr.join(".")
        console.log(`\nConverting ${file} to ${filename}.${format}`)
        await this._utils.checkDir(`${dir}/${format}`)
        return new Promise((resolve) => {
            let duration = 0
            const converter = execFile(`ffmpeg`,[`-y`, `-i`, `${dir}/${filename.concat(".", ext)}`,  `${dir}/${format}/${filename}.${format}`],
                (err: ExecFileError | null) => {
                    if (err) {
                        if (err.code && err.code==="ENOENT") {
                            throw new Error("ffmpeg must be installed!")
                        }
                        throw err
                    }
                })
            if (!converter.stderr) {
                throw new Error("Invalid commmand.")
            }
            converter.stderr.on("end", () => {
                resolve()
            })

            converter.stderr.on("data", (data: any) => {
                const durationIndex = data.search("Duration")

                if (durationIndex !== -1) {
                    // find the duration substring in ffmpeg output
                    let durData = data.substring(durationIndex, durationIndex + 18).split(" ")[1].trim()
                    duration = this._utils.getDuration(durData)
                }
                else {
                    let processE: ProcessExec = process
                    const timeIndex = data.search("time=")
                    if (timeIndex === -1)
                        return
                    const timeData = data.substring(timeIndex, timeIndex + 13).split("=")[1].trim()
                    const time = this._utils.getDuration(timeData)
                    const percentage = ((time / duration) * 100).toFixed(2)
                    if (processE.stdout.cursorTo && processE.stdout.clearLine) {
                        processE.stdout.cursorTo(0);
                        processE.stdout.clearLine(1);
                        processE.stdout.write(percentage + "%");
                    }
                    if (percentage == "100.00")
                        process.stdout.write(" - DONE\n");
                }
            })
        })
    }
}
