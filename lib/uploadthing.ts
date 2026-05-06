import { generateReactHelpers } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

/** Type-safe React helpers bound to our FileRouter. */
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>()
