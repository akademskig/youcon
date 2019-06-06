import Youcon from "../src/index"
import fs from "fs"
import Instances from "../src/instances";
jest.setTimeout(60000)

const VIDEO_URL="https://www.youtube.com/watch?v=668nUCeBHyY"
const VIDEO_FILENAME="Nature Beautiful short video 720p HD-668nUCeBHyY.mp4"
describe("End to end", () => {
    const instances = new Instances()
    let filename:string
    test('Get video info', async () => {
        filename = await instances.downloader.getVideoInfo(VIDEO_URL).then(vi => vi._filename)
        expect(filename).toBe(VIDEO_FILENAME)
    })
    test('Download video', async () => {
        await new Youcon().init([VIDEO_URL], "./test_files")
        const e = fs.existsSync(`./test_files/${filename}`)
        expect(e).toBe(true)
    });
    test('Convert video to .mp3', async () => {
        const file = filename.split(".")
        file.pop()
        const mp3File = file.join(".") + ".mp3"
        await new Youcon().init([VIDEO_URL], "./test_files", true)
        const e = fs.existsSync(`./test_files/mp3/${mp3File}`)
        expect(e).toBe(true)
    });
    test('Convert video to .avi', async () => {
        const file = filename.split(".")
        file.pop()
        const aviFile = file.join(".") + ".avi"
        await new Youcon().init([VIDEO_URL], "./test_files", true, "avi")
        const e = fs.existsSync(`./test_files/avi/${aviFile}`)
        expect(e).toBe(true)
    });
})
