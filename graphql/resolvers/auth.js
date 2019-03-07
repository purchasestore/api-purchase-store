const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

module.exports = {
  createUser: async args => {
    const email = args.userInput.email;
    const name = args.userInput.name;

    try {
      const existingUser = await User.findOne({ where: { email: email } });

      if (existingUser) {
        throw new Error('Usuário com e-mail inserido já existe.');
      }

      const hashedPassowrd = await bcrypt.hash(args.userInput.password, 12);

      const user = await User.create({
        email: email,
        password: hashedPassowrd,
        name: name
      });

      return {
        ...user.dataValues,
        password: null,
        createdAt: dateToString(user.createdAt),
        updatedAt: dateToString(user.updatedAt)
      };
    } catch (err) {
      throw err;
    }
  },
  updateUser: async ({ name, email }, req) => {
    const user = req.user;

    if (!user) {
      throw new Error('Não autenticado.');
    }

    user.name = name;
    user.email = email;

    try {
      const updatedUser = await user.save();
      return {
        ...updatedUser.dataValues,
        password: null,
        createdAt: dateToString(updatedUser.createdAt),
        updatedAt: dateToString(updatedUser.updatedAt)
      };
    } catch (err) {
      throw err;
    }
  },
  updatePassword: async ({ password }, req) => {
    const user = req.user;

    if (!user) {
      throw new Error('Não autenticado.');
    }

    try {
      const hashedPassowrd = await bcrypt.hash(password, 12);

      user.password = hashedPassowrd;

      const updatedUser = await user.save();

      return {
        ...updatedUser.dataValues,
        password: null,
        createdAt: dateToString(updatedUser.createdAt),
        updatedAt: dateToString(updatedUser.updatedAt)
      };
    } catch (err) {
      throw err;
    }
  },
  deleteUser: (args, req) => {
    const user = req.user;

    if (!user) {
      throw new Error('Não autenticado.');
    }

    try {
      return !!user.destroy();
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        throw new Error('E-mail ou senha inválidos.');
      }

      const isEqual = await bcrypt.compare(password, user.password);

      if (!isEqual) {
        throw new Error('E-mail ou senha inválidos.');
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        'lifeisstrange',
        { expiresIn: '24h' }
      );

      return { userId: user.id, token: token, tokenExpiration: 24 };
    } catch (err) {
      throw err;
    }
  }
};
