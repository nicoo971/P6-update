const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const stuffCtrl = require('../controllers/Sauce');

router.get('/', auth, stuffCtrl.getSauces);
router.post('/', auth, multer, stuffCtrl.addSauce);
router.get('/:id', auth, stuffCtrl.getSauce);
router.put('/:id', auth,multer, stuffCtrl.updateSauce);
router.delete('/:id', auth, stuffCtrl.deleteSauce);
router.post('/:id/like',auth,stuffCtrl.addlike);
router.get('/:id/test',stuffCtrl.test);

module.exports = router;