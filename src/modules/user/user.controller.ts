import { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body);
    res.send(201).json(result);
    console.log(result);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllFromDB();
    res.send(201).json(result);
  } catch (error) {
    res.status(500).send(error);
    // console.log(error);
  }
};

export const userController = {
  createUser,
  getAllFromDB,
};
