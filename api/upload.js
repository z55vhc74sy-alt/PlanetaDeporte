import { handleUpload } from "@vercel/blob/client";

export default async function handler(request) {
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

    return Response.json(response);

  } catch (error) {

    console.error(error);

    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
