import bcrypt from "bcrypt";
import dotenv from "dotenv";

import * as userRepository from "../repositories/userRepository";
import { conflictError, notFoundError, unauthorizedError } from "../utils/errorUtils";

dotenv.config();

interface User {
    email: string
    password: string
    passwordConfirm: string
};

type CreateUserData = User
type UserData = Omit<User, "passwordConfirm">

const createUser = async (user: CreateUserData) => {
    const existingUser = await userRepository.findUserByEmail(user.email);

    if (existingUser) {
        throw conflictError("User already exist");
    };

    const SALT = 10;
    const hashedPassword = bcrypt.hashSync(user.password, SALT);
    const userData = {
        email: user.email,
        password: hashedPassword
    };

    await userRepository.insertUser(userData);
};

export {
    CreateUserData,
    UserData,
    createUser
};