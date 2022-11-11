import {
  GetTokenRequest,
  UserRegisterRequest,
} from "@applications/models/auth.model";
import { User, UserAuthentication } from "@domain/index";
import { Router } from "express";
import { getRepository } from "@infra/index";
import { generateSalt, hashPassword, newGuid, utcNow } from "src/utilities";
import { validationResult } from "express-validator";
import { getTokenValidators, registerValidators } from "./auth.validator";

export const authRouter = Router();

authRouter.post(
  "/register",
  registerValidators,
  async (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const registerRequest = <UserRegisterRequest>{ ...req.body };
    const tenantId = req.TenantId;
    const userRepo = getRepository<User>("User");
    const userAuthRepo =
      getRepository<UserAuthentication>("UserAuthentication");
    const user = <User>{
      IsActivated: true,
      IsActive: true,
      Name: registerRequest.Name,
      UserName: registerRequest.UserName,
      TenantId: tenantId,
      Id: newGuid(),
      CreatedOn: utcNow(),
    };
    const passwordSalt = await generateSalt();
    const passwordHash = await hashPassword(
      registerRequest.Password,
      passwordSalt
    );
    await userRepo.create(user);
    await userAuthRepo.create(<UserAuthentication>{
      PasswordHash: passwordHash,
      PasswordSalt: passwordSalt,
      UserId: user.Id,
    });
    return res.json({ success: true });
  }
);

authRouter.post(
  "/token",
  getTokenValidators,
  async (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const getTokenRequest = <GetTokenRequest>{ ...req.body };
    const tenantId = req.TenantId;
    const userRepo = getRepository<User>("User");
    const userAuthRepo =
      getRepository<UserAuthentication>("UserAuthentication");
    const users = await userRepo.query({
      UserName: getTokenRequest.UserName,
      IsActive: true,
      TenantId: tenantId,
    });
    if (!users || users.length == 0) {
      return res.status(404).json({ errors: ["User not found"] });
    }
    const user = users[0];
    const userAuth = (await userAuthRepo.query({ UserId: user.Id }))[0];
    const passwordMatch =
      (await hashPassword(getTokenRequest.Password, userAuth.PasswordSalt)) ==
      userAuth.PasswordHash;
    if (!passwordMatch) {
      return res.status(400).json({ errors: ["Invalid username or password"] });
    }
    const jwt = require("jsonwebtoken");
    const fs = require("fs");
    const token = jwt.sign(
      { userName: user.UserName, displayName: user.Name },
      "SOMEKEY",
      { expiresIn: 60 * 60 }
    );
    return res.json({ success: true, token: token });
  }
);
