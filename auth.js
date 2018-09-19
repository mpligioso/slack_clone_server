import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcrypt';

export const createTokens = async (user, secret, secret2) => {
  // {user: {id: 2}}
  const createToken = jwt.sign(
    { user: _.pick(user, ['id']) },
    secret,
    { expiresIn: '1h' },
  );

  const createRefreshToken = jwt.sign(
    { user: _.pick(user, 'id') },
    secret2,
    { expiresIn: '7d' },
  );

  return [createToken, createRefreshToken];
};

export const tryLogin = async (email, password, models, SECRET, SECRET2) => {
  // check if user exists
  const user = await models.User.findOne({ where: { email }, raw: true });
  if (!user) {
    // login response returned from the login mutation
    return {
      ok: false,
      errors: [{ path: 'email', message: 'No user with this email exists' }],
    };
  }

  // check password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    // bad password
    return {
      ok: false,
      errors: [{ path: 'password', message: 'Password is incorrect' }],
    };
  }

  const refreshTokenSecret = user.password + SECRET2;

  const [token, refreshToken] = await createTokens(user, SECRET, refreshTokenSecret);
  // token => hashed string, refreshToken => hashed string

  return {
    ok: true,
    token,
    refreshToken,
  };
};
