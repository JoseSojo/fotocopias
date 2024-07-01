// imports
import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import path from 'path';
import flash from 'connect-flash';
import passport from 'passport';
import session from 'express-session';
import exphbs from 'express-handlebars';
import helpersHandlebars from './config/helpers/helpersHandlebars';
import './config/passport';
import UserController from './controller/user/UserController';
import AuthController from './controller/auth/AuthController';
import GlobalTest from './test/TestModels';
import { OffSession, OnSession } from './middlewares/auth';
import ConfigController from './controller/config/MoneyController';
import StockController from './controller/stock/ProductController';
import EquipmentController from './controller/stock/EquipmentController';
import ServiceTypeController from './controller/service/ServiceType';
import ServiceController from './controller/service/Service';
import StaticticsController from './controller/API/Statictics';
import UserReport from './controller/report/UserReport';
import TransactionController from './controller/transaction/Transaction';
 
import cron from "node-cron";
import ReportEquitment from './controller/report/EquitmentReport';
import ReportStock from './controller/report/StockReport';
import ReportMoney from './controller/report/MoneyReport';
import ReportMethod from './controller/report/MethodReport';
import ReportTypeService from './controller/report/ServiceTypeReport';
import ReportService from './controller/report/ServiceReport';
import AutomaticReport from './controller/report/automatic/AutomaticReport';

// start
class App {
    private app: Application = express();

    constructor () {
        this.app = express();
    }

    public CornNode () {
        const date = new Date();
        const autimaticReport = new AutomaticReport();

        cron.schedule("*/3 * * * * *", function () {
            console.log(date.getHours(), date.getMinutes()+1, date.getSeconds(), date.getMilliseconds());    
        });

        cron.schedule("0 0 22 * * *", function () {
            console.log(date.getHours(), date.getMinutes()+1, date.getSeconds());  
            autimaticReport.ReportForDay();      
        });
    }

    public Start () {
        // this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}));
        this.app.use(flash());

        // session
        this.app.use(session({
            secret: 'configbaseapp',
            resave: true,
            saveUninitialized: true
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        //views [handlebars engine]
        this.app.set('views', path.join(process.cwd(), 'src/views'));
        this.app.engine('hbs', exphbs({
            defaultLayout: 'main.hbs',
            layoutsDir: path.join(this.app.get('views'), 'layouts'),
            partialsDir: path.join(this.app.get('views'), 'partials'),
            helpers: helpersHandlebars,
            extname: '.hbs'
        }));
        this.app.set('view engine', 'hbs');

        // globals vars
        this.app.use((req: Request, res: Response, next:NextFunction) => {
            const user = req.user as any | null; 
            res.locals.user = user || null;
            res.locals.succ = req.flash('succ');
            res.locals.err = req.flash('err');
            res.locals.error = req.flash('error');
            next();
        });

        this.app.get(`/`, (req: Request, res: Response) => {
            if(req.user) return res.redirect(`/dashboard`);
            return res.redirect(`/login`);
        });

        // routes
        this.LoadRoutes();

        // static tiles        
        this.app.use(express.static(path.join(process.cwd(), 'public')))
    }

    public async LoadRoutes() {
        // test
        const test = new GlobalTest();

        // routes users
        const user = new UserController();
        this.app.get(`/dashboard`, OnSession , user.DashboardController);
        this.app.get(`/statictics`, OnSession , user.StaticticsController);
        this.app.get(`/dashboard/report`, OnSession , user.RenderReportController);

        // users
        this.app.get(`/users`, OnSession , user.RenderDashboard);
        this.app.get(`/users/list`, OnSession , user.RenderList);
        this.app.get(`/user/create`, OnSession , user.RenderCreate);
        this.app.get(`/user/:id/show`, OnSession , user.RenderShow); // show and update
        this.app.get(`/profile`, OnSession , user.RenderProfile);
        this.app.post(`/profile/:id/data`, OnSession , user.UpdateDataUser);
        this.app.post(`/profile/:id/password`, OnSession , user.UpdatePasswordUser);

        this.app.post(`/user/create`, OnSession, user.CreateUserPost);

        // config
        const config = new ConfigController();

        // stock
        const stock = new StockController();

        this.app.get(`/config`, OnSession, config.RenderDashboard);
        // money 
        this.app.get(`/config/moneys`, OnSession, config.RenderMoneyList);
        this.app.get(`/config/money/create`, OnSession, config.RenderMoneyCreate);
        this.app.get(`/config/money/:id/show`, OnSession, config.RenderMoneyShow);

        this.app.post(`/config/money/create`, OnSession, config.CreateMoneyPost);
        this.app.post(`/config/money/:id/update`, OnSession, config.UpdateMoneyPost);

        // methods
        this.app.get(`/config/methods`, OnSession, config.RenderMethodList);
        this.app.get(`/config/method/create`, OnSession, config.RenderMethodCreate);
        this.app.get(`/config/method/:id/show`, OnSession, config.RenderMethodShow);

        this.app.post(`/config/method/create`, OnSession, config.CreateMethodPost);
        // this.app.post(`/config/method/:id/udpate`, OnSession, config.UpdateMethodPost);
        this.app.post(`/config/method/:id/update`, OnSession, config.UpdateMethodPost)

        // stock
        this.app.get(`/stock`, OnSession, stock.RenderDashboard);
        this.app.get(`/stock/create`, OnSession, stock.RenderCreateStock);
        this.app.get(`/stock/list`, OnSession, stock.RenderListStock);
        this.app.get(`/stock/:id/show`, OnSession, stock.RenderShowStock);

        // logic
        this.app.post(`/stock/create`, OnSession, stock.CreateStockPost);
        this.app.post(`/stock/:id/update`, OnSession, stock.UpdateStockPost);

        // equipment
        const equiment = new EquipmentController();
        this.app.get(`/stock/equipment`, OnSession, equiment.RenderListEquipment);
        this.app.get(`/stock/equipment/create`, OnSession, equiment.RenderCreateEquipment);
        this.app.get(`/stock/equipment/:id/show`, OnSession, equiment.RenderShowEquipment);

        // logic equiment
        this.app.post(`/stock/equipment/create`, OnSession, equiment.CreateEquipment);
        this.app.post(`/stock/equipment/:id/update`, OnSession, equiment.UpdateEquipment);

        //  service types
        const types = new ServiceTypeController();
        this.app.get(`/service/types`, OnSession, types.RenderList);
        this.app.get(`/service/types/create`, OnSession, types.RenderCreate);
        this.app.get(`/service/types/:id/show`, OnSession, types.RenderShow);

        this.app.post(`/service/types/create`, OnSession, types.CreateTypePost)

        const service = new ServiceController();
        this.app.get(`/service/`, OnSession, service.RenderDashboard);
        this.app.get(`/service/list`, OnSession, service.RenderList);
        this.app.get(`/service/create`, OnSession, service.RenderCreate);
        this.app.get(`/service/:id/show`, OnSession, service.RenderShow);
        this.app.post(`/service/create`, OnSession, service.CreateServicePost);

        const transaction = new TransactionController();
        this.app.get(`/transaction/list`, OnSession, transaction.RenderList);
        this.app.get(`/transaction/:id/show`, OnSession, transaction.RenderShow);

        // start user
        this.app.get(`/init/app/user`, user.InsertUserBase);
        this.app.get(`/init/app/history`, user.StartStaticticsForYear);
        this.app.get(`/inti/app/root`, user.SerRoot)

        // routes auth
        const auth = new AuthController();
        this.app.get(`/login`, OffSession, auth.LoginRender);
        this.app.get(`/logout`, OnSession, auth.LogOut);
        this.app.post(`/login`, OffSession, auth.LoginController);

        // api
        const api = new StaticticsController();
        this.app.get(`/api/statictics/type`, api.APIStaticticsServiceType);
        this.app.get(`/api/statictics/user`, api.APIStaticticsTop5Users);
        this.app.get(`/api/statictics/foryear`, api.APIStaticsForYear);
        this.app.get(`/api/statictics/method`, api.APIStaticsMethodPayment);
        this.app.get(`/api/statictics/stock`, api.APIStockStaticitcs);

        // report
        const userReport = new UserReport();
        this.app.get(`/report/user/:id`, userReport.ReportUniqueUser);
        this.app.get(`/report/list/user`, userReport.ReportListUser);

        const reportEquitment = new ReportEquitment();
        this.app.get(`/report/equipmet/:id`, reportEquitment.ReportUniqueEquitment);
        this.app.get(`/report/list/equipment`, reportEquitment.ReportListEquipment);

        const reportStock = new ReportStock();
        this.app.get(`/report/stock/:id`, reportStock.ReportUniqueStock);
        this.app.get(`/report/list/stock`, reportStock.ReportListStock);

        const reportMoney = new ReportMoney();
        this.app.get(`/report/money/:id`, reportMoney.ReportUniqueMoney);
        this.app.get(`/report/list/money`, reportMoney.ReportListMoney);

        const reportMethod = new ReportMethod();
        this.app.get(`/report/method/:id`, reportMethod.ReportUniqueMethod);
        this.app.get(`/report/list/method`, reportMethod.ReportListMethod);
    
        const reportType = new ReportTypeService();
        this.app.get(`/report/type/:id`, reportType.ReportUniqueService);
        this.app.get(`/report/list/type`, reportType.ReportListService);

        const reportService = new ReportService();
        this.app.get(`/report/service/:id`, reportService.ReportUniqueService);
        this.app.get(`/report/list/service`, reportService.ReportListService);
    }

    public Run () {
        this.Start();
        this.CornNode();

        const PORT = process.env.PORT ? process.env.PORT : 9321;
        this.app.listen(
            PORT,
            () => {
                console.log(`SERVER RUN [${PORT}]`);
            }
        )
    }
}

const server = new App();

server.Run();
