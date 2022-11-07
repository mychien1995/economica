import { Tenant } from '@domain/index';
import { Router } from 'express';
import Container from 'typedi';
import { IEntityRepository } from '..';


export const tenantRouter = Router();
tenantRouter.post('/', async (req: any, res: any, next: any) => {
    const tenant = { ...req.body };
    const repo = Container.get('tenantRepository') as IEntityRepository<Tenant>;
    await repo.create(tenant);
    return res.json({ success: true });
});

