import { Tenant } from "@domain/index";
import { getRepository } from "@infra/index";
import { Router } from "express";

export const tenantRouter = Router();
tenantRouter.post("/", async (req: any, res: any, next: any) => {
  const tenant = { ...req.body };
  const repo = getRepository<Tenant>("Tenant");
  await repo.create(tenant);
  return res.json({ success: true });
});
