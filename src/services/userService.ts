import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import * as userRepository from "../repositories/userRepository";
import { conflictError, unauthorizedError } from "../utils/errorUtils";

dotenv.config();

interface User {
    email: string
    password: string
    passwordConfirm: string
};

type CreateUserData = User
type UserData = Omit<User, "passwordConfirm">

const login = async (login: UserData) => {
    const user = await userRepository.findUserByEmail(login.email);
    if (!user) throw unauthorizedError("Invalid credentials");

    const isPasswordValid = bcrypt.compareSync(login.password, user.password);
    if (!isPasswordValid) throw unauthorizedError("Invalid credentials");

    const SECRET = <string>process.env.TOKEN_SECRET_KEY;
    const EXPIRES_IN = <string>process.env.TOKEN_EXPIRES_IN;

    const payload = {userId: user.id};
    const jwtConfig = {expiresIn: EXPIRES_IN};

    const token = jwt.sign(payload, SECRET, jwtConfig);

    return token;
};

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
    login,
    createUser
};