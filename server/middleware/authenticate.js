const jwt = require('jsonwebtoken')

const authenticate = function (req, res, next) {
  try {
    const token = req.headers.token
    const decoded = jwt.verify(token, process.env.SECRET_JWT)

    req.decoded = decoded

    next()
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: 'Invalid token'
    })
  }
}

module.exports = authenticate