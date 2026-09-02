import { handleUpload } from "@vercel/blob/client";
import crypto from "crypto";

function crearFirma(valor) {
  return crypto
    .createHmac("sha256", process.env.SESSION_SECRET)
    .update(valor)
    .digest("hex");
}

function sesionValida(request) {
  const cookie = request.headers.cookie || "";
  const match = cookie.match(/pd_session=([^;]+)/);

  if (!match) return false;

  const token = match[1];
  const partes = token.split(".");

  if (partes.length !== 3) return false;

  const [usuario, vence, firma] = partes;

  if (Date.now() > Number(vence)) return false;

  const datos = `${usuario}.${vence}`;
  const firmaCorrecta = crearFirma(datos);

  return crypto.timingSafeEqual(
    Buffer.from(firma),
    Buffer.from(firmaCorrecta)
  );
}

export default async function handler(request, reply) {
  try {
    const body = request.body;

    const response = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async () => {

        if (!sesionValida(request)) {
          throw new Error("No autorizado");
        }

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp"
          ],
          addRandomSuffix: true
        };
      },

      onUploadCompleted: async ({ blob }) => {
        console.log("Foto subida:", blob.url);
      }
    });

    return reply.status(200).json(response);

  } catch (error) {

    console.error(error);

    return reply.status(401).json({
      error: error.message
    });
  }
}