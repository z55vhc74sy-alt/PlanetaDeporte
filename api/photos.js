import { list } from "@vercel/blob";

export default async function handler(request) {
  try {
    const url = new URL(request.url);
    const prefix = url.searchParams.get("prefix") || "";

    const { blobs } = await list({ prefix });

    return Response.json({
      blobs: blobs.filter((b) =>
        /\.(jpe?g|png|webp)$/i.test(b.pathname)
      )
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}