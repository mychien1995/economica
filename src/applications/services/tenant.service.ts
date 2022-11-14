import { Inject, Service } from 'typedi';
import { Tenant } from '../../domain';
import { IEntityRepository } from '../entity.repository';

@Service()
export class TenantService {
    constructor(@Inject('tenantRepository') private tenantRepo: IEntityRepository<Tenant>) {

    }

    create(t: Tenant) {
        t.Id = '123';
        return this.tenantRepo.create(t);
    }
}