import { createRouteHandler } from "uploadthing/next"
import { ourFileRouter } from "./core"

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    /** Surface uploads to UploadThing using the env-set token. */
    token: process.env.UPLOADTHING_TOKEN,
  },
})
