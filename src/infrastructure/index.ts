import Container from "typedi";
import {
  buildUserAuthSchema,
  buildUserSchema,
  buildTenantSchema,
} from "@infra/database";
import { EntityRepository } from "./repositories/entity.repository";
import { User, Tenant, UserAuthentication } from "@domain/index";
import mongoose from "mongoose";
import { IEntityRepository } from "@applications/index";

export function registerRepositories() {
  registerRepository<Tenant>("Tenant", buildTenantSchema());
  registerRepository<User>("User", buildUserSchema());
  registerRepository<UserAuthentication>(
    "UserAuthentication",
    buildUserAuthSchema()
  );

  function registerRepository<T>(name: string, schema: mongoose.Model<T>) {
    Container.set(`${name}Repository`, new EntityRepository<T>(schema));
  }
}

export function getRepository<T>(name: string): IEntityRepository<T> {
  return Container.get(`${name}Repository`) as IEntityRepository<T>;
}
