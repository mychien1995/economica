export class User {
  Id: string = '';
  Name: string = '';
  UserName: string = '';
  TenantId: string = '';
  IsActive: string = '';
  CreatedOn!: Date;
  IsActivated: string  = '';
  LastLogin!: Date;
}

export class UserAuthentication {
  UserId: string  = '';
  PasswordHash: string  = '';
  PasswordSalt: string  = '';
}
