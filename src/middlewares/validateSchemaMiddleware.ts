import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

export function validateSchemaMiddleware(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req.body);

    if (validation.error) {
      const errorDetails = <string>validation.error.details[0].context?.label;
      return res.status(422).send(errorDetails);
    };

    next();
  };
};
