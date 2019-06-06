
import fs from "fs"
/**
 * @param  {string} data string in format hh:mm:ss
 * @returns {number} duration in miliseconds
 */
export function getDuration(data: string): number {
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
export async function checkDir(dir: string) {
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
