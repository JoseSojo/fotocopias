import { Request, Response } from "express";
import BaseController from "../BaseController";
import UserModel from "../../models/user/UserModel";
import StockModel from "../../models/stock/StockModel";
import EquipmentModel from "../../models/equipment/EquipmentModel";
import MethodModel from "../../models/method/MethodModel";
import ServiceModel from "../../models/service/ServiceModel";
import TransactionModel from "../../models/transacction/TransactionModel";
import { UserCompleted, UserCreate } from "../../types/user";

class UserController extends BaseController {

    public async RenderProfile(req: Request, res: Response) {

        const user = req.user as UserCompleted;
        const userData = await UserModel.FindUserById({id:user.userId});

        const Params = {
            data: userData,
        }

        return res.render(`s/user/profile.hbs`, Params);
    }

    public async DashboardController (req: Request, res: Response) {
        const date = new Date();
        const pag = req.query.pag | 0;
        const limit = req.query.limit | 10; 


        const moneysPromise = MethodModel.GetAllMoney({ pag:0, limit:10 });
        const serviceCountPromise = ServiceModel.CountService({ filter:{} });
        const userCountPromise = UserModel.CountBy({ filter:{} });
        const methodCountPromise = MethodModel.CountMethodBy({ filter:{} });
        const equipmentCountPromise = EquipmentModel.CountEquipmentBy({ filter:{} });
        const transactionsCountPromise = TransactionModel.CountAllTransactions({});
        const years = MethodModel.GetYears({});
        const month = date.getMonth()+1;
        const day = date.getDate();
        const toDay = `${date.getFullYear()}-${month<10 ? `0${month}`:`${month}` }-${day<10 ? `0${day}`:`${day}` }`;

        const serviceToDay = ServiceModel.GetAllServicesFilter({ filter:{date:toDay}, pag:0,limit:100 });
        const countService = ServiceModel.CountService({ filter:{date:toDay} })

        const transsactions = await transactionsCountPromise;

        const Params = {
            years: await years,
            moneys: await moneysPromise,

            servicesCount: await serviceCountPromise,
            transactionCount: transsactions.all,
            egresoCount: transsactions.egreso,
            ingresoCount: transsactions.ingreso,
            userCount: await userCountPromise,
            methodCount: await methodCountPromise,
            equipmentCount: await equipmentCountPromise,

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

    public async RenderReportController (req: Request, res: Response) {
        const pag = req.query.pag | 0;
        const limit = req.query.limit | 10; 

        console.log(pag);

        const reports = UserModel.GetReports({pag, limit});
        const countPromise = UserModel.CountReport({ filter:{} });

        const Params = {
            list: await reports,
            next: `/dashboard/report?pag=${pag+1}`,
            previous: pag == 0 ? null : `/dashboard/report?pag=${pag-1}`,
            count: await countPromise,

            nowTotal: ``,
            requirePagination: false,
            nowPath: pag,
            nowPathOne: pag!=0 ? true : false,
            nowPathEnd: false,
        }

        Params.nowTotal = `${Params.list.length+(pag*10)} / ${Params.count}`;
        Params.nowPathEnd = (Params.list.length-9)>0 ? true : false;
        
        console.log(Params.next, Params.previous);
        Params.requirePagination = Params.count > 10 ? true : false;

        return res.render(`s/report.hbs`, Params); 
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
        const pag = req.query.pag | 0;
        const limit = req.query.limit | 10; 

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

    public async UpdateDataUser(req: Request, res: Response) {
        const {email,username,name,lastname} = req.body;
        const id = req.params.id;
        
        const result = await UserModel.UpdateUser({ id, data:{email,username,name,lastname} });
        return res.redirect(`/profile`);
    }

    public async UpdatePasswordUser(req: Request, res: Response) {
        const {nowPassword, newPassword} = req.body;
        const id = req.params.id;
        const user = await UserModel.FindUserById({ id });
        if(!user) {
            req.flash(`error`, `Oops, error temporal.`);
            return res.redirect(`/profile`);
        }
        const password = await UserModel.HashPassword({ password:newPassword });

        const compare = await UserModel.ComparePassword({ dbPassword:user.password, password:nowPassword })
        if(!compare) {
            req.flash(`error`, `Verifica tu actual contraseña`);
            return res.redirect(`/profile`);
        }

        await UserModel.UpdateUser({ id, data:{password} });
        req.flash(`succ`, `Contraseña actualizada`);
        return res.redirect(`/profile`);
    }


}

export default UserController;
