import { prisma } from "../config/database";
import { UserData } from "../services/userService";

const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: {
            email
        }
    });
};

const findUserById = async (id: string) => {
    return await prisma.user.findUnique({
        where: {
            id
        }
    });
};

const insertUser = async (user: UserData) => {
    return await prisma.user.create({
        data: user
    });
};

export {
    findUserByEmail,
    findUserById,
    insertUser
};