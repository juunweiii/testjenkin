// populate.js
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Pet = require('./models/Pet');

const connectDB = require('./db/connect');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);

    // Read mock data from pets.json file
    const filePath = path.join(__dirname, 'mockData', 'pets.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const pets = JSON.parse(data);

    // Remove existing pets from the collection
    await Pet.deleteMany();

    // Insert new pets into the collection
    await Pet.insertMany(pets);

    console.log('Pets data successfully populated!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
