import { Tenant } from "@domain/index";
import { getRepository } from "@infra/index";
import { Router } from "express";
import { masterApiKeyFilter } from "@applications/routes/auth/auth.route";

export const tenantRouter = Router();
tenantRouter.post(
  "/",
  masterApiKeyFilter,
  async (req: any, res: any, next: any) => {
    const tenant = { ...req.body };
    const repo = getRepository<Tenant>("Tenant");
    await repo.create(tenant);
    return res.json({ success: true });
  }
);
