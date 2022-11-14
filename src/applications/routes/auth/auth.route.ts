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
    const token = jwt.sign(
      { userName: user.UserName, displayName: user.Name },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 }
    );
    return res.json({ success: true, token: token });
  }
);

export const authenticationFilter = async (req: any, res: any, next: any) => {
  const jwt = require("jsonwebtoken");
  const token = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(token, process.env.JWT_KEY);
  const tenantId = req.TenantId;
  try {
    const userRepo = getRepository<User>("User");
    const users = await userRepo.query({
      UserName: data.UserName,
      IsActive: true,
      TenantId: tenantId,
    });
    if (!users || users.length == 0) {
      return res
        .status(401)
        .json({ errors: ["You are not authorized to access this resource"] });
    }
    req.user = users[0];
    next();
  } catch (error) {
    res
      .status(401)
      .send({ errors: ["You are not authorized to access this resource"] });
  }
};

export const masterApiKeyFilter = async (req: any, res: any, next: any) => {
  const token = req.header("x-api-key");
  if (token != process.env.MASTER_API_KEY) {
    res
      .status(401)
      .send({ errors: ["You are not authorized to access this resource"] });
  }
};
