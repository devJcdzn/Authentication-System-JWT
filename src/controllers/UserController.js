const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserController = {
  async resgisterUser(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    //Validation
    if (!name) {
      return res.status(422).json({ msg: "nome é obrigatório" });
    }
    if (!email) {
      return res.status(422).json({ msg: "email é obrigatório" });
    }
    if (!password) {
      return res.status(422).json({ msg: "senha é obrigatório" });
    }
    if (password !== confirmPassword) {
      return res.status(422).json({ msg: "as senhas não conincidem." });
    }

    // Check existence user
    const userExistence = await User.findOne({ email: email });

    if (userExistence) {
      return res.status(422).json({ msg: "usuario ja existente" })
    }

    //create password
    const salt = await bcrypt.genSalt(12);
    const passHash = await bcrypt.hash(password, salt);

    //create user
    const user = new User({
      name,
      email,
      password: passHash,
    });

    try {
      await user.save();
      res.status(201).json({ msg: "usuario criado com sucesso." })
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "erro no servidor" });
    }
  },

  async authUser(req, res) {
    const { email, password } = req.body;

    //Validation
    if (!email || !password) {
      return res.status(422).json({ msg: "email e senha obrigatório." });
    }

    //Check user exists
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ msg: "usuario não encontrado" })
    }

    //Pass Check match
    const checkPass = await bcrypt.compare(password, user.password);

    if (!checkPass) {
      return res.status(422).json({ msg: "senha inválida." });
    }

    try {
      const secret = process.env.SECRET;
      const token = jwt.sign({
        id: user.id,
      }, secret);

      res.status(200).json({ msg: "login efetuado com sucesso.", token })

    } catch (err) {
      console.log(err);
      res.status(500)
    }
  }
}

module.exports = UserController;