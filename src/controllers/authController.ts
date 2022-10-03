import { Request, Response } from "express";
import * as userService from "../services/userService";

const signUp = async (req: Request, res: Response) => {
    const body = req.body;
    
    await userService.createUser(body);

    return res.sendStatus(201);
};

export {
    signUp
};