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

class TransactionController extends BaseController {

    constructor() {
        super();
    }

    public async RenderList(req: Request, res: Response) {
        const pag = req.query.pag | 0;
        const limit = req.query.limit | 10; 
        const type = req.query.type || `ALL`;

        const filter: any = {};

        if(type === `INGRESO`) {
            filter.type = `INGRESO`
        }
        if(type === `EGRESO`) {
            filter.type = `EGRESO`
        }

        const transaction = TransactionModel.GetAllTransaction({pag:parseInt(`${pag}`), limit:parseInt(`${limit}`), filter});
        const transactionCount = await TransactionModel.CountAllTransactions({ filter });

        const Params = {
            list: await transaction,
            next: `/transaction/list?pag=${pag+1}&type=${type}`,
            previous: pag == 0 ? null : `/transaction/list?pag=${pag-1}&type=${type}&limit=${limit}`,
            count: 
                type == `EGRESO` ? transactionCount.egreso : 
                type == `INGRESO` ? transactionCount.ingreso :
                transactionCount.all,

            nowTotal: ``,
            requirePagination: false,
            nowPath: pag,
            nowPathOne: pag!=0 ? true : false,
            nowPathEnd: false,
        }

        Params.nowTotal = `${Params.list.length+(pag*10)} / ${Params.count}`;
        Params.nowPathEnd = (Params.list.length-9)>0 ? true : false;
        
        Params.requirePagination = Params.count > 10 ? true : false;
        return res.render(`s/transaction/list.hbs`, Params);
    }

    public async RenderShow(req: Request, res: Response) {
        const id = req.params.id;
        const transaction = await TransactionModel.GetTransactionById({id});
        const ToView = {data:transaction};
        return res.render(`s/transaction/show.hbs`, ToView);
    }
}

export default TransactionController;
