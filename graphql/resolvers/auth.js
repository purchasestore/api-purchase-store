const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

module.exports = {
  createUser: async ({ userInput }) => {
    const email = userInput.email;
    const name = userInput.name;
    const lastname = userInput.lastname;
    const password = userInput.password;
    const errors = [];

    if (!validator.isEmail(email)) {
      errors.push({ message: 'E-mail inválido.' });
    }

    if (validator.isEmpty(name)) {
      errors.push({ message: 'Nome inválido.' });
    }

    if (validator.isEmpty(lastname)) {
      errors.push({ message: 'Sobrenome inválido.' });
    }

    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 8 })
    ) {
      errors.push({ message: 'A senha precisa ter no mínimo 8 caracteres.' });
    }

    if (errors.length > 0) {
      const error = new Error('Dados inválidos.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    try {
      const existingUser = await User.findOne({ where: { email: email } });

      if (existingUser) {
        const error = new Error('Usuário com e-mail inserido já existe.');
        error.code = 422;
        throw error;
      }

      const hashedPassowrd = await bcrypt.hash(userInput.password, 12);

      const user = await User.create({
        email: email,
        password: hashedPassowrd,
        name: name,
        lastname: lastname
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
  updateUser: async ({ name, lastname }, req) => {
    const user = req.user;
    const errors = [];

    if (!user) {
      const error = new Error('Não autenticado.');
      error.code = 401;
      throw error;
    }

    if (validator.isEmpty(name)) {
      errors.push({ message: 'Nome inválido.' });
    }

    if (validator.isEmpty(lastname)) {
      errors.push({ message: 'Sobrenome inválido.' });
    }

    if (errors.length > 0) {
      const error = new Error('Dados inválidos.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    user.name = name;
    user.lastname = lastname;

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
  updateEmail: async ({ email }, req) => {
    const user = req.user;
    const errors = [];

    if (!user) {
      const error = new Error('Não autenticado.');
      error.code = 401;
      throw error;
    }

    if (!validator.isEmail(email)) {
      errors.push({ message: 'E-mail inválido.' });
    }

    if (errors.length > 0) {
      const error = new Error('Dados inválidos.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    try {
      const existingUser = await User.findOne({ where: { email: email } });

      if (existingUser) {
        const error = new Error('Usuário com e-mail inserido já existe.');
        error.code = 422;
        throw error;
      }

      user.email = email;

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
    const errors = [];

    if (!user) {
      const error = new Error('Não autenticado.');
      error.code = 401;
      throw error;
    }

    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 8 })
    ) {
      errors.push({ message: 'A senha precisa ter no mínimo 8 caracteres.' });
    }

    if (errors.length > 0) {
      const error = new Error('Dados inválidos.');
      error.data = errors;
      error.code = 422;
      throw error;
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
      const error = new Error('Não autenticado.');
      error.code = 401;
      throw error;
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
