import { del } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "Falta la URL de la foto"
      });
    }

    await del(url);

    return res.status(200).json({
      ok: true
    });

  } catch (error) {
    console.error("ERROR DELETE PHOTO:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}
