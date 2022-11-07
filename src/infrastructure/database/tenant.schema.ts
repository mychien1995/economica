import mongoose, { Schema } from "mongoose";
import { Tenant } from "../../domain";

const schema = new Schema({
    _id : String,
    Name: String,
    IsActive: Boolean
}, { timestamps: true });

export function buildTenantSchema() {
    return mongoose.model<Tenant>('Tenants', schema);
}

