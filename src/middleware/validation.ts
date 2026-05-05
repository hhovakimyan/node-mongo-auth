import type {Request, Response, NextFunction} from 'express';
import * as yup from "yup";

export const validate = <T extends yup.AnyObject>(schema: yup.ObjectSchema<T>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.validate(req.body, { abortEarly: false });
        next();
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({ errors: error.errors });
        } else {
            res.status(400).json({message: "Validation Failed"});
        }
    }
};