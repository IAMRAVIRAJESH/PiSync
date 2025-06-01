const express = require('express');
const PiSyncController = require('../Controller/piSyncController');
const piSyncController = new PiSyncController();

const router = express.Router();
router.post('/sync-event', piSyncController.syncEvent);
router.get('/device/:id/sync-history', piSyncController.getSyncHistory);
router.get('/devices/repeated-failures', piSyncController.getRepeatedFailures);

module.exports = router;
