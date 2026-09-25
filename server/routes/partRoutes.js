const express = require('express');
const router = express.Router();
const {
  getParts,
  getPartById,
  createPart,
  updatePart,
  deletePart
} = require('../controllers/partController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('STAFF', 'ADMIN'), getParts);
router.get('/:id', authorize('STAFF', 'ADMIN'), getPartById);
router.post('/', authorize('ADMIN'), createPart);
router.put('/:id', authorize('ADMIN'), updatePart);
router.delete('/:id', authorize('ADMIN'), deletePart);

module.exports = router;
