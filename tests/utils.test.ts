import Utils from "../src/utils";
import fs from "fs"

describe("Utils class", () => {
    const utils = new Utils()
    test('Get duration', async () => {
        const time = utils.getDuration("00:23:11")
        expect(time).toBe(1391000)
    })
    test('Fail get duration - invalid format: 00:d3:11', async () => {
        const time = utils.getDuration("00:d3:11")
        expect(time).toBe(NaN)
    })
    test('Fail get duration - invalid format: d3:11', () => {
        expect(utils.getDuration.bind("d3:11")).toThrow()
    })
    test('Check directory', async () => {
        await utils.checkDir("./test_dir")
        const e = fs.existsSync(`./test_dir`)
        expect(e).toBe(true)
    })
})
