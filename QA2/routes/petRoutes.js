const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

const {
  createPet,
  getAllPets,
  getSinglePet,
  updatePet,
  deletePet,
  uploadImage,
} = require('../controllers/petController');

const { getSinglePetReviews } = require('../controllers/reviewController');

router
  .route('/')
  .post([authenticateUser, authorizePermissions('admin')], createPet)
  .get(getAllPets);

router
  .route('/uploadImage')
  .post([authenticateUser, authorizePermissions('admin')], uploadImage);

router
  .route('/:id')
  .get(getSinglePet)
  .patch([authenticateUser, authorizePermissions('admin')], updatePet)
  .delete([authenticateUser, authorizePermissions('admin')], deletePet);

router.route('/:id/reviews').get(getSinglePetReviews);

module.exports = router;
