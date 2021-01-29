import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from './../models/users';
import {
  BadRequestError,
  validateRequest,
  RequestValidationError
} from '@utpalmaity/common';

const router = express.Router();
router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('provide a valid email'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('password must be between 4 to 20 characters')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const isExist = await User.findOne({ email });

    if (isExist) {
      throw new BadRequestError('user already exist');
    }

    const user = User.build({ email, password });
    await user.save();
    //jwt generation

    const userJWT = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!
    );
    req.session = {
      jwt: userJWT
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
