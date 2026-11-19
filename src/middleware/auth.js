const jwt = require("jsonwebtoken");
function auth(requiredRole) {
  return (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Silakan login terlebih dahulu." });
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      if (requiredRole && req.user.role !== requiredRole) return res.status(403).json({ message: "Akses khusus admin." });
      next();
    } catch (_err) {
      return res.status(401).json({ message: "Sesi login tidak valid atau sudah kedaluwarsa." });
    }
  };
}
module.exports = auth;