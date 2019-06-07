import fs from "fs"
import Instances from "../src/instances";
jest.setTimeout(60000)


describe("Converter class", () => {
    const instances = new Instances()
    let filename = "test_file.mp4"
    test('Convert a file to .mp3', async () => {
        await instances.converter.convert(filename, "./test_files", "mp3")
        const file = filename.split(".")
        file.pop()
        const mp3File = file.join(".") + ".mp3"
        const e = fs.existsSync(`./test_files/mp3/${mp3File}`)
        expect(e).toBe(true)
    })
    test('Convert a file to .avi', async () => {
        await instances.converter.convert(filename, "./test_files", "avi")
        const file = filename.split(".")
        file.pop()
        const mp3File = file.join(".") + ".avi"
        const e = fs.existsSync(`./test_files/avi/${mp3File}`)
        expect(e).toBe(true)
    })

})
