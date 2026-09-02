import { handleUpload } from "@vercel/blob/client";

export default async function handler(request,reply) {
  try {
    const body = request.body;

    const response = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "image/jpeg",
          "image/png",
          "image/webp"
    ],  
        addRandomSuffix: true
      }),

      onUploadCompleted: async ({ blob }) => {
        console.log("Foto subida:", blob.url);
      }
    });

    return reply.status(200).json(response);

  } catch (error) {

    console.error(error);

    return reply.status(400).json(
      { error: error.message },
      { status: 400 }
    );
  }
}
