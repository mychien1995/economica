import { Router } from 'express';
import { tenantRouter } from './tenant.route';
import { authRouter } from './auth/auth.route';
import { tenantInterceptor } from '@applications/interceptors';
export const routes  = Router();
routes.use(tenantInterceptor);
routes.use('/tenants', tenantRouter);
routes.use('/auth', authRouter);