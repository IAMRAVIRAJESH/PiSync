const Device = require('./deviceModel');
const { sequelize } = require('../Configs/dbConfig');
const { DataTypes } = require('sequelize');

const SyncEvent = sequelize.define(
  'SyncEvent',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    device_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    total_files_synced: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    total_errors: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    internet_speed: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    sync_status: {
      type: DataTypes.ENUM('success', 'partial', 'failed'),
      allowNull: false,
      defaultValue: 'success',
    },
    sync_duration: {
      type: DataTypes.INTEGER, // in seconds
      allowNull: true,
    },
    error_details: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'sync_events',
    timestamps: true,
    indexes: [
      {
        fields: ['device_id', 'timestamp'],
      },
      {
        fields: ['sync_status'],
      },
      {
        fields: ['timestamp'],
      },
      {
        fields: ['device_id', 'sync_status'],
      },
    ],
  }
);

Device.hasMany(SyncEvent, { foreignKey: 'device_id', as: 'syncEvents' });
SyncEvent.belongsTo(Device, { foreignKey: 'device_id', as: 'device' });

module.exports = SyncEvent;
