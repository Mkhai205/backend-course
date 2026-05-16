import { AppDataSource } from "../database.js";

export const userRepository = AppDataSource.getRepository("User");
