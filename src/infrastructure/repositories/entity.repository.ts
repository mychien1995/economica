import { IEntityRepository } from "@applications/index";
import { isUniqueEntity } from "@domain/index";
import mongoose from "mongoose";

export class EntityRepository<T> implements IEntityRepository<T>{
    constructor(private collection: mongoose.Model<T>) {

    }

    async query(query: any, skip: number | undefined, limit: number | undefined): Promise<T[]> {
        const skipValue = skip || 0;
        let dbQuery = this.collection.find(query).skip(skipValue);
        if (limit)
            dbQuery = dbQuery.limit(limit);
        const result = await dbQuery.exec();
        return result.map(d => (<T>d.toObject()));

    }

    async create(body: T): Promise<void> {
        const document = new this.collection(body);
        if (isUniqueEntity(body)) {
            document._id = body.Id;
        }
        else document._id = new mongoose.Types.ObjectId();
        await document.save();
    }

    update(body: T): void {
        throw new Error("Method not implemented.");
    }
    delete(body: T): void {
        throw new Error("Method not implemented.");
    }

}