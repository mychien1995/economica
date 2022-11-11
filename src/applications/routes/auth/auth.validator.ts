import { User } from "@domain/index";
import { body } from "express-validator";
import { getRepository } from "@infra/index";

export const registerValidators = [
  body("UserName")
    .isEmail()
    .withMessage("UserName must be a valid email address"),
  body("Password")
    .isLength({ min: 5 })
    .withMessage("Password must have a minimum length of 5"),
  body("Name").isLength({ min: 1 }).withMessage("Display Name is required"),
  body("UserName").custom((value) => {
    const userRepo = getRepository<User>("User");
    return userRepo.query({ UserName: value }).then((user) => {
      if (user && user.length > 0) {
        return Promise.reject("UserName already in use");
      }
    });
  }),
];

export const getTokenValidators = [
  body("UserName")
    .isEmail()
    .withMessage("UserName must be a valid email address"),
  body("Password")
    .isLength({ min: 5 })
    .withMessage("Password must have a minimum length of 5"),
];
