import { IUniqueEntity } from "./interface";

export class User implements IUniqueEntity {
  Id: string = "";
  Name: string = "";
  UserName: string = "";
  TenantId: string = "";
  IsActive: boolean = true;
  CreatedOn!: Date;
  IsActivated: boolean = true;
  LastLogin?: Date;
}

export class UserAuthentication {
  UserId: string = "";
  PasswordHash: string = "";
  PasswordSalt: string = "";
}
