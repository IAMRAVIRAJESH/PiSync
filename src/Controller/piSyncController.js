const Device = require('../Models/deviceModel');
const SyncEvent = require('../Models/piSyncModel');
const { sequelize } = require('../Configs/dbConfig');
const { Op } = require('sequelize');

class PiSyncController {
  async syncEvent(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const {
        device_id,
        timestamp,
        total_files_synced,
        total_errors,
        internet_speed,
      } = req.body;

      let sync_status = 'success';
      if (total_errors > 0) {
        sync_status = total_files_synced > 0 ? 'partial' : 'failed';
      }

      const [device, created] = await Device.findOrCreate({
        where: { device_id },
        defaults: {
          device_id,
          last_seen: timestamp,
          total_sync_attempts: 1,
          total_failed_syncs: sync_status === 'failed' ? 1 : 0,
          consecutive_failures: sync_status === 'failed' ? 1 : 0,
        },
        transaction,
      });

      if (!created) {
        const updateData = {
          last_seen: timestamp,
          total_sync_attempts: device.total_sync_attempts + 1,
          consecutive_failures:
            sync_status === 'failed' ? device.consecutive_failures + 1 : 0,
        };

        if (sync_status === 'failed') {
          updateData.total_failed_syncs = device.total_failed_syncs + 1;
        }

        await device.update(updateData, { transaction });
      }

      const syncEvent = await SyncEvent.create(
        {
          device_id: device.id,
          timestamp: new Date(timestamp),
          total_files_synced,
          total_errors,
          internet_speed,
          sync_status,
        },
        { transaction }
      );

      await transaction.commit();

      res.status(201).json(syncEvent);
    } catch (error) {
      await transaction.rollback();
      console.error('Error processing sync event:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getSyncHistory(req, res) {
    try {
      const { id } = req.params;
      const page = 1;
      const limit = 50;

      const offset = (page - 1) * limit;

      // Build where clause
      const whereClause = { device_id: id };

      // Get sync events with pagination
      const { count, rows: syncEvents } = await SyncEvent.findAndCountAll({
        where: whereClause,
        order: [['timestamp', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
        attributes: [
          'id',
          'timestamp',
          'total_files_synced',
          'total_errors',
          'internet_speed',
          'sync_status',
          'sync_duration',
          'error_details',
        ],
      });

      // Get device info
      const device = await Device.findOne({
        where: { id: id },
        attributes: [
          'device_id',
          'device_type',
          'last_seen',
          'total_sync_attempts',
          'total_failed_syncs',
          'consecutive_failures',
          'is_active',
        ],
      });

      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }

      // Calculate statistics
      const stats = {
        total_events: count,
        success_rate:
          device.total_sync_attempts > 0
            ? (
                ((device.total_sync_attempts - device.total_failed_syncs) /
                  device.total_sync_attempts) *
                100
              ).toFixed(2) + '%'
            : '0%',
        average_files_per_sync:
          syncEvents.length > 0
            ? Math.round(
                syncEvents.reduce(
                  (sum, event) => sum + event.total_files_synced,
                  0
                ) / syncEvents.length
              )
            : 0,
        average_internet_speed:
          syncEvents.length > 0
            ? parseFloat(
                (
                  syncEvents.reduce(
                    (sum, event) => sum + (event.internet_speed || 0),
                    0
                  ) / syncEvents.length
                ).toFixed(2)
              )
            : 0,
      };

      res.json({
        device,
        statistics: stats,
        sync_history: syncEvents,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total_records: count,
          total_pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch sync history',
        message:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'Internal server error',
      });
    }
  }

  async getRepeatedFailures(req, res) {
    try {
      const min_failures = 3;
      const page = 1;
      const limit = 20;
      const offset = (page - 1) * limit;
      const days = 30;

      // Find devices with repeated failures
      const { count, rows: devices } = await Device.findAndCountAll({
        where: {
          total_failed_syncs: {
            [Op.gte]: min_failures,
          },
          is_active: true,
        },
        include: [
          {
            model: SyncEvent,
            as: 'syncEvents',
            attributes: ['timestamp', 'total_errors', 'error_details'],
            limit: 5,
            order: [['timestamp', 'DESC']],
            required: false,
          },
        ],
        order: [['total_failed_syncs', 'DESC']],
        limit: limit,
        offset: offset,
      });

      // Get summary statistics
      const summary = await Device.findAll({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'total_problem_devices'],
          [
            sequelize.fn('AVG', sequelize.col('consecutive_failures')),
            'avg_consecutive_failures',
          ],
          [
            sequelize.fn('MAX', sequelize.col('consecutive_failures')),
            'max_consecutive_failures',
          ],
        ],
        where: {
          total_failed_syncs: {
            [Op.gte]: min_failures,
          },
          is_active: true,
        },
        raw: true,
      });

      res.json({
        summary: summary[0] || {
          total_problem_devices: 0,
          avg_consecutive_failures: 0,
          max_consecutive_failures: 0,
        },
        devices: devices.map(device => ({
          device_id: device.device_id,
          device_type: device.device_type,
          consecutive_failures: device.consecutive_failures,
          total_failed_syncs: device.total_failed_syncs,
          total_sync_attempts: device.total_sync_attempts,
          last_seen: device.last_seen,
          failure_rate:
            device.total_sync_attempts > 0
              ? (
                  (device.total_failed_syncs / device.total_sync_attempts) *
                  100
                ).toFixed(2) + '%'
              : '0%',
          recent_failed_events: device.syncEvents || [],
        })),
        pagination: {
          current_page: page,
          per_page: limit,
          total_records: count,
          total_pages: Math.ceil(count / limit),
        },
        filters: {
          min_failures: min_failures,
          days_lookback: days,
        },
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch devices with repeated failures',
        message:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'Internal server error',
      });
    }
  }
}

module.exports = PiSyncController;
