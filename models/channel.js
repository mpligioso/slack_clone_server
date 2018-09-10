export default (sequelize, DataTypes) => {
  const Channel = sequelize.define('channel', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Channel.associate = (models) => {
    // 1:N relation
    Channel.belongsTo(models.Team, {
      foreignKey: {
        name: 'teamId',
        field: 'team_id',
      },
    });
    Channel.belongsToMany(models.User, {
      through: 'channel_member',
      foreignKey: {
        name: 'channelId',
        field: 'channel_id',
      },
    });
  };

  return Channel;
};
