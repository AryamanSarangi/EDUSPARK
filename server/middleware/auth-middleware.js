const jwt = require("jsonwebtoken");

const verifyToken = (token, secretKey) => jwt.verify(token, secretKey);

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader, "authHeader");

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "User is not authenticated",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const jwtSecret = process.env.JWT_SECRET || "defaultSecret";
    const payload = verifyToken(token, jwtSecret);

    req.user = payload;

    next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: "invalid token",
    });
  }
};

module.exports = authenticate;
