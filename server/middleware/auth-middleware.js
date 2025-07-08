const jwt = require("jsonwebtoken");

// Cookie-based auth middleware
const authenticate = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "User is not authenticated",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Use your env secret
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authenticate;
