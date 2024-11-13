import { connect } from "mongoose";
import User from '../models/User';
import Organization from "../models/Organization";
import Missile from "../models/Missile";
import organizationsData from '../data/organizations.json';
import missilesData from '../data/missiles.json';

export const connectToMongo = async () => {
  try {
    await connect(process.env.DB_URI as string);
    console.log(`Connected to mongo`);

    // Insert initial data if collections are empty
    const organizationCount = await Organization.countDocuments();
    if (organizationCount === 0) {
      await Organization.insertMany(organizationsData);
      console.log('Organizations data inserted successfully');
    }

    const missileCount = await Missile.countDocuments();
    if (missileCount === 0) {
      await Missile.insertMany(missilesData);
      console.log('Missiles data inserted successfully');
    }

  } catch (err) {
    console.log("Can't connect to mongo", err);
  }
};

const createDefenseUser = async () => {
  try {
    const organization = await Organization.findOne({ name: 'IDF - North' });
    if (!organization) {
      throw new Error('Organization not found');
    }

    const newUser = new User({
      username: 'defenseUser1',
      password: 'securepassword',
      role: 'defense',
      organization: organization._id,
      region: 'North',
      interceptedMissiles: []
    });

    await newUser.save();
    console.log('Defense user created successfully:', newUser);
  } catch (error) {
    console.error('Error creating defense user:', error);
  }
};

const createAttackUser = async () => {
  try {
    const organization = await Organization.findOne({ name: 'Hezbollah' });
    if (!organization) {
      throw new Error('Organization not found');
    }

    const newUser = new User({
      username: 'attackUser1',
      password: 'securepassword',
      role: 'attack',
      organization: organization._id,
      interceptedMissiles: []
    });

    await newUser.save();
    console.log('Attack user created successfully:', newUser);
  } catch (error) {
    console.error('Error creating attack user:', error);
  }
};

// Connect to MongoDB and create initial users
const initializeDatabase = async () => {
  await connectToMongo();
  await createDefenseUser();
  await createAttackUser();
};

initializeDatabase();