
import fs from "fs"

export default class Utils {
    private _interval!: NodeJS.Timeout
    /**
     * @param  {string} data string in format hh:mm:ss
     * @returns {number} duration in miliseconds
     */
    getDuration(data: string): number {
        let dataArr = data.split(":")
        let duration = 0

        if (dataArr.length !== 3)
            throw new Error("Invalid time format")
        dataArr.forEach((d: string, i: number) => {
            switch (i) {
                case (0): duration += parseInt(d) * 3600 * 1000
                    break;
                case (1): duration += parseInt(d) * 60 * 1000
                    break;
                case (2): duration += parseInt(d) * 1000

            }
        })
        return duration
    }
    /**
     * @param  {string} dir directory path
     */
    async  checkDir(dir: string) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(dir))
                return fs.mkdir(dir, (err) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve()
                })
            else
                resolve()
        })
    }
    /**
     * @param  {boolean} run - start of stop loader
     */
    loader(run: boolean) {
        if (this._interval && !run) {
            clearInterval(this._interval)
        }
        else {
            this._interval = setInterval(() => {
                process.stdout.write(" .")
            }, 200)
        }
    }
}
