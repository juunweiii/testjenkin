const Pet = require('../models/Pet');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const path = require('path');

const createPet = async (req, res) => {
  req.body.user = req.user.userId;
  const pet = await Pet.create(req.body);
  res.status(StatusCodes.CREATED).json({ pet });
};
const getAllPets = async (req, res) => {
  const pets = await Pet.find({});

  res.status(StatusCodes.OK).json({ pets, count: pets.length });
};
const getSinglePet = async (req, res) => {
  const { id: petId } = req.params;

  const pet = await Pet.findOne({ _id: petId });

  if (!pet) {
    throw new CustomError.NotFoundError(`No pet with id : ${petId}`);
  }

  res.status(StatusCodes.OK).json({ pet });
};
const updatePet = async (req, res) => {
  const { id: petId } = req.params;

  const pet = await Pet.findOneAndUpdate({ _id: petId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!pet) {
    throw new CustomError.NotFoundError(`No pet with id : ${petId}`);
  }

  res.status(StatusCodes.OK).json({ pet });
};
const deletePet = async (req, res) => {
  const { id: petId } = req.params;

  const pet = await Pet.findOne({ _id: petId });

  if (!pet) {
    throw new CustomError.NotFoundError(`No pet with id : ${petId}`);
  }

  await pet.remove();
  res.status(StatusCodes.OK).json({ msg: 'Success! Pet removed.' });
};
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded');
  }
  const petImage = req.files.image;

  if (!petImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please Upload Image');
  }

  const maxSize = 1024 * 1024;

  if (petImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      'Please upload image smaller than 1MB'
    );
  }

  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${petImage.name}`
  );
  await petImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${petImage.name}` });
};

module.exports = {
  createPet,
  getAllPets,
  getSinglePet,
  updatePet,
  deletePet,
  uploadImage,
};
