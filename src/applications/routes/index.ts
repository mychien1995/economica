import { Router } from 'express';
import { tenantRouter } from './tenant.route';
export const routes  = Router();
routes.use('/tenants', tenantRouter);