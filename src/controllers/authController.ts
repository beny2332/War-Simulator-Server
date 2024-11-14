import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';

export const register = async (req: Request, res: Response) => {
  const { username, password, role, organization, region } = req.body;
  console.log("Request body in controller:", req.body)
  try {
    const { token, user } = await registerUser(username, password, role, organization, region);
    res.status(201).send({ token, user });
  } catch (error) {
    console.error('Error registering user:', error);
    if (error instanceof Error && error.message === 'Organization not found') {
      res.status(400).send({ message: error.message });
    } else {
      res.status(500).send('Internal server error');
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const { token, ...userDetails } = await loginUser(username, password);
    res.status(200).send({ token, ...userDetails });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).send('Internal server error');
  }
};
