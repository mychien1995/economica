export interface IEntityRepository<T> {
    query(query: any, skip: number | undefined, limit: number | undefined): Promise<T[]>;
    create(body: T): Promise<void>;
    update(body: T): void;
    delete(body: T): void;
}