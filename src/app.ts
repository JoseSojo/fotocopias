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

// start
class App {
    private app: Application = express();

    constructor () {
        this.app = express();
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

        // users
        this.app.get(`/users`, OnSession , user.RenderDashboard);
        this.app.get(`/users/list`, OnSession , user.RenderList);
        this.app.get(`/user/create`, OnSession , user.RenderCreate);
        this.app.get(`/user/:id/show`, OnSession , user.RenderShow); // show and update

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


        // start user
        this.app.get(`/init/app/user`, user.InsertUserBase);
        this.app.get(`/init/app/history`, user.StartStaticticsForYear);

        // routes auth
        const auth = new AuthController();
        this.app.get(`/login`, OffSession, auth.LoginRender);
        this.app.post(`/login`, OffSession, auth.LoginController);

        // api
        const api = new StaticticsController();
        this.app.get(`/api/statictics/type`, api.APIStaticticsServiceType);
        this.app.get(`/api/statictics/user`, api.APIStaticticsTop5Users);
        this.app.get(`/api/statictics/foryear`, api.APIStaticsForYear);
        this.app.get(`/api/statictics/method`, api.APIStaticsMethodPayment);
        this.app.get(`/api/statictics/stock`, api.APIStockStaticitcs);
    }

    public Run () {
        this.Start();

        const PORT = process.env.post ? process.env.post : 9321;
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
