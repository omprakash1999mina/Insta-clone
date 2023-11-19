const jwtService = require("../services/JwtServices");

const auth = async (req, res, next) => {
  if (!req.user || req.user == {}) {
    console.log(req.user)
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(400).json({ error: "Bad Request" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const id = jwtService.verify(token);
      if (!id) {
        return res.status(401).json({ error: "Unauth" });
      }
      // console.log(id)
      req.userId = id.id;
      req.pathType = 1;// path = 1 = jwt token
      next();
    } catch (e) {
      return res.status(401).json({ error: "Unauth" });
    }
  } else {
    req.pathType = 2;// 2 = oAuth
    next();
  }
};

module.exports = auth;
