const express = require('express');
const PiSyncController = require('../Controller/piSyncController');
const piSyncController = new PiSyncController();

const router = express.Router();

// POST /sync-event - Accept sync events
router.post('/sync-event', piSyncController.syncEvent);

// GET /device/:id/sync-history - Get sync history for a device
router.get('/device/:id/sync-history', piSyncController.getSyncHistory);

// GET /devices/repeated-failures - Get devices with repeated sync failures
router.get('/devices/repeated-failures', piSyncController.getRepeatedFailures);

module.exports = router;
