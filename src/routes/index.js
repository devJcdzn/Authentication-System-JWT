const { Router } = require('express');
const User = require('../models/User');
const UserController = require('../controllers/UserController');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const routes = Router();

//Home Page - Public Route

routes.get('/', (req, res) => {
  res.status(200).json('success, API working')
});

//Private Route
routes.get('/users/:id', checkToken, async (req, res) => {
  const id = req.params.id;

  //Check user existence
  const user = await User.findById(id, '-password');

  if (!user) {
    return res.status(404).json({ msg: "usuário não encontrado." })
  }

  return res.status(200).json({ user });

});

function checkToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: 'Access Denied' });
  }

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);
    next();
  } catch (err) {
    res.status(400).json({ msg: "Token Inválido" });
  }
}

//Register 
routes.post('/register', UserController.resgisterUser);
//Login
routes.post('/login', UserController.authUser);

module.exports = routes;