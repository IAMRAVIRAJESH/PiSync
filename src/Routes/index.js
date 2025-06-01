const { Router } = require('express');
const syncRoutes = require('./piSyncRoutes');

const router = Router();

router.use('/piSync', syncRoutes);

module.exports = router;
