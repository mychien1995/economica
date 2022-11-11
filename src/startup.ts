import mongoose from "mongoose";
import { registerRepositories } from "./infrastructure";



export function connectToDatabase() {
    const isProduction = process.env.NODE_ENV === 'production';
    mongoose.connect(process.env.MONGODB_URI!);
    if (!isProduction) {
        mongoose.set('debug', true);
    }
}

export function registerDatabaseSchemas() {
    registerRepositories();
}
