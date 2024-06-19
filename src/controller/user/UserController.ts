import { Request, Response } from "express";
import BaseController from "../BaseController";
import UserModel from "../../models/user/UserModel";
import MethodModel from "../../models/method/MethodModel";
import ServiceModel from "../../models/service/ServiceModel";
import TransactionModel from "../../models/transacction/TransactionModel";
import { UserCompleted, UserCreate } from "../../types/user";

class UserController extends BaseController {

    public async DashboardController (req: Request, res: Response) {
        const date = new Date();
        const pag = req.params.pag | 0;
        const limit = req.params.limit | 10; 

        const moneysPromise = MethodModel.GetAllMoney({ pag:0, limit:10 });
        const serviceCountPromise = ServiceModel.CountService({ filter:{} });
        const transactionsCountPromise = TransactionModel.CountAllTransactions({});
        const years = MethodModel.GetYears({});
        const month = date.getMonth()+1;
        const toDay = `${date.getFullYear()}-${month<10 ? `0${month}`:`${month}` }-${date.getDate()}`;

        const serviceToDay = ServiceModel.GetAllServicesFilter({ filter:{date:toDay} });
        const countService = ServiceModel.CountService({ filter:{date:toDay} })

        const transsactions = await transactionsCountPromise;

        const Params = {
            years: await years,
            moneys: await moneysPromise,
            servicesCount: await serviceCountPromise,
            transactionCount: transsactions.all,
            egresoCount: transsactions.egreso,
            ingresoCount: transsactions.ingreso,
            ubication: `Resumen`,

            servicesToDay: await serviceToDay,
            next: `/users/list?pag=${pag+1}`,
            previous: pag == 0 ? null : `/users/list?pag=${pag-1}`,
            count: await countService,

            nowTotal: ``,
            requirePagination: false,
            nowPath: pag,
            nowPathOne: pag!=0 ? true : false,
            nowPathEnd: false,
            toDay
        }

        Params.nowTotal = `${Params.servicesToDay.length+(pag*10)} / ${Params.count}`;
        Params.nowPathEnd = (Params.servicesToDay.length-9)>0 ? true : false;
        
        Params.requirePagination = Params.count > 10 ? true : false;

        return res.render(`s/dashboard.hbs`, Params);
    }

    public async StaticticsController (req: Request, res: Response) {
        const moneysPromise = MethodModel.GetAllMoney({ pag:0, limit:10 });
        const serviceCountPromise = ServiceModel.CountService({ filter:{} });
        const years = MethodModel.GetYears({});

        return res.render(`s/statictics.hbs`, {
            years: await years,
            moneys: await moneysPromise,
            servicesCount: await serviceCountPromise,
            ubication: `Resumen`,
        });
    }

    // render dashboard
    public async RenderDashboard(req: Request, res: Response) {

        const countPromise = UserModel.CountBy({ filter:{} });

        const Params = {
            count: await countPromise
        }

        return res.render(`s/user/dashboard.hbs`, Params);        
    }

    // render list
    public async RenderList(req: Request, res: Response) {
        const pag = req.params.pag | 0;
        const limit = req.params.limit | 10; 

        const users = UserModel.GetUsers({pag, limit});
        const countPromise = UserModel.CountBy({ filter:{} });

        const Params = {
            list: await users,
            next: `/users/list?pag=${pag+1}`,
            previous: pag == 0 ? null : `/users/list?pag=${pag-1}`,
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

        return res.render(`s/user/list.hbs`, Params);     
    }

    // render create
    public async RenderCreate(req: Request, res: Response) {
        const Params = {}

        return res.render(`s/user/create.hbs`, Params);  
    }

    // render show and update
    public async RenderShow(req: Request, res: Response) {
        const id = req.params.id;
        const user = await UserModel.FindUserById({id});

        if(null == user) {
            req.flash(`err`, `Usuario no encontrado.`);
            return res.redirect(`/users/list`);
        }

        const Params = {data:user};
        return res.render(`s/user/show.hbs`, Params);  
    }

    // logic register
    public async CreateUserPost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const NewUser: UserCreate = {
                createBy: user.userId,
                email: req.body.email,
                lastname: req.body.lastname,
                name: req.body.name,
                password: await UserModel.HashPassword({ password: req.body.password }),
                username: req.body.username
            } 
            
            const ResultUser = await UserModel.CreateUser({ data: NewUser });
            req.flash(`succ`, `Usuario creado.`);
            return res.redirect(`/users`);

        } catch (error) {
            console.log(error);
            req.flash(`err`, `No se pudo crear el usuario.`);
            return res.redirect(`/users`);
        }
    }
}

export default UserController;
