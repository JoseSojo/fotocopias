import { Request, Response } from "express";
import BaseController from "../BaseController";
import StockModel from "../../models/stock/StockModel";
import TransactionModel from "../../models/transacction/TransactionModel";
import EquipmentModel from "../../models/equipment/EquipmentModel";
import { UserCompleted, UserCreate } from "../../types/user";
import { StockCreate } from "../../types/stock";
import MethodModel from "../../models/method/MethodModel";

class StockController extends BaseController {

    // render dashboard
    public async RenderDashboard(req: Request, res: Response) {

        const countPromise = StockModel.CountStockBy({ filter:{} });
        const countEquipment = EquipmentModel.CountEquipmentBy({ filter:{} });

        const Params = {
            countStock: await countPromise,
            countEquipment: await countEquipment
        }

        return res.render(`s/stock/dashboard.hbs`, Params);        
    }

    // render create
    public async RenderCreateStock(req: Request, res: Response) {
        const methodsPromise = MethodModel.GetAllMethodPayment({ pag:0, limit:100 }); 
        const moneyPromise = MethodModel.GetAllMoney({ pag:0, limit:100 }); 

        const Params = {
            methods: await methodsPromise,
            moneys: await moneyPromise
        }

        return res.render(`s/stock/create.hbs`, Params);  
    }

    // render show and update
    public async RenderShowStock(req: Request, res: Response) {
        const id = req.params.id;
        const stock = await StockModel.GetStockById({id});
        const methodsPromise = MethodModel.GetAllMethodPayment({ pag:0, limit:100 }); 
        const moneyPromise = MethodModel.GetAllMoney({ pag:0, limit:100 });

        if(null == stock) {
            req.flash(`err`, `Stock no encontrado.`);
            return res.redirect(`/stock/products`);
        }

        const Params = {
            data:stock,
            methods: await methodsPromise,
            moneys: await moneyPromise};
        console.log(stock);
        return res.render(`s/stock/show.hbs`, Params);  
    }

    // list stock
    public async RenderListStock(req: Request, res: Response) {
        const pag = req.params.pag | 0;
        const limit = req.params.limit | 10; 

        const money = StockModel.GetAllStock({pag, limit});
        const countPromise = StockModel.CountStockBy({ filter:{} });

        const Params = {
            list: await money,
            next: `/stock/list?pag=${pag+1}`,
            previous: pag == 0 ? null : `/stock/list?pag=${pag-1}`,
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
        return res.render(`s/stock/list.hbs`, Params);
    }

    // insert product
    public async CreateStockPost(req: Request, res: Response) {
        try {
            const {name,description,quantity, methodId,mount,concepto,moneyId} = req.body;
            const user = req.user as UserCompleted;
            const objInsert: StockCreate = { 
                updateBy: user.userId, 
                description, 
                name,
                moneyId,
                quantity: Number(quantity),
                transactionId: ``
            };

            const resultTransaction = await TransactionModel.CreateTransaction({data:{
                concepto,
                createBy: user.userId,
                methodPaymentId: methodId,
                mount: Number(mount)
            }});
            objInsert.transactionId = resultTransaction.transactionId;
            const result = await StockModel.CreateStock({ data: objInsert });

            req.flash(`succ`, `Producto creado, ${result.name}`);
            return res.redirect(`/stock/list`);
            
        } catch (error) {
            console.log(error);
            req.flash(`err`, `No se pudo crear el producto`);
            return res.redirect(`/stock/create`);
        }
    }

    // logic update
    public async UpdateStockPost(req: Request, res: Response) {
        try {
            const {quantity, methodId,mount,concepto,moneyId} = req.body;
            const user = req.user as UserCompleted;
            const id = req.params.id;

            const objInsert = { 
                updateBy: user.userId, 
                moneyId,
                quantity: Number(quantity),
                transactionId: ``
            };

            const resultTransaction = await TransactionModel.CreateTransaction({data:{
                concepto,
                createBy: user.userId,
                methodPaymentId: methodId,
                mount: Number(mount)
            }});
            objInsert.transactionId = resultTransaction.transactionId;
            const result = await StockModel.UpdateStock({id, data: objInsert });

            req.flash(`succ`, `Producto actualizado, `);
            return res.redirect(`/stock/list`);
            
        } catch (error) {
            console.log(error);
            req.flash(`err`, `No se pudo actualizar el producto.`);
            return res.redirect(`/stock/create`);
        }
    }
}

export default StockController;
