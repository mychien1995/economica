export interface IUniqueEntity {
    Id: string;
}

export function isUniqueEntity(obj: any): obj is IUniqueEntity { //magic happens here
    return (<IUniqueEntity>obj).Id !== undefined;
}