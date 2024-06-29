import { Request, Response } from "express";
import BaseController from "../BaseController";
import MethodModel from "../../models/method/MethodModel";
import { UserCompleted } from "../../types/user";
import { MethodPaymentCreate, MoneyCreate } from "../../types/method";

class ConfigController extends BaseController {

    constructor() {
        super();
    }

    // render dashboard
    public async RenderDashboard(req: Request, res: Response) {

        const countMoneyPromise = MethodModel.CountMoneyBy({ filter:{} });
        const countMethodPromise = MethodModel.CountMethodBy({ filter:{} });

        const Params = {
            countMoney: await countMoneyPromise,
            countMethod: await countMethodPromise
        }

        return res.render(`s/config/dashboard.hbs`, Params);        
    }

    // render list
    public async RenderMoneyList(req: Request, res: Response) {
        const pag = req.query.pag | 0;
        const limit = req.query.limit | 10; 

        const money = MethodModel.GetAllMoney({pag, limit});
        const countPromise = MethodModel.CountMoneyBy({ filter:{} });

        const Params = {
            list: await money,
            next: `/config/money/list?pag=${pag+1}`,
            previous: pag == 0 ? null : `/config/money/list?pag=${pag-1}`,
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

        return res.render(`s/config/money/list.hbs`, Params);     
    }

    // render create
    public async RenderMoneyCreate(req: Request, res: Response) {
        const Params = {}

        return res.render(`s/config/money/create.hbs`, Params);  
    }

    // render show and update
    public async RenderMoneyShow(req: Request, res: Response) {
        const id = req.params.id;
        const money = await MethodModel.GetMoneyById({id});

        if(null == money) {
            req.flash(`err`, `Usuario no encontrado.`);
            return res.redirect(`/config/moneys/list`);
        }

        const Params = {data:money};
        return res.render(`s/config/money/show.hbs`, Params);  
    }



    // render list method
    public async RenderMethodList(req: Request, res: Response) {
        const pag = req.query.pag | 0;
        const limit = req.query.limit | 10; 

        const method = MethodModel.GetAllMethodPayment({pag, limit});
        const countPromise = MethodModel.CountMethodBy({ filter:{} });

        const Params = {
            list: await method,
            next: `/config/method/list?pag=${pag+1}`,
            previous: pag == 0 ? null : `/config/method/list?pag=${pag-1}`,
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

        return res.render(`s/config/method/list.hbs`, Params);     
    }

    // render create method
    public async RenderMethodCreate(req: Request, res: Response) {
        const moneyPromise = MethodModel.GetAllMoney({ limit:10, pag:0 });

        const Params = {
            moneys: await moneyPromise
        }

        return res.render(`s/config/method/create.hbs`, Params);  
    }

    // render show and update method
    public async RenderMethodShow(req: Request, res: Response) {
        const id = req.params.id;
        const method = await MethodModel.GetMethodPaymentById({id});


        if(null == method) {
            req.flash(`err`, `Usuario no encontrado.`);
            return res.redirect(`/config/methods/list`);
        }

        const Params = {
            data:method,
            methodTransaction: 20,
        };
        return res.render(`s/config/method/show.hbs`, Params);  
    }



    // logic create money
    public async CreateMoneyPost(req: Request, res: Response) {
        try {
            
            const user = req.user as UserCompleted;
            const id = user.userId;

            const NewMoney: MoneyCreate = {
                createBy: id,
                description: req.body.description,
                prefix: req.body.prefix,
                title: req.body.title
            }
            const  result = await MethodModel.CreateMoney({ data:NewMoney });
            req.flash(`succ`, `Moneda creada`);
            return res.redirect(`/config/moneys`);

        } catch (error) {
            console.log(error);
            req.flash(`err`, `Error temporal.`);
            return res.redirect(`/config/money/create`);
        }
    }

    // logic update money
    public async UpdateMoneyPost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const id = req.params.id;

            const Update: MoneyCreate = {
                createBy: user.userId,
                description: req.body.description,
                prefix: req.body.prefix,
                title: req.body.title
            }

            const  result = await MethodModel.UpdateMoney({id, data:Update });
            req.flash(`succ`, `Moneda actualizada.`);
            return res.redirect(`/config/moneys`);

        } catch (error) {
            console.log(error);
            req.flash(`err`, `Error temporal.`);
            return res.redirect(`/config/moneys`);
        }
    }

    // logic create method
    public async CreateMethodPost(req: Request, res: Response) {
        try {
            
            const user = req.user as UserCompleted;
            const id = user.userId;

            const NewMethod: MethodPaymentCreate = {
                createBy: id,
                description: req.body.description,
                title: req.body.title,
                moneyId: req.body.money
            }
            const  result = await MethodModel.CreateMethodPayment({ data:NewMethod });
            req.flash(`succ`, `Método creado.`);
            return res.redirect(`/config/methods`);

        } catch (error) {
            console.log(error);
            req.flash(`err`, `Error temporal.`);
            return res.redirect(`/config/money/create`);
        }
    }

    // logic update method
    public async UpdateMethodPost(req: Request, res: Response) {
        try {
            
            const user = req.user as UserCompleted;
            const id = req.params.id;

            const NewMethod: MethodPaymentCreate = {
                createBy: user.userId,
                description: req.body.description,
                title: req.body.title,
                moneyId: req.body.money
            }
            const  result = await MethodModel.UpdateMethodPayment({id, data:NewMethod });
            req.flash(`succ`, `Método actualizado.`);
            return res.redirect(`/config/methods`);

        } catch (error) {
            console.log(error);
            req.flash(`err`, `Error temporal.`);
            return res.redirect(`/config/methods`);
        }
    }

}

export default ConfigController;
