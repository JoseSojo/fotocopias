import { UserCompleted } from "../../types/user.d";
import { StockCreate, StockCompleted } from "../../types/stock.d";
import AbstractModel from "../BaseModel";
import TransactionModel from "../transacction/TransactionModel";

class StockModel extends AbstractModel {

    constructor () {
        super();
    }

    // crea stock
    public async CreateStock({data}: {data:StockCreate}) {
        this.StartPrisma();
        const result = await this.prisma.stock.create({data});
        this.DistroyPrisma();
        return result; // StockCompleto
    }

    // actualiza stock
    public async UpdateStock({data,id}: {data:any,id:string}) {
        this.StartPrisma();
        const result = await this.prisma.stock.update({data, where:{stockId:id}});
        this.DistroyPrisma();
        return result; // StockCompleto
    }

    // delete stock
    public async DeleteStock({id}: {id:string}) {
        this.StartPrisma();
        const result = await this.prisma.stock.update({data:{delete_at:Date.now().toString()}, where:{stockId:id}});
        this.DistroyPrisma();
        return result; // StockCompleto
    }

    // obtiene todos los productos de 10 en 10
    public async GetAllStock({pag, limit=10}:{pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.stock.findMany({ 
            where:{delete_at:null}, 
            skip:pag*limit, 
            take:limit,
        });
        this.DistroyPrisma();
        return result;
    }

    public async CountStockBy({filter}:{filter:any}) {
        this.StartPrisma();
        const result = await this.prisma.stock.count({ where:filter });
        this.DistroyPrisma();
        return result;
    }

    // obtiene un stock por id
    public async GetStockById({id}:{id:string}) {
        this.StartPrisma();
        const result = await this.prisma.stock.findFirst({ 
            where:{stockId:id}, 
            include:{transaction:true,updateReference:true,moneyReference:true,serviceType:true}, 
        });
        if(result == null) return null;
        this.DistroyPrisma();
        return result;
    }
}

export default new StockModel();
