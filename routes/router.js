const express = require('express');
const router = express.Router();

const user = require('../controllers/userController');
const region = require('../controllers/regionController');
const vector = require('../controllers/vectorController');

//Middleware call
const { authUser } = require('../middleware/auth');
const { checkRegion } = require('../middleware/checkRegion');
const { checkVector } = require('../middleware/checkVector');

// get vector (has to keep this on top for certain reason)
router.get('/region/vectors',  vector.getVector);
// get vector

router.get('/', user.test);
//user
router.post('/user/login', user.userLogin);
router.post('/user/signup', user.userCreate);

//region
router.post('/region', authUser, region.createRegion);
router.get('/region', authUser, region.getRegion);
router.get('/region/:regionUid', authUser, checkRegion, region.getRegion);
router.patch('/region/:regionUid', authUser, checkRegion, region.updateRegion);
router.delete('/region/:regionUid', authUser, checkRegion, region.deleteRegion);

// vector 
router.post('/region/:regionUid/vector', authUser, checkRegion, vector.createVector);
router.patch('/region/:regionUid/vector/:vectorUid', authUser, checkRegion, checkVector, vector.updateVector);
router.delete('/region/:regionUid/vector/:vectorUid', authUser, checkRegion, checkVector, vector.deleteVector);

module.exports = router;    