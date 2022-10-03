import { Request, Response } from "express";
import * as userService from "../services/userService";

const signIn = async (req: Request, res: Response) => {
    const body = req.body;

    const token = await userService.login(body);

    return res.status(200).send({token})
};

const signUp = async (req: Request, res: Response) => {
    const body = req.body;
    
    await userService.createUser(body);

    return res.sendStatus(201);
};

export {
    signIn,
    signUp
};