// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send("No autenticado");

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "clave_secreta");
    req.user = decoded; // { id, rol, empresa_id }
    next();
  } catch (err) {
    return res.status(403).send("Token inválido");
  }
}

module.exports = authMiddleware;
