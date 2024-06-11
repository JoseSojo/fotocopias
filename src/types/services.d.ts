
import { StockCompleted } from "./stock"
import { TransactionCompleted } from "./transaction.d"
import { UserCompleted } from "./user.d"
import { EquimentData } from "./equipment"

export interface TypeCreate {
    name: string,
    description: string,
    createBy: string,
    stockExpenseId: string
}

export interface TypeCompleted {
    createference: UserCompleted,
    stockExpenseReference: StockCompleted,

    create_at: string,
    update_at: string,
    delete_at: string | null
}

export interface ServiceCreate {
    description: string,
    date: string,
    typeId: string,
    createBy: string,
    transactionId: string,
    equipmentId: string,
}

export interface ServiceCompleted {
    serviceId: string,
    createReference: UserCompleted,
    transaction: TransactionCompleted,
    equipmentReference: EquimentData,

    create_at: string,
    update_at: string,
    delete_at: string | null,
}
