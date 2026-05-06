import { headers } from "next/headers"
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { auth } from "@/lib/auth"

const f = createUploadthing()

/**
 * UploadThing FileRouter. Every endpoint is gated to authenticated admins
 * via Better Auth — uploads from logged-out clients throw immediately
 * during the middleware step, before the file is accepted.
 */
async function authMiddleware() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new UploadThingError("Unauthorized")
  return { userId: session.user.id }
}

export const ourFileRouter = {
  campaignImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ file }) => {
      // Returned to the browser via res[0].serverData.
      return { url: file.ufsUrl }
    }),

  newsImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl }
    }),

  // Campaign-update gallery — multi-file upload (up to 10 per shot).
  updateImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
  })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
