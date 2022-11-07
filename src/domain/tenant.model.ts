import { IUniqueEntity } from "./interface";

export class Tenant implements IUniqueEntity {
  Id: string = '';
  Name: string = '';
  IsActive: boolean = true;
}
