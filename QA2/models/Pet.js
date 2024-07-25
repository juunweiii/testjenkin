const mongoose = require('mongoose');

const AgeSchema = new mongoose.Schema(
  {
    years: {
      type: Number,
      required: true,
    },
    months: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const PetSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide pet name'],
      maxlength: [100, 'Name can not be more than 100 characters'],
    },
    age: {
      type: AgeSchema,
      required: true,
    },
    species: {
      type: String,
      required: [true, 'Please provide pet species'],
    },
    breed: {
      type: String,
      required: [true, 'Please provide pet breed'],
    },
    gender: {
      type: String,
      required: [true, 'Please provide pet gender'],
      enum: ['Male', 'Female'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Please provide pet thumbnail'],
    },
    images: {
      type: [String],
      required: [true, 'Please provide pet images'],
    },
    colors: {
      type: [String],
      required: [true, 'Please provide pet colors'],
    },
    description: {
      type: String,
      required: [true, 'Please provide pet description'],
      maxlength: [1000, 'Description can not be more than 1000 characters'],
    },
    vaccinated: {
      type: Boolean,
      required: true,
    },
    spayed_neutered: {
      type: Boolean,
      required: true,
    },
    adoption_requirements: {
      type: [String],
      required: true,
    },
    personality_traits: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model('Pet', PetSchema);
