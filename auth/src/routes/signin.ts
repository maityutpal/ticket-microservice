import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import {
  RequestValidationError,
  BadRequestError,
  validateRequest
} from '@utpalmaity/common';
import { User } from '../models/users';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('provide a valid email'),
    body('password').trim().notEmpty().withMessage('You must supply a password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError('Invalid credential no user');
    }
    const passwordMatched = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordMatched) {
      throw new BadRequestError('Invalid credential password not matched');
    }

    const userJWT = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET!
    );
    req.session = {
      jwt: userJWT
    };
    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
