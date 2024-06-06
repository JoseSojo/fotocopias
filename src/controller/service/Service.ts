import { Request, Response } from "express";
import BaseController from "../BaseController";
import StockModel from "../../models/stock/StockModel";
import ServiceModel from "../../models/service/ServiceModel";
import MethodModel from "../../models/method/MethodModel";
import EquipmentModel from "../../models/equipment/EquipmentModel";
import { ServiceCreate, TypeCreate } from "../../types/services";
import { UserCompleted } from "../../types/user";
import { TransactionCreate } from "../../types/transaction";
import TransactionModel from "../../models/transacction/TransactionModel";

class ServiceController extends BaseController {

    constructor() {
        super();
    }

    public async RenderDashboard(req: Request, res: Response) {

        const stockPromise = StockModel.GetAllStock({ pag:0, limit:100 });

        const ToView = {
            stock: await stockPromise
        };
        return res.render(`s/service/dashboard.hbs`, ToView);
    }

    public async RenderCreate(req: Request, res: Response) {

        const typesPromise = ServiceModel.GetAllTypes({pag:0,limit:100});
        const moneyPromise = MethodModel.GetAllMoney({ pag:0, limit:100 });
        const methodPromise = MethodModel.GetAllMethodPayment({ pag:0, limit:100 });
        const equipmentPromise = EquipmentModel.GetAllEquipment({ pag:0, limit:100 });

        const ToView = {
            types: await typesPromise,
            moneys: await moneyPromise,
            methods: await methodPromise,
            equipments: await equipmentPromise,
        };
        return res.render(`s/service/create.hbs`, ToView);
    }

    public async RenderList(req: Request, res: Response) {
        const pag = req.params.pag | 0;
        const limit = req.params.limit | 10; 

        const types = ServiceModel.GetAllService({pag, limit});
        const typesCount = ServiceModel.CountService({ filter:{} });

        const Params = {
            list: await types,
            next: `/service/list?pag=${pag+1}`,
            previous: pag == 0 ? null : `/service/list?pag=${pag-1}`,
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
        return res.render(`s/service/list.hbs`, Params);
    }

    public async RenderShow(req: Request, res: Response) {
        const id = req.params.id;
        const service = await ServiceModel.GetServiceById({id});
        const ToView = {data:service};
        console.log(service);
        return res.render(`s/service/show.hbs`, ToView);
    }


    public async CreateTypePost(req:Request, res: Response) {
        const {date, description, stockExpenseId,serviceType,quantity,equipment,method,mount,concepto} = req.body;
        const user = req.user as UserCompleted;
        
        console.log(req.body);

        /*const data: ServiceCreate = {
            date, description,
            createBy:user.userId,
            equipmentId:equipment,
            listServicesReferences: serviceType,
            transactionId: ``
        }

        const transactionSave: TransactionCreate = {
            concepto,
            mount: Number(mount),
            createBy: user.userId,
            methodPaymentId: method
        }

        const stock = await StockModel.GetStockById({id:stockExpenseId});
        if(!stock) {
            req.flash(`err`, `Error temporal, intentelo más tarde`);
            return res.redirect(`/service`);
        }

        // actualiza stock
        const save = stock.quantity - Number(quantity);
        console.log(`de: ${stock.quantity} quedaron ${save}, ${quantity}`);
        const stockPromise = StockModel.UpdateStock({ id:stock.stockId, data:{quantity:save} });

        const transactionResult = await TransactionModel.CreateTransaction({ data:transactionSave });
        data.transactionId = transactionResult.transactionId;

        const servicePromise = ServiceModel.CreateService({ data });

        await stockPromise;
        await servicePromise;*/

        req.flash(`succ`, `Servicio creado.`);
        return res.redirect(`/service/types`);
    }

    public async CreateServicePost(req:Request, res: Response) {
        const {date, description, stockExpenseId,serviceType,quantity,equipment,method,mount,concepto} = req.body;
        const user = req.user as UserCompleted;
        
        console.log(req.body);

        const data: ServiceCreate = {
            date, 
            description,
            createBy:user.userId,
            equipmentId:equipment,
            typeId: serviceType.split(`---`)[0] as string,
            transactionId: ``
        }

        const transactionSave: TransactionCreate = {
            concepto,
            mount: Number(mount),
            createBy: user.userId,
            methodPaymentId: method
        }

        const stock = await StockModel.GetStockById({id:stockExpenseId});
        if(!stock) {
            req.flash(`err`, `Error temporal, intentelo más tarde`);
            return res.redirect(`/service`);
        }

        // actualiza stock
        const save = stock.quantity - Number(quantity);
        const stockPromise = StockModel.UpdateStock({ id:stock.stockId, data:{quantity:save} });

        const transactionResult = await TransactionModel.CreateTransaction({ data:transactionSave });
        data.transactionId = transactionResult.transactionId;

        console.log(data);

        const servicePromise = ServiceModel.CreateService({ data });

        await stockPromise;
        await servicePromise;

        req.flash(`succ`, `Servicio creado.`);
        return res.redirect(`/service/types`);
    }
}

export default ServiceController;
