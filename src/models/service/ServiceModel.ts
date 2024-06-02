import { UserCompleted } from "../../types/user.d";
import { ServiceTypeCreate, ServiceCreate, ServiceCompleted, ServiceTypeCompleted } from "../../types/services";
import AbstractModel from "../BaseModel";

class ServiceModel extends AbstractModel {

    constructor () {
        super();
    }

    // crear tipo
    public async CreateServiceType({data}:{data:ServiceTypeCreate}) {
        this.StartPrisma();
        const result = await this.prisma.serviceType.create({data});
        this.DistroyPrisma();
        return result;
    }   
    
    // actualiza ServiceType
    public async UpdateServiceType({id,data}:{id:string,data:ServiceTypeCreate}) {
        this.StartPrisma();
        const result = await this.prisma.serviceType.update({data, where:{serviceTypeId:id}});
        this.DistroyPrisma();
        return result;
    }    

    // elimina ServiceType
    public async DeleteServiceType({id}:{id:string}) {
        this.StartPrisma();
        await this.prisma.serviceType.update({data:{delete_at:Date.now().toString()}, where:{serviceTypeId:id}});
        this.DistroyPrisma();
        return true; // boolean
    }   

    // obtiene todos los ServiceType de 10 en 10
    public async GetAllServiceType({pag, limit=10}:{pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.serviceType.findMany({ 
            where:{delete_at:null}, 
            skip:pag*limit, 
            take:limit,
            include:{
                createReference:true,
                productExpenseReference: true
            }, 
        });
        this.DistroyPrisma();
        return result;
    }

    // obtiene un ServiceType por id
    public async GetServiceTypeById({id}:{id:string}) {
        this.StartPrisma();
        const result = await this.prisma.serviceType.findFirst({ 
            where:{serviceTypeId:id}, 
            include:{
                createReference:true,
                productExpenseReference: true
            }, 
        });
        if(result == null) return null;
        
        this.DistroyPrisma();
        return result;
    }

    // crea Service
    public async CreateService({data}: {data:ServiceCreate}) {
        this.StartPrisma();
        const result = await this.prisma.service.create({data});
        this.DistroyPrisma();
        return result; // Service completo
    }

    // actualiza Service
    public async UpdateService({data,id}: {data:ServiceCreate,id:string}) {
        this.StartPrisma();
        const result = await this.prisma.service.update({data, where:{serviceId:id}});
        this.DistroyPrisma();
        return result; // MethodPayment completo
    }

    // delete Services
    public async DeleteServices({id}: {id:string}) {
        this.StartPrisma();
        const result = await this.prisma.service.update({data:{delete_at:Date.now().toString()}, where:{serviceId:id}});
        this.DistroyPrisma();
        return result; // Services completo
    }

    // obtiene todos los Services de 10 en 10
    public async GetAllServices({pag, limit=10}:{pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.service.findMany({ 
            where:{delete_at:null}, 
            skip:pag*limit, 
            take:limit,
            include:{
                createReference: true,
                transaction: true
            }
        });
        this.DistroyPrisma();
        return result;
    }

    // obtiene un Services por id
    public async GetServicesById({id}:{id:string}) {
        this.StartPrisma();
        const result = await this.prisma.service.findFirst({ 
            where:{serviceId:id}, 
            include:{
                createReference: true,
                transaction: true
            }, 
        });
        if(result == null) return null;
        this.DistroyPrisma();
        return result;
    }
}

export default ServiceModel;
