import { ServiceCreate, TypeCreate } from "../../types/services";
import { UserCompleted } from "../../types/user.d";
import AbstractModel from "../BaseModel";

class ServiceModel extends AbstractModel {

    constructor () {
        super();
    }

    public async GetAllServicesFilter({filter, pag=0, limit=100}:{filter:{date:string}, pag:number,limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.service.findMany({ 
            where:{
                date:{
                    equals: filter.date
                }
            }, 
            include: {
                createReference: true,
                equipmentReference: true,
                transaction: {
                    include: {
                        methodPaymentReference: {
                            include: {
                                moneyReference: true
                            }
                        }
                    }
                },
                typeReferences: true
            },
            skip: pag*limit,
            take: limit,
        });
        this.DistroyPrisma();
        return result;
    }

    public async CreateType({data}:{data:TypeCreate}) {
        this.StartPrisma();
        const result = await this.prisma.serviceType.create({data});
        this.DistroyPrisma();
        return result;
    }

    public async GetAllTypes({pag,limit=10}: {pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.serviceType.findMany({
            include: {
                createReference: true,
                stockExpenseReference: true,
                _count: true
            },
            skip: pag*limit,
            take: limit
        });
        this.DistroyPrisma();
        return result;
    }

    public async GetTypeById({id}:{id:string}) {
        this.StartPrisma();
        const result = await this.prisma.serviceType.findFirst({ where:{serviceTypeId:id}, 
            include:{createReference:true,stockExpenseReference: true, _count:true

            } });
        this.DistroyPrisma();
        return result;
    }

    public async UpdateType({id,data}:{id:string,data:TypeCreate}) {
        this.StartPrisma();
        const result = await this.prisma.serviceType.update({where:{serviceTypeId:id}, data }); 
        this.DistroyPrisma();
        return result;
    }

    public async CountTypesBy({filter}: {filter:any}) {
        this.StartPrisma();
        const result = await this.prisma.serviceType.count({ where:filter });
        this.DistroyPrisma();
        return result;
    }

    public async CountService({filter}: {filter:any}) {
        this.StartPrisma();
        const result = await this.prisma.service.count({ where:{
            date: `2024-07-01`
        } });
        this.DistroyPrisma();
        return result;
    }

    public async CreateService({data}: {data:ServiceCreate}) {
        this.StartPrisma();
        const result = await this.prisma.service.create({ data });
        this.DistroyPrisma();
        return result;
    }

    public async GetAllService({pag,limit=0}: {pag:number,limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.service.findMany({
            include: {
                createReference: true,
                equipmentReference: true,
                transaction: {
                    include: {
                        methodPaymentReference: true,
                    }
                },
                typeReferences: true,
            },
            skip:pag*limit,
            take:limit
        });
        this.DistroyPrisma();
        return result;
    }

    public async GetServiceById({id}:{id:string}) {
        this.StartPrisma();
        const result = await this.prisma.service.findFirst({ 
            where:{ serviceId:id},
            include:{ 
                createReference:true,
                equipmentReference:true,
                transaction: {
                    include: {
                        methodPaymentReference:{
                            include: {
                                moneyReference: true
                            }
                        },
                        createReference: true,
                    }         
                },
                typeReferences: {
                    include: {
                        stockExpenseReference: true
                    }
                }
            } 
        });
        this.DistroyPrisma();
        return result;
    }

    // estadísticas.

    public async StatisticsServicesType() {
        this.StartPrisma();
        const result = await this.prisma.service.groupBy({
            by: "typeId",
            _count: { _all:true }
        });

        this.DistroyPrisma();
        this.StaticticsUpdate({});
        return result;
    }

}

export default new ServiceModel();
