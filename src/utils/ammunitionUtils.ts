import User from "../models/User"

export const getUserAmmunition = async (userId: string): Promise<any> => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.resources;
  };