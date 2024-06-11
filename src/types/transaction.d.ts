import { MoneyCompleted } from "./method.d"
import { UserCompleted } from "./user.d"

export interface TransactionCreate {
    concepto: string,
    mount: number,
    methodPaymentId: string,
    createBy: string,
    type: `INGRESO` | `EGRESO`
}

export interface TransactionCompleted extends TransactionCreate {
    transactionId: string,
    methodPaymentReference: MoneyCompleted,
    createReference: UserCompleted,

    create_at: string,
    delete_at: string
}

