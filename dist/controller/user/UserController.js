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
const BaseController_1 = __importDefault(require("../BaseController"));
const UserModel_1 = __importDefault(require("../../models/user/UserModel"));
const EquipmentModel_1 = __importDefault(require("../../models/equipment/EquipmentModel"));
const MethodModel_1 = __importDefault(require("../../models/method/MethodModel"));
const ServiceModel_1 = __importDefault(require("../../models/service/ServiceModel"));
const TransactionModel_1 = __importDefault(require("../../models/transacction/TransactionModel"));
class UserController extends BaseController_1.default {
    RenderProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const userData = yield UserModel_1.default.FindUserById({ id: user.userId });
            const Params = {
                data: userData,
            };
            return res.render(`s/user/profile.hbs`, Params);
        });
    }
    DashboardController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            const pag = req.query.pag | 0;
            const limit = req.query.limit | 10;
            const moneysPromise = MethodModel_1.default.GetAllMoney({ pag: 0, limit: 10 });
            const serviceCountPromise = ServiceModel_1.default.CountService({ filter: {} });
            const userCountPromise = UserModel_1.default.CountBy({ filter: {} });
            const methodCountPromise = MethodModel_1.default.CountMethodBy({ filter: {} });
            const equipmentCountPromise = EquipmentModel_1.default.CountEquipmentBy({ filter: {} });
            const transactionsCountPromise = TransactionModel_1.default.CountAllTransactions({});
            const years = MethodModel_1.default.GetYears({});
            const month = date.getMonth() + 1;
            const toDay = `${date.getFullYear()}-${month < 10 ? `0${month}` : `${month}`}-${date.getDate()}`;
            const serviceToDay = ServiceModel_1.default.GetAllServicesFilter({ filter: { date: toDay } });
            const countService = ServiceModel_1.default.CountService({ filter: { date: toDay } });
            const transsactions = yield transactionsCountPromise;
            const Params = {
                years: yield years,
                moneys: yield moneysPromise,
                servicesCount: yield serviceCountPromise,
                transactionCount: transsactions.all,
                egresoCount: transsactions.egreso,
                ingresoCount: transsactions.ingreso,
                userCount: yield userCountPromise,
                methodCount: yield methodCountPromise,
                equipmentCount: yield equipmentCountPromise,
                ubication: `Resumen`,
                servicesToDay: yield serviceToDay,
                next: `/users/list?pag=${pag + 1}`,
                previous: pag == 0 ? null : `/users/list?pag=${pag - 1}`,
                count: yield countService,
                nowTotal: ``,
                requirePagination: false,
                nowPath: pag,
                nowPathOne: pag != 0 ? true : false,
                nowPathEnd: false,
                toDay
            };
            Params.nowTotal = `${Params.servicesToDay.length + (pag * 10)} / ${Params.count}`;
            Params.nowPathEnd = (Params.servicesToDay.length - 9) > 0 ? true : false;
            Params.requirePagination = Params.count > 10 ? true : false;
            return res.render(`s/dashboard.hbs`, Params);
        });
    }
    StaticticsController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const moneysPromise = MethodModel_1.default.GetAllMoney({ pag: 0, limit: 10 });
            const serviceCountPromise = ServiceModel_1.default.CountService({ filter: {} });
            const years = MethodModel_1.default.GetYears({});
            return res.render(`s/statictics.hbs`, {
                years: yield years,
                moneys: yield moneysPromise,
                servicesCount: yield serviceCountPromise,
                ubication: `Resumen`,
            });
        });
    }
    RenderReportController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pag = req.query.pag | 0;
            const limit = req.query.limit | 10;
            console.log(pag);
            const reports = UserModel_1.default.GetReports({ pag, limit });
            const countPromise = UserModel_1.default.CountReport({ filter: {} });
            const Params = {
                list: yield reports,
                next: `/dashboard/report?pag=${pag + 1}`,
                previous: pag == 0 ? null : `/dashboard/report?pag=${pag - 1}`,
                count: yield countPromise,
                nowTotal: ``,
                requirePagination: false,
                nowPath: pag,
                nowPathOne: pag != 0 ? true : false,
                nowPathEnd: false,
            };
            Params.nowTotal = `${Params.list.length + (pag * 10)} / ${Params.count}`;
            Params.nowPathEnd = (Params.list.length - 9) > 0 ? true : false;
            console.log(Params.next, Params.previous);
            Params.requirePagination = Params.count > 10 ? true : false;
            return res.render(`s/report.hbs`, Params);
        });
    }
    // render dashboard
    RenderDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const countPromise = UserModel_1.default.CountBy({ filter: {} });
            const Params = {
                count: yield countPromise
            };
            return res.render(`s/user/dashboard.hbs`, Params);
        });
    }
    // render list
    RenderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pag = req.query.pag | 0;
            const limit = req.query.limit | 10;
            const users = UserModel_1.default.GetUsers({ pag, limit });
            const countPromise = UserModel_1.default.CountBy({ filter: {} });
            const Params = {
                list: yield users,
                next: `/users/list?pag=${pag + 1}`,
                previous: pag == 0 ? null : `/users/list?pag=${pag - 1}`,
                count: yield countPromise,
                nowTotal: ``,
                requirePagination: false,
                nowPath: pag,
                nowPathOne: pag != 0 ? true : false,
                nowPathEnd: false,
            };
            Params.nowTotal = `${Params.list.length + (pag * 10)} / ${Params.count}`;
            Params.nowPathEnd = (Params.list.length - 9) > 0 ? true : false;
            Params.requirePagination = Params.count > 10 ? true : false;
            return res.render(`s/user/list.hbs`, Params);
        });
    }
    // render create
    RenderCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const Params = {};
            return res.render(`s/user/create.hbs`, Params);
        });
    }
    // render show and update
    RenderShow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user = yield UserModel_1.default.FindUserById({ id });
            if (null == user) {
                req.flash(`err`, `Usuario no encontrado.`);
                return res.redirect(`/users/list`);
            }
            const Params = { data: user };
            return res.render(`s/user/show.hbs`, Params);
        });
    }
    // logic register
    CreateUserPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const NewUser = {
                    createBy: user.userId,
                    email: req.body.email,
                    lastname: req.body.lastname,
                    name: req.body.name,
                    password: yield UserModel_1.default.HashPassword({ password: req.body.password }),
                    username: req.body.username
                };
                const ResultUser = yield UserModel_1.default.CreateUser({ data: NewUser });
                req.flash(`succ`, `Usuario creado.`);
                return res.redirect(`/users`);
            }
            catch (error) {
                console.log(error);
                req.flash(`err`, `No se pudo crear el usuario.`);
                return res.redirect(`/users`);
            }
        });
    }
    UpdateDataUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, username, name, lastname } = req.body;
            const id = req.params.id;
            const result = yield UserModel_1.default.UpdateUser({ id, data: { email, username, name, lastname } });
            return res.redirect(`/profile`);
        });
    }
    UpdatePasswordUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nowPassword, newPassword } = req.body;
            const id = req.params.id;
            const user = yield UserModel_1.default.FindUserById({ id });
            if (!user) {
                req.flash(`error`, `Oops, error temporal.`);
                return res.redirect(`/profile`);
            }
            const password = yield UserModel_1.default.HashPassword({ password: newPassword });
            const compare = yield UserModel_1.default.ComparePassword({ dbPassword: user.password, password: nowPassword });
            if (!compare) {
                req.flash(`error`, `Verifica tu actual contraseña`);
                return res.redirect(`/profile`);
            }
            yield UserModel_1.default.UpdateUser({ id, data: { password } });
            req.flash(`succ`, `Contraseña actualizada`);
            return res.redirect(`/profile`);
        });
    }
}
exports.default = UserController;
