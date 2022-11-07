import { AppImage } from ".";

export class FinancialTransaction {
    Id: string = '';
    CategoryId: string = '';
    Note: string = '';
    Amount: number = 0;
    UserId: string = '';
    TenantId: string = '';
    TransactionType: string = '';
    Photos: AppImage[] = [];
}


export class TransactionCategory {
    Id: string = '';
    Name: string = '';
    TenantId: string = '';
    IsActive: boolean = true;
}