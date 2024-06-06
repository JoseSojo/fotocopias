import { Request, Response } from "express";
import BaseController from "../BaseController";
import EquipmentModel from "../../models/equipment/EquipmentModel";
import { UserCompleted } from "../../types/user";

class MethodController extends BaseController {

    constructor() {
        super();
    }

    public async RenderCreateEquipment(req: Request, res: Response) {
        const ToView = {}
        return res.render(`s/stock/equipment/create.hbs`,ToView);
    }

    public async RenderShowEquipment(req: Request, res: Response) {
        const id = req.params.id;
        const equipmentPromise = await EquipmentModel.GetEquipmentById({id}); 
        const ToView = {
            data:equipmentPromise
        };
        return res.render(`s/stock/equipment/show.hbs`, ToView);
    }

    public async RenderListEquipment(req: Request, res: Response) {
        const pag = req.params.pag | 0;
        const limit = req.params.limit | 10; 

        const money = EquipmentModel.GetAllEquipment({pag, limit});
        const countPromise = EquipmentModel.CountEquipmentBy({ filter:{} });

        const Params = {
            list: await money,
            next: `/stock/equiment/list?pag=${pag+1}`,
            previous: pag == 0 ? null : `/stock/equiment/list?pag=${pag-1}`,
            count: await countPromise,

            nowTotal: ``,
            requirePagination: false,
            nowPath: pag,
            nowPathOne: pag!=0 ? true : false,
            nowPathEnd: false,
        }

        Params.nowTotal = `${Params.list.length+(pag*10)} / ${Params.count}`;
        Params.nowPathEnd = (Params.list.length-9)>0 ? true : false;
        
        Params.requirePagination = Params.count > 10 ? true : false;
        return res.render(`s/stock/equipment/list.hbs`, Params);
    }

    // logic
    
    public async CreateEquipment(req: Request, res: Response) {
        const {name, description} = req.body;
        const user = req.user as UserCompleted;
        const result = await EquipmentModel.CreateEquipment({data:{name,description,createBy:user.userId}});
        req.flash(`succ`, `Equipo creado, ${name}`);
        return res.redirect(`/stock/equipment`);
    }

    public async UpdateEquipment(req: Request, res: Response) {
        const {name, description} = req.body;
        const id = req.params.id;
        const user = req.user as UserCompleted;
        const result = await EquipmentModel.UpdateEquipment({id,data:{name,description,createBy:user.userId}});
        req.flash(`succ`, `Equipo actualizado, ${name}`);
        return res.redirect(`/stock/equipment`);
    }
}

export default MethodController;
