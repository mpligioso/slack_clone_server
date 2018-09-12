import bcrypt from 'bcrypt';

export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    register: async (parent, { password, ...otherArgs }, { models }) => {
      try {
        const encryptedPassword = await bcrypt.hash(password, 10);
        models.User.create({ password: encryptedPassword, ...otherArgs });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
};
