import { Tenant } from '@domain/index';
import { Router } from 'express';
import Container from 'typedi';
import { IEntityRepository } from '..';


export const authRouter = Router();
authRouter.post('/register', async (req: any, res: any, next: any) => {
    const user = <>{ ...req.body };
    const repo = Container.get('tenantRepository') as IEntityRepository<Tenant>;
    await repo.create(tenant);
    return res.json({ success: true });
});

