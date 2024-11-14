import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Organization from '../models/Organization';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const registerUser = async (username: string, password: string, role: 'defense' | 'attack', organizationName: string, region?: string) => {
  console.log("Searching for organization:", organizationName)
  const org = await Organization.findOne({ name: organizationName });
  if (!org) {
    throw new Error('Organization not found');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    password: hashedPassword,
    role,
    resources: org.resources,
    organization: org._id, 
    region: role === 'defense' ? region : undefined, // Only store region for defense role
    attacks: role === 'attack' ? [] : undefined, // Initialize the attacks array only for attackers
  });

  await newUser.save();

  // Generate a token
  const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, {
    expiresIn: '1h',
  });

  return { token, user: newUser };
};

export const loginUser = async (username: string, password: string) => {
  const user = await User.findOne({ username }).lean();
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

  return {  token, user: { ...user, password: "*****" }};
};
