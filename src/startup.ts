import mongoose from "mongoose";
import { buildTenantSchema } from "./infrastructure/database";
import { Container } from 'typedi';
import { EntityRepository } from "./infrastructure/repositories/entity.repository";
import { Tenant } from "@domain/tenant.model";
import { buildUserAuthSchema, buildUserSchema } from "@infra/database/user.schema";
import { User, UserAuthentication } from "./domain";



export function connectToDatabase() {
    const isProduction = process.env.NODE_ENV === 'production';
    mongoose.connect(process.env.MONGODB_URI!);
    if (!isProduction) {
        mongoose.set('debug', true);
    }
}

export function registerDatabaseSchemas() {
    Container.set('tenantRepository', new EntityRepository<Tenant>(buildTenantSchema()));
    Container.set('userRepository', new EntityRepository<User>(buildUserSchema()));
    Container.set('userAuthenticationRepository', new EntityRepository<UserAuthentication>(buildUserAuthSchema()));
}
