import { Request, Response } from "express";
import BaseController from "../BaseController";
import ServiceModel from "../../models/service/ServiceModel";
import StockModel from "../../models/stock/StockModel";
import { TypeCreate } from "../../types/services";
import { UserCompleted } from "../../types/user";

class ServiceTypeController extends BaseController {

    constructor() {
        super();
    }

    public async RenderCreate(req: Request, res: Response) {

        const stockPromise = StockModel.GetAllStock({ pag:0, limit:100 });

        const ToView = {
            stock: await stockPromise
        };
        return res.render(`s/service/type/create.hbs`, ToView);
    }

    public async RenderList(req: Request, res: Response) {
        const pag = req.params.pag | 0;
        const limit = req.params.limit | 10; 

        const types = ServiceModel.GetAllTypes({pag, limit});
        const typesCount = ServiceModel.CountTypesBy({ filter:{} });

        const Params = {
            list: await types,
            next: `/service/types/list?pag=${pag+1}`,
            previous: pag == 0 ? null : `/service/type/list?pag=${pag-1}`,
            count: await typesCount,

            nowTotal: ``,
            requirePagination: false,
            nowPath: pag,
            nowPathOne: pag!=0 ? true : false,
            nowPathEnd: false,
        }

        Params.nowTotal = `${Params.list.length+(pag*10)} / ${Params.count}`;
        Params.nowPathEnd = (Params.list.length-9)>0 ? true : false;
        
        Params.requirePagination = Params.count > 10 ? true : false;
        return res.render(`s/service/type/list.hbs`, Params);
    }

    public async RenderShow(req: Request, res: Response) {
        const id = req.params.id;
        const type = await ServiceModel.GetTypeById({id});

        console.log(type);

        const ToView = {data:type};
        return res.render(`s/service/type/show.hbs`, ToView);
    }


    public async CreateTypePost(req:Request, res: Response) {
        const {name, description, stockExpenseId} = req.body;
        const user = req.user as UserCompleted;
        const data: TypeCreate = {
            createBy: user.userId,
            description,
            name,
            stockExpenseId
        }

        const result = await ServiceModel.CreateType({data});
        req.flash(`succ`, `Tipo creado`);
        return res.redirect(`/service/types`);
    }
}

export default ServiceTypeController;
