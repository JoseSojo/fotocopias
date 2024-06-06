import { UserCompleted } from "./user"

export interface EquimentCreate {
    name: string,
    description: string,
    createBy: string
}

export interface EquimentData {
    servicesId: any,
    createReference: UserCompleted,

    create_at:string,
    update_at:string,
    delete_at:string | null
}
