import { Request, Response } from "express";
import AbstractModel from "../BaseModel";
import { EquimentCreate } from "../../types/equipment";

class MethodModel extends AbstractModel {

    constructor() {
        super();
    }

    public async CreateEquipment({data}:{data:EquimentCreate}) {
        this.StartPrisma();
        const result = await this.prisma.equipment.create({data});  
        this.DistroyPrisma();
        this.StaticticsUpdate({});
        return result;
    }

    public async GetEquipmentById({id}:{id:string}) {
        this.StartPrisma();
        const result = await this.prisma.equipment.findFirst({where:{equipmentId:id}, include: { servicesId: true, createReference: true }});
        this.DistroyPrisma();
        return result;
    }

    public async GetAllEquipment({pag,limit=10}:{pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.equipment.findMany({
            skip:pag*limit,
            take:limit,
            include: { servicesId: true, createReference: true}
        });
        this.DistroyPrisma();
        return result;
    }

    public async UpdateEquipment({id,data}:{id:string,data:EquimentCreate}) {
        this.StartPrisma();
        const result = await this.prisma.equipment.update({ where:{equipmentId:id}, data })
        this.DistroyPrisma();
        return result;
    }

    public async CountEquipmentBy({filter}:{filter:any}) {
        this.StartPrisma();
        const result = await this.prisma.equipment.count({ where:filter });
        this.DistroyPrisma();
        return result;
    }
}

export default new MethodModel();
