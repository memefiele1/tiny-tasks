const express = require('express');
const router = express.Router();

const savePreferences = require('../api/preferences/save');
const loadPreferences = require('../api/preferences/load');

router.put('/:user_id', savePreferences);
router.get('/:user_id', loadPreferences);

module.exports = router;