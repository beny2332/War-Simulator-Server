import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Organization from '../models/Organization';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const registerUser = async (username: string, password: string, role: 'defense' | 'attack', organizationName: string, region?: string) => {
  const organization = await Organization.findOne({ name: organizationName });
  if (!organization) {
    throw new Error('Organization not found');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    password: hashedPassword,
    role,
    organization: organization._id,
    region: role === 'defense' ? region : undefined,
    interceptedMissiles: []
  });

  await newUser.save();

  const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

  return token;
};

export const loginUser = async (username: string, password: string) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

  return token;
};