import Joi from "joi";

const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    passwordConfirm: Joi.any().valid(Joi.ref("password")).required()
});

export {
    signInSchema,
    signUpSchema
};