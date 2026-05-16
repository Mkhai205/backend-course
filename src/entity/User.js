import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
            nullable: true,
        },
        email: {
            type: "varchar",
        },
        password: {
            type: "varchar",
        },
        role: {
            type: "varchar",
        },
        age: {
            type: "int",
            nullable: true,
        },
    },
});
