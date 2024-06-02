import { ProductCompleted } from "./stock.d"
import { TransactionCompleted } from "./transaction.d"
import { UserCompleted } from "./user.d"

export interface ServiceTypeCreate {
    name: string,
    description: string,
    tonel: boolean,

    productExpenseId: string,
    createBy: string,
}

export interface ServiceTypeCompleted extends ServiceTypeCreate {
    serviceTypeId: string,

    productExpenseReference: ProductCompleted,
    createReference: UserCompleted,

    create_at: string,
    delete_at: string
}

export interface ServiceCreate {
    description: string,
    date: string,
    createBy: string,
    transactionId: string,

    listServicesReferences: string,
}

export interface ServiceCompleted extends ServiceCreate {
    serviceId: string,

    createReference: UserCompleted,
    transaction: TransactionCompleted,

    create_at: string,
    update_at: string,
    delete_at: string

}
