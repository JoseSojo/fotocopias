import { UserCompleted } from "../../types/user";
import { TransactionCreate as TransactionCreateType } from "../../types/transaction";
import AbstractModel from "../BaseModel";

class TransactionModel extends AbstractModel {

    constructor () {
        super();
    }

    // count
    public async CountAllTransactions({}:{}) {
        this.StartPrisma();
        const allPromise = this.prisma.transaction.count({});
        const egresoPromise = this.prisma.transaction.count({ where:{ OR:[{type:`EGRESO`}, {concepto: { startsWith:`egreso` }}] } });
        const ingresoPromise = this.prisma.transaction.count({ where:{ OR:[{type:`INGRESO`}, {concepto: { startsWith:`ingreso` }}] } });
        const all = await allPromise;
        const egreso = await egresoPromise;
        const ingreso = await ingresoPromise;
        this.DistroyPrisma();
        return { all,egreso,ingreso };
    }

    // crear Transaction
    public async CreateTransaction({data}:{data:TransactionCreateType}) {
        this.StartPrisma();
        const result = await this.prisma.transaction.create({data});
        this.DistroyPrisma();
        this.StaticticsUpdate({});
        return result;
    }   
    
    // actualiza Transaction
    public async UpdateTransaction({id,data}:{id:string,data:TransactionCreateType}) {
        this.StartPrisma();
        const result = await this.prisma.transaction.update({data, where:{transactionId:id}});
        this.DistroyPrisma();
        return result;
    }    

    // elimina Transaction
    public async DeleteTransaction({id}:{id:string}) {
        this.StartPrisma();
        await this.prisma.transaction.update({data:{delete_at:Date.now().toString()}, where:{transactionId:id}});
        this.DistroyPrisma();
        return true; // boolean
    }   

    // obtiene todos los Transaction de 10 en 10
    public async GetAllTransaction({pag, limit=10}:{pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.transaction.findMany({ 
            where:{delete_at:null}, 
            skip:pag*limit, 
            take:limit,
            include:{
                createReference: true,
                methodPaymentReference: true
            }, 
        });
        this.DistroyPrisma();
        return result;
    }

    // obtiene un Transaction por id
    public async GetTransactionById({id}:{id:string}) {
        this.StartPrisma();
        const result = await this.prisma.transaction.findFirst({ 
            where:{transactionId:id}, 
            include:{
                methodPaymentReference: true,
                createReference:true
            }, 
        });
        if(result == null) return null;
        
        this.DistroyPrisma();
        return result;
    }

    // statics users actives
    public async UsersActives({limit=5}:{limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.transaction.groupBy({
            by: "createBy",
            _count: {
                createBy:true
            },
            orderBy: {
                createBy: "asc"
            },
            take: limit,
        });
        this.DistroyPrisma();
        return result;
    }
}

export default new TransactionModel;
