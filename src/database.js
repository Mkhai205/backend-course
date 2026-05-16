import { DataSource } from "typeorm";
import { User } from "./entity/User.js";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5555,
    username: "postgres",
    password: "password",
    database: "mydatabase",
    synchronize: true,
    logging: true,
    entities: [User],
});
