import mongoose, { connect } from "mongoose";
import bcrypt from 'bcrypt';
import User from '../models/User';
import Organization from "../models/Organization";
import Missile from "../models/Missile";
import organizationsData from '../data/organizations.json';
import missilesData from '../data/missiles.json';

const SETTINGS_COLLECTION = 'settings';
const INITIAL_SETUP_KEY = 'initialSetupDone';

export const connectToMongo = async () => {
  try {
    await connect(process.env.DB_URI as string);
    console.log(`Connected to mongo`);
  } catch (err) {
    console.log("Can't connect to mongo", err);
  }
};

export const runInitialSetup = async () => {
  try {
    const settingsCollection = mongoose.connection.collection(SETTINGS_COLLECTION);
    const initialSetup = await settingsCollection.findOne({ key: INITIAL_SETUP_KEY });

    if (initialSetup && initialSetup.value) {
      console.log('Initial setup already done');
      return;
    }

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

    // Create initial users
    await createDefenseUser();
    await createAttackUser();

    // Mark initial setup as done
    await settingsCollection.updateOne(
      { key: INITIAL_SETUP_KEY },
      { $set: { value: true } },
      { upsert: true }
    );

  } catch (err) {
    console.log("Error during initial setup", err);
  }
};

const createDefenseUser = async () => {
  try {
    const existingUser = await User.findOne({ username: 'defenseUser1' });
    if (existingUser) {
      console.log('Defense user already exists');
      return;
    }

    const organization = await Organization.findOne({ name: 'IDF - North' });
    if (!organization) {
      throw new Error('Organization not found');
    }

    const hashedPassword = await bcrypt.hash('securepassword', 10);

    const newUser = new User({
      username: 'defenseUser1',
      password: hashedPassword,
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
    const existingUser = await User.findOne({ username: 'attackUser1' });
    if (existingUser) {
      console.log('Attack user already exists');
      return;
    }

    const organization = await Organization.findOne({ name: 'Hezbollah' });
    if (!organization) {
      throw new Error('Organization not found');
    }

    const hashedPassword = await bcrypt.hash('securepassword', 10);

    const newUser = new User({
      username: 'attackUser1',
      password: hashedPassword,
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