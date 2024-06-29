import { UserCompleted } from "./user";

export interface ReportCreate {
    fecha: string,
    path: string,
    downloader: string,
    createBy: string
    objectType: string
}

export interface ReportCompleted extends ReportCreate {
    reportId: string,
    create_at: string | Date,
    update_at: string | Date,
    delete_at: string | Date | null | undefined,
}
