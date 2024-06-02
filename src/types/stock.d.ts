import { TransactionCompleted } from "./transaction"
import { UserCompleted } from "./user.d"

export interface ProductCreate {
    name: string,
    description: string,
    createBy: string
}

export interface ProductCompleted extends ProductCreate {
    productId: string,
    create_at: string,
    delete_at: string | null
}

export interface StockCreate {
    productId: string,
    quantityProduct: number,
    updateBy: string,
    transactionId: string,
}

export interface StockCompleted extends StockCreate {
    stockId: string,
    productReference: ProductCompleted | null,
    updateReference: UserCompleted | null,
    
    transaction: TransactionCompleted,

    create_at: string,
    update_at: string,
    delete_at: string | null
}


