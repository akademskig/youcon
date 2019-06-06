import Utils from "./utils";

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
            const { exec } = require('child_process');
            let duration = 0

            const converter = exec(`ffmpeg -y -i "${dir}/${filename.concat(".", ext)}"  "${dir}/${format}/${filename}.${format}"`,
                (err: Error) => {
                    if (err)
                        console.error(err)
                })
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
                    const timeIndex = data.search("time=")
                    if (timeIndex === -1)
                        return
                    const timeData = data.substring(timeIndex, timeIndex + 13).split("=")[1].trim()
                    const time = this._utils.getDuration(timeData)
                    const percentage = ((time / duration) * 100).toFixed(2)
                    //@ts-ignore
                    process.stdout.cursorTo(0);
                    //@ts-ignore
                    process.stdout.clearLine(1);
                    process.stdout.write(percentage + "%");
                    if (percentage == "100.00")
                        process.stdout.write(" - DONE\n");
                }
            })
        })

    }
}
