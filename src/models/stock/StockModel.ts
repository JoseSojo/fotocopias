import { UserCompleted } from "../../types/user.d";
import { StockCreate, ProductCreate, StockCompleted, ProductCompleted } from "../../types/stock.d";
import AbstractModel from "../BaseModel";

class StockModel extends AbstractModel {

    constructor () {
        super();
    }

    // crear producto
    public async CreateProduct({data}:{data:ProductCreate}) {
        this.StartPrisma();
        const result = await this.prisma.product.create({data});
        this.DistroyPrisma();
        return result; // ProductCompleted -> producto creado
    }   
    
    // actualiza producto
    public async UpdateProduct({id,data}:{id:string,data:ProductCreate}) {
        this.StartPrisma();
        const result = await this.prisma.product.update({data, where:{productId:id}});
        this.DistroyPrisma();
        return result; // ProductCompleted -> producto creado
    }    

    // elimina producto
    public async DeleteProduct({id}:{id:string}) {
        this.StartPrisma();
        await this.prisma.product.update({data:{delete_at:Date.now().toString()}, where:{productId:id}});
        this.DistroyPrisma();
        return true; // boolean
    }   

    // obtiene todos los productos de 10 en 10
    public async GetAllProducts({pag, limit=10}:{pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.product.findMany({ 
            where:{delete_at:null}, 
            skip:pag*limit, 
            take:limit,
            include:{createReference:true}, 
        });
        this.DistroyPrisma();
        return result;
    }

    // obtiene un producto por id
    public async GetProductById({id}:{id:string}) {
        this.StartPrisma();
        const result = await this.prisma.product.findFirst({ 
            where:{productId:id}, 
            include:{createReference:true}, 
        });
        if(result == null) return null;
        
        this.DistroyPrisma();
        return result;
    }

    // crea stock
    public async CreateStock({data}: {data:StockCreate}) {
        this.StartPrisma();
        const result = await this.prisma.stock.create({data});
        this.DistroyPrisma();
        return result; // StockCompleto
    }

    // actualiza stock
    public async UpdateStock({data,id}: {data:StockCreate,id:string}) {
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
            include:{
                productReference:true,
                transaction:true,
                updateReference:true
            }
        });
        this.DistroyPrisma();
        return result;
    }

    // obtiene un stock por id
    public async GetStockById({id}:{id:string}) {
        this.StartPrisma();
        const result = await this.prisma.stock.findFirst({ 
            where:{productId:id}, 
            include:{productReference:true,transaction:true,updateReference:true}, 
        });
        if(result == null) return null;
        this.DistroyPrisma();
        return result;
    }
}

export default StockModel;
