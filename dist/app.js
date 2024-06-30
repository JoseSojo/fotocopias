"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const helpersHandlebars_1 = __importDefault(require("./config/helpers/helpersHandlebars"));
require("./config/passport");
const UserController_1 = __importDefault(require("./controller/user/UserController"));
const AuthController_1 = __importDefault(require("./controller/auth/AuthController"));
const TestModels_1 = __importDefault(require("./test/TestModels"));
const auth_1 = require("./middlewares/auth");
const MoneyController_1 = __importDefault(require("./controller/config/MoneyController"));
const ProductController_1 = __importDefault(require("./controller/stock/ProductController"));
const EquipmentController_1 = __importDefault(require("./controller/stock/EquipmentController"));
const ServiceType_1 = __importDefault(require("./controller/service/ServiceType"));
const Service_1 = __importDefault(require("./controller/service/Service"));
const Statictics_1 = __importDefault(require("./controller/API/Statictics"));
const UserReport_1 = __importDefault(require("./controller/report/UserReport"));
const Transaction_1 = __importDefault(require("./controller/transaction/Transaction"));
const node_cron_1 = __importDefault(require("node-cron"));
const EquitmentReport_1 = __importDefault(require("./controller/report/EquitmentReport"));
const StockReport_1 = __importDefault(require("./controller/report/StockReport"));
const MoneyReport_1 = __importDefault(require("./controller/report/MoneyReport"));
const MethodReport_1 = __importDefault(require("./controller/report/MethodReport"));
const ServiceTypeReport_1 = __importDefault(require("./controller/report/ServiceTypeReport"));
const ServiceReport_1 = __importDefault(require("./controller/report/ServiceReport"));
// start
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.app = (0, express_1.default)();
    }
    CornNode() {
        const date = new Date();
        // cron.schedule("* * * * * *", function () {
        //     console.log(date.getHours(), date.getMinutes()+1, date.getSeconds());             
        // });
        node_cron_1.default.schedule("1 1 22 * * *", function () {
            console.log("a las 7:19");
        });
    }
    Start() {
        // this.app.use(morgan('dev'));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use((0, connect_flash_1.default)());
        // session
        this.app.use((0, express_session_1.default)({
            secret: 'configbaseapp',
            resave: true,
            saveUninitialized: true
        }));
        this.app.use(passport_1.default.initialize());
        this.app.use(passport_1.default.session());
        //views [handlebars engine]
        this.app.set('views', path_1.default.join(process.cwd(), 'src/views'));
        this.app.engine('hbs', (0, express_handlebars_1.default)({
            defaultLayout: 'main.hbs',
            layoutsDir: path_1.default.join(this.app.get('views'), 'layouts'),
            partialsDir: path_1.default.join(this.app.get('views'), 'partials'),
            helpers: helpersHandlebars_1.default,
            extname: '.hbs'
        }));
        this.app.set('view engine', 'hbs');
        // globals vars
        this.app.use((req, res, next) => {
            const user = req.user;
            res.locals.user = user || null;
            res.locals.succ = req.flash('succ');
            res.locals.err = req.flash('err');
            res.locals.error = req.flash('error');
            next();
        });
        this.app.get(`/`, (req, res) => {
            if (req.user)
                return res.redirect(`/dashboard`);
            return res.redirect(`/login`);
        });
        // routes
        this.LoadRoutes();
        // static tiles        
        this.app.use(express_1.default.static(path_1.default.join(process.cwd(), 'public')));
    }
    LoadRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            // test
            const test = new TestModels_1.default();
            // routes users
            const user = new UserController_1.default();
            this.app.get(`/dashboard`, auth_1.OnSession, user.DashboardController);
            this.app.get(`/statictics`, auth_1.OnSession, user.StaticticsController);
            this.app.get(`/dashboard/report`, auth_1.OnSession, user.RenderReportController);
            // users
            this.app.get(`/users`, auth_1.OnSession, user.RenderDashboard);
            this.app.get(`/users/list`, auth_1.OnSession, user.RenderList);
            this.app.get(`/user/create`, auth_1.OnSession, user.RenderCreate);
            this.app.get(`/user/:id/show`, auth_1.OnSession, user.RenderShow); // show and update
            this.app.get(`/profile`, auth_1.OnSession, user.RenderProfile);
            this.app.post(`/profile/:id/data`, auth_1.OnSession, user.UpdateDataUser);
            this.app.post(`/profile/:id/password`, auth_1.OnSession, user.UpdatePasswordUser);
            this.app.post(`/user/create`, auth_1.OnSession, user.CreateUserPost);
            // config
            const config = new MoneyController_1.default();
            // stock
            const stock = new ProductController_1.default();
            this.app.get(`/config`, auth_1.OnSession, config.RenderDashboard);
            // money 
            this.app.get(`/config/moneys`, auth_1.OnSession, config.RenderMoneyList);
            this.app.get(`/config/money/create`, auth_1.OnSession, config.RenderMoneyCreate);
            this.app.get(`/config/money/:id/show`, auth_1.OnSession, config.RenderMoneyShow);
            this.app.post(`/config/money/create`, auth_1.OnSession, config.CreateMoneyPost);
            this.app.post(`/config/money/:id/update`, auth_1.OnSession, config.UpdateMoneyPost);
            // methods
            this.app.get(`/config/methods`, auth_1.OnSession, config.RenderMethodList);
            this.app.get(`/config/method/create`, auth_1.OnSession, config.RenderMethodCreate);
            this.app.get(`/config/method/:id/show`, auth_1.OnSession, config.RenderMethodShow);
            this.app.post(`/config/method/create`, auth_1.OnSession, config.CreateMethodPost);
            // this.app.post(`/config/method/:id/udpate`, OnSession, config.UpdateMethodPost);
            this.app.post(`/config/method/:id/update`, auth_1.OnSession, config.UpdateMethodPost);
            // stock
            this.app.get(`/stock`, auth_1.OnSession, stock.RenderDashboard);
            this.app.get(`/stock/create`, auth_1.OnSession, stock.RenderCreateStock);
            this.app.get(`/stock/list`, auth_1.OnSession, stock.RenderListStock);
            this.app.get(`/stock/:id/show`, auth_1.OnSession, stock.RenderShowStock);
            // logic
            this.app.post(`/stock/create`, auth_1.OnSession, stock.CreateStockPost);
            this.app.post(`/stock/:id/update`, auth_1.OnSession, stock.UpdateStockPost);
            // equipment
            const equiment = new EquipmentController_1.default();
            this.app.get(`/stock/equipment`, auth_1.OnSession, equiment.RenderListEquipment);
            this.app.get(`/stock/equipment/create`, auth_1.OnSession, equiment.RenderCreateEquipment);
            this.app.get(`/stock/equipment/:id/show`, auth_1.OnSession, equiment.RenderShowEquipment);
            // logic equiment
            this.app.post(`/stock/equipment/create`, auth_1.OnSession, equiment.CreateEquipment);
            this.app.post(`/stock/equipment/:id/update`, auth_1.OnSession, equiment.UpdateEquipment);
            //  service types
            const types = new ServiceType_1.default();
            this.app.get(`/service/types`, auth_1.OnSession, types.RenderList);
            this.app.get(`/service/types/create`, auth_1.OnSession, types.RenderCreate);
            this.app.get(`/service/types/:id/show`, auth_1.OnSession, types.RenderShow);
            this.app.post(`/service/types/create`, auth_1.OnSession, types.CreateTypePost);
            const service = new Service_1.default();
            this.app.get(`/service/`, auth_1.OnSession, service.RenderDashboard);
            this.app.get(`/service/list`, auth_1.OnSession, service.RenderList);
            this.app.get(`/service/create`, auth_1.OnSession, service.RenderCreate);
            this.app.get(`/service/:id/show`, auth_1.OnSession, service.RenderShow);
            this.app.post(`/service/create`, auth_1.OnSession, service.CreateServicePost);
            const transaction = new Transaction_1.default();
            this.app.get(`/transaction/list`, auth_1.OnSession, transaction.RenderList);
            this.app.get(`/transaction/:id/show`, auth_1.OnSession, transaction.RenderShow);
            // start user
            this.app.get(`/init/app/user`, user.InsertUserBase);
            this.app.get(`/init/app/history`, user.StartStaticticsForYear);
            this.app.get(`/inti/app/root`, user.SerRoot);
            // routes auth
            const auth = new AuthController_1.default();
            this.app.get(`/login`, auth_1.OffSession, auth.LoginRender);
            this.app.get(`/logout`, auth_1.OnSession, auth.LogOut);
            this.app.post(`/login`, auth_1.OffSession, auth.LoginController);
            // api
            const api = new Statictics_1.default();
            this.app.get(`/api/statictics/type`, api.APIStaticticsServiceType);
            this.app.get(`/api/statictics/user`, api.APIStaticticsTop5Users);
            this.app.get(`/api/statictics/foryear`, api.APIStaticsForYear);
            this.app.get(`/api/statictics/method`, api.APIStaticsMethodPayment);
            this.app.get(`/api/statictics/stock`, api.APIStockStaticitcs);
            // report
            const userReport = new UserReport_1.default();
            this.app.get(`/report/user/:id`, userReport.ReportUniqueUser);
            this.app.get(`/report/list/user`, userReport.ReportListUser);
            const reportEquitment = new EquitmentReport_1.default();
            this.app.get(`/report/equipmet/:id`, reportEquitment.ReportUniqueEquitment);
            this.app.get(`/report/list/equipment`, reportEquitment.ReportListEquipment);
            const reportStock = new StockReport_1.default();
            this.app.get(`/report/stock/:id`, reportStock.ReportUniqueStock);
            this.app.get(`/report/list/stock`, reportStock.ReportListStock);
            const reportMoney = new MoneyReport_1.default();
            this.app.get(`/report/money/:id`, reportMoney.ReportUniqueMoney);
            this.app.get(`/report/list/money`, reportMoney.ReportListMoney);
            const reportMethod = new MethodReport_1.default();
            this.app.get(`/report/method/:id`, reportMethod.ReportUniqueMethod);
            this.app.get(`/report/list/method`, reportMethod.ReportListMethod);
            const reportType = new ServiceTypeReport_1.default();
            this.app.get(`/report/type/:id`, reportType.ReportUniqueService);
            this.app.get(`/report/list/type`, reportType.ReportListService);
            const reportService = new ServiceReport_1.default();
            this.app.get(`/report/service/:id`, reportService.ReportUniqueService);
            this.app.get(`/report/list/service`, reportService.ReportListService);
        });
    }
    Run() {
        this.Start();
        this.CornNode();
        const PORT = process.env.PORT ? process.env.PORT : 9321;
        this.app.listen(PORT, () => {
            console.log(`SERVER RUN [${PORT}]`);
        });
    }
}
const server = new App();
server.Run();
