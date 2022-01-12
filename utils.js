import jwt from 'jsonwebtoken';
// import mg from 'mailgun-js';

export const generateToken= (user) => {
  return jwt.sign({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  },
  process.env.JWT_SECRET || "somethingsecret", 
  {
    expiresIn: "30d"
  }
  )
}

// middle-wares
export const isAuth = (req, res, next) => {
    const authorization= req.headers.authorization
    if(authorization){
        const token = authorization.slice(7, authorization.length)
        jwt.verify(token, process.env.JWT_SECRET || "somethingsecret", (err, decode) => {
          if(err){
            res.status(401).send({message: "Invalid Token"})
          } else {
            req.user= decode
            next()
          }
        })

    } else {
      res.status(401).send({message: "No Token"})
    }
}

export const isAdmin = (req, res, next) => {
  if(req.user && req.user.isAdmin){
    next()
  } else {
    res.status(401).send({message: "Invalid Admin token"})
  }
}

export const isSeller = (req, res, next) => {
  if(req.user && req.user.isSeller){
    next()
  } else {
    res.status(401).send({message: "Invalid Seller token"})
  }
}

export const isAdminOrSeller = (req, res, next) => {
  if(req.user && (req.user.isAdmin || req.user.isSeller)){
    next()
  } else {
    res.status(401).send({message: "Invalid AdminSeller token"})
  }
}

