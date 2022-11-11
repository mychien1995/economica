import mongoose, { Schema } from "mongoose";
import { User, UserAuthentication } from "@domain/index";

const userSchema = new Schema(
  {
    _id: String,
    Name: String,
    UserName: String,
    IsActive: Boolean,
    TenantId: String,
    CreatedOn: Date,
    LastLogin: Date,
  },
  { timestamps: true }
);

// Ensure virtual fields are serialised.
userSchema.set("toObject", {
  transform: function (doc, ret) {
    ret.Id = doc._id;
    delete ret._id;
  },
});

const userAuthSchema = new Schema(
  {
    _id: String,
    UserId: String,
    PasswordHash: String,
    PasswordSalt: String,
  },
  { timestamps: true }
);

export function buildUserSchema() {
  return mongoose.model<User>("Users", userSchema);
}

export function buildUserAuthSchema() {
  return mongoose.model<UserAuthentication>(
    "UserAuthentications",
    userAuthSchema
  );
}
