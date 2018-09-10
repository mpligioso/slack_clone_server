export default (sequelize, DataTypes) => {
  const Team = sequelize.define('team', {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
  });

  Team.associate = (models) => {
    // N:N
    Team.belongsToMany(models.User, {
      through: 'member',
      foreignKey: 'teamId',
    });
    // 1:N
    Team.belongsTo(models.User, {
      foreignKey: 'owner',
    });
  };

  return Team;
};
