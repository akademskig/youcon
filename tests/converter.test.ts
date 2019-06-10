import fs from "fs"
import Instances from "../src/instances";
import path from "path"
jest.setTimeout(60000)


describe("Converter class", () => {
    const instances = new Instances()
    let filename = "test_file.mp4"

    describe("Download ffmpeg", () => {
        test('Download ffmpeg', async () => {
            await instances.updater.init()
            const ffPath = JSON.parse((fs.readFileSync(path.join(__dirname,"../src/ffmpeg-downloader/ffpath.json"), { encoding: "utf8" }).toString()))
            const e = fs.existsSync(ffPath.ffPath)
            expect(e).toBe(true)
        })
    })
    describe("Convert files", () => {
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
})
