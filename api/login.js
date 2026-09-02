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
    usuarios[usuario] &&
    password === usuarios[usuario]
  ) {
    return res.status(200).json({
      ok: true,
      usuario
    });
  }

  return res.status(401).json({
    ok: false,
    error: "Usuario o contraseña incorrectos"
  });
}