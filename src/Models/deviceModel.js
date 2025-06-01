const { sequelize } = require('../Configs/dbConfig');
const { DataTypes } = require('sequelize');

const Device = sequelize.define(
  'Device',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    device_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    device_type: {
      type: DataTypes.ENUM('PiBook', 'PiBox'),
      allowNull: true,
    },
    last_seen: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    total_sync_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_failed_syncs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    consecutive_failures: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'devices',
    timestamps: true,
    indexes: [
      {
        fields: ['device_id'],
      },
      {
        fields: ['consecutive_failures'],
      },
      {
        fields: ['last_seen'],
      },
    ],
  }
);

module.exports = Device;
