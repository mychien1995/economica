import { Router } from "express";
export const tenantInterceptor = Router();
tenantInterceptor.use("*", (req: any, res: any, next: any) => {
  const tenantId = req.header("x-tenant-id");
  req.TenantId = tenantId;
  next();
});
