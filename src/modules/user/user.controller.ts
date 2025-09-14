import { Request, Response } from "express";
import { UserService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.createUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getAllFromDB();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getUserById(Number(req.params.id));
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const userController = {
  createUser,
  getAllFromDB,
  getUserById,
};
