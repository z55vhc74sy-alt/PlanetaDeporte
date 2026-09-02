import crypto from "crypto";

function crearFirma(valor) {
  return crypto
    .createHmac("sha256", process.env.SESSION_SECRET)
    .update(valor)
    .digest("hex");
}

function limpiar(valor) {
  if (valor == null) return "";

  let texto = String(valor).trim();

  if (
    (texto.startsWith('"') && texto.endsWith('"')) ||
    (texto.startsWith("'") && texto.endsWith("'"))
  ) {
    texto = texto.slice(1, -1);
  }

  return texto.trim();
}

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const { usuario, password } = req.body || {};

  const nombre = limpiar(usuario).toLowerCase();
  const claveIngresada = limpiar(password);

  const usuarios = {
    bauti: {
      nombre: "Bauti",
      clave: limpiar(process.env.BAUTI_PASSWORD)
    },
    stefano: {
      nombre: "Stefano",
      clave: limpiar(process.env.STEFANO_PASSWORD)
    },
    trini: {
      nombre: "Trini",
      clave: limpiar(process.env.TRINI_PASSWORD)
    }
  };

  const cuenta = usuarios[nombre];

  if (!cuenta) {
    return res.status(401).json({
      ok: false,
      error: "Usuario incorrecto"
    });
  }

  if (!cuenta.clave) {
    return res.status(500).json({
      ok: false,
      error: "La contraseña de este usuario no está configurada en Vercel"
    });
  }

  if (claveIngresada !== cuenta.clave) {
    return res.status(401).json({
      ok: false,
      error: "Contraseña incorrecta"
    });
  }

  if (!process.env.SESSION_SECRET) {
    return res.status(500).json({
      ok: false,
      error: "Falta SESSION_SECRET en Vercel"
    });
  }

  const vence = Date.now() + (8 * 60 * 60 * 1000);
  const datos = `${cuenta.nombre}.${vence}`;
  const firma = crearFirma(datos);
  const token = `${datos}.${firma}`;

  res.setHeader(
    "Set-Cookie",
    `pd_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=28800`
  );

  return res.status(200).json({
    ok: true,
    usuario: cuenta.nombre
  });
}