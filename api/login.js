import crypto from "crypto";

function crearFirma(valor) {
  return crypto
    .createHmac("sha256", process.env.SESSION_SECRET)
    .update(valor)
    .digest("hex");
}

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const { usuario, password } = req.body || {};

  const usuarios = {
    Bauti: process.env.BAUTI_PASSWORD,
    Stefano: process.env.STEFANO_PASSWORD,
    Trini: process.env.TRINI_PASSWORD
  };

  if (
    !usuarios[usuario] ||
    password !== usuarios[usuario]
  ) {
    return res.status(401).json({
      ok: false,
      error: "Usuario o contraseña incorrectos"
    });
  }

  const vence = Date.now() + 8 * 60 * 60 * 1000;

  const datos = `${usuario}.${vence}`;
  const firma = crearFirma(datos);

  const token = `${datos}.${firma}`;

  res.setHeader(
    "Set-Cookie",
    `pd_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=28800`
  );

  return res.status(200).json({
    ok: true,
    usuario
  });
}