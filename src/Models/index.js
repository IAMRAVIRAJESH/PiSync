const { sequelize } = require('../Configs/dbConfig');
const SyncEvent = require('../Models/piSyncModel');

const syncModels = async () => {
  try {
    await sequelize.sync({ force: false, alter: true });
    console.log('Database models synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database models:', error);
    process.exit(1);
  }
};

module.exports = {
  SyncEvent,
  syncModels,
};
