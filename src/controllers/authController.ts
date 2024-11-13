import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';

export const register = async (req: Request, res: Response) => {
  const { username, password, role, organizationName, region } = req.body;

  try {
    const token = await registerUser(username, password, role, organizationName, region);
    res.status(201).send({ token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Internal server error');
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const token = await loginUser(username, password);
    res.status(200).send({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).send('Internal server error');
  }
};