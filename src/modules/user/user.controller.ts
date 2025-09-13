import { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body);
    res.send(result);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

export const userController = {
  createUser,
};
