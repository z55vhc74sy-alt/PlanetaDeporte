import { list } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    const prefix = req.query.prefix || "";

    const { blobs } = await list({
      prefix
    });

    const fotos = blobs.filter((b) =>
      /\.(jpe?g|png|webp)$/i.test(b.pathname)
    );

    return res.status(200).json({
      blobs: fotos
    });

  } catch (error) {
    console.error("ERROR PHOTOS:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}