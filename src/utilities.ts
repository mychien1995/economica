const crypto = require("crypto");
const bcrypt = require("bcrypt");

export function newGuid(): string {
  return crypto.randomUUID();
}

export function utcNow(): Date {
  var now = new Date();
  return new Date(now.getTime() + now.getTimezoneOffset() * 60000);
}

export async function generateSalt(): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return salt;
}

export async function hashPassword(
  rawPassword: string,
  salt: string
): Promise<string> {
  return await bcrypt.hash(rawPassword, salt);
}
