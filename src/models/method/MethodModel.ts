import { UserCompleted } from "../../types/user.d";
import { MoneyCreate, MethodPaymentCreate, MoneyCompleted, MethodPaymentCompleted } from "../../types/method";
import AbstractModel from "../BaseModel";

class MethodModel extends AbstractModel {

    constructor () {
        super();
    }

    public async CountMoneyBy({filter}:{filter:any}) {
        const result = this.prisma.money.count({ where: filter });
        return result
    } 

    public async CountMethodBy({filter}:{filter:any}) {
        const result = this.prisma.paymentMethod.count({ where: filter });
        return result
    } 

    // crear moneda
    public async CreateMoney({data}:{data:MoneyCreate}) {
        this.StartPrisma();
        const result = await this.prisma.money.create({data});
        this.DistroyPrisma();
        return result;
    }   
    
    // actualiza moneda
    public async UpdateMoney({id,data}:{id:string,data:MoneyCreate}) {
        this.StartPrisma();
        const result = await this.prisma.money.update({data, where:{moneyId:id}});
        this.DistroyPrisma();
        return result;
    }    

    // elimina moneda
    public async DeleteMoney({id}:{id:string}) {
        this.StartPrisma();
        await this.prisma.money.update({data:{delete_at:Date.now().toString()}, where:{moneyId:id}});
        this.DistroyPrisma();
        return true; // boolean
    }   

    // obtiene todos los moneda de 10 en 10
    public async GetAllMoney({pag, limit=10}:{pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.money.findMany({ 
            where:{delete_at:null}, 
            skip:pag*limit, 
            take:limit,
            include:{createReference:true}, 
        });
        this.DistroyPrisma();
        return result;
    }

    // obtiene un moneda por id
    public async GetMoneyById({id}:{id:string}) {
        this.StartPrisma();
        const result = await this.prisma.money.findFirst({ 
            where:{moneyId:id}, 
            include:{createReference:true}, 
        });
        if(result == null) return null;
        
        this.DistroyPrisma();
        return result;
    }

    // crea MethodPayment
    public async CreateMethodPayment({data}: {data:MethodPaymentCreate}) {
        this.StartPrisma();
        const result = await this.prisma.paymentMethod.create({data});
        this.DistroyPrisma();
        return result; // MethodPayment completo
    }

    // actualiza MethodPayment
    public async UpdateMethodPayment({data,id}: {data:MethodPaymentCreate,id:string}) {
        this.StartPrisma();
        const result = await this.prisma.paymentMethod.update({data, where:{paymentMethodId:id}});
        this.DistroyPrisma();
        return result; // MethodPayment completo
    }

    // delete MethodPayment
    public async DeleteMethodPayment({id}: {id:string}) {
        this.StartPrisma();
        const result = await this.prisma.paymentMethod.update({data:{delete_at:Date.now().toString()}, where:{paymentMethodId:id}});
        this.DistroyPrisma();
        return result; // MethodPayment completo
    }

    // obtiene todos los MethodPayment de 10 en 10
    public async GetAllMethodPayment({pag, limit=10}:{pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.paymentMethod.findMany({ 
            where:{delete_at:null}, 
            skip:pag*limit, 
            take:limit,
            include:{
                createReference: true,
                moneyReference: true
            }
        });
        this.DistroyPrisma();
        console.log(result);
        return result;
    }

    // obtiene un MethodPayment por id
    public async GetMethodPaymentById({id}:{id:string}) {
        this.StartPrisma();
        const result = await this.prisma.paymentMethod.findFirst({ 
            where:{paymentMethodId:id}, 
            include:{
                createReference: true,
                moneyReference: true
            }, 
        });
        if(result == null) return null;
        this.DistroyPrisma();
        return result;
    }
}

export default new MethodModel();
