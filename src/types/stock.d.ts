import { TransactionCompleted } from "./transaction"
import { UserCompleted } from "./user.d"

export interface StockCreate {
    quantity: number,
    updateBy: string,
    name: string,
    description: string,
    moneyId: string,
    transactionId: string,
}

export interface StockCompleted extends StockCreate {
    stockId: string,
    updateReference: UserCompleted | null,
    
    transaction: TransactionCompleted,

    create_at: string,
    update_at: string,
    delete_at: string | null
}


