import Sequelize from 'sequelize';
import {} from 'dotenv/config';

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  dialect: 'postgres',
  // to change camelCase to snake_case
  define: {
    underscored: true,
  },
});

const models = {
  User: sequelize.import('./user.js'),
  Channel: sequelize.import('./channel.js'),
  Message: sequelize.import('./message.js'),
  Team: sequelize.import('./team.js'),
};

// to associate the different models in our db
Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
