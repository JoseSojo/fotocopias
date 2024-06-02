import { UserCompleted } from "./user.d"

export interface MoneyCreate {
    title: string,
    prefix: string,
    description: string | null,
    createBy: string
}

export interface MoneyCompleted extends MoneyCreate {
    moneyId: string,
    createReference: UserCompleted | null,

    create_at: string,
    update_at: string,
    delete_at: string | null
}

export interface MethodPaymentCreate {
    title: string,
    description: string | null,
    moneyId: string,
    createBy: string,
}

export interface MethodPaymentCompleted extends MethodPaymentCreate {
    paymentMethodId: string,

    moneyReference?: MoneyCompleted,
    userReference?: UserCompleted,

    create_at: Date,
    update_at: Date,
    delete_at: Date | null
}
