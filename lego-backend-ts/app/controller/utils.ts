import {Controller, FileStream} from 'egg'
import {nanoid} from 'nanoid'
import * as streamWormhole from 'stream-wormhole'
import {extname, join, parse} from 'path'

export default class UtilsController extends Controller {
  async uploadToOss() {
    const {ctx} = this;
    const stream: FileStream = await ctx.getFileStream();
    const ossPath = join('lego', `${parse(stream.filename).name}_${nanoid(6)}${extname(stream.filename)}`)
    try {
      const result = await ctx.oss.put(ossPath, stream)
      const {name, url} = result
      ctx.helper.success({ctx, res: {name, url}})
    } catch (e) {
      await streamWormhole(stream)
      ctx.helper.error({ctx, errorType: 'uploadFailed'})
    }
  }

  async uploadMutipleFiles() {
    const {ctx, app} = this;
    const files = await ctx.multipart()
    const urls: string[] = []
    let file: FileStream | string[]
    while (file = await files()) {
      if (Array.isArray(file)) {
        app.logger.info(file)
      } else {
        try {
          const ossPath = join('lego', `${parse(file.filename).name}_${nanoid(6)}${extname(file.filename)}`)
          const result = await ctx.oss.put(ossPath, file)
          const {url} = result
          urls.push(url)
        } catch (e) {
          streamWormhole(file)
          ctx.helper.error({ctx, errorType: 'uploadFailed'})
        }
      }
    }
    ctx.helper.success({ctx, res: {urls}});
  }
}
