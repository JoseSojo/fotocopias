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
const MethodModel_1 = __importDefault(require("../../models/method/MethodModel"));
class ConfigController extends BaseController_1.default {
    constructor() {
        super();
    }
    // render dashboard
    RenderDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const countMoneyPromise = MethodModel_1.default.CountMoneyBy({ filter: {} });
            const countMethodPromise = MethodModel_1.default.CountMethodBy({ filter: {} });
            const Params = {
                countMoney: yield countMoneyPromise,
                countMethod: yield countMethodPromise
            };
            return res.render(`s/config/dashboard.hbs`, Params);
        });
    }
    // render list
    RenderMoneyList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pag = req.params.pag | 0;
            const limit = req.params.limit | 10;
            const money = MethodModel_1.default.GetAllMoney({ pag, limit });
            const countPromise = MethodModel_1.default.CountMoneyBy({ filter: {} });
            const Params = {
                list: yield money,
                next: `/config/money/list?pag=${pag + 1}`,
                previous: pag == 0 ? null : `/config/money/list?pag=${pag - 1}`,
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
            return res.render(`s/config/money/list.hbs`, Params);
        });
    }
    // render create
    RenderMoneyCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const Params = {};
            return res.render(`s/config/money/create.hbs`, Params);
        });
    }
    // render show and update
    RenderMoneyShow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const money = yield MethodModel_1.default.GetMoneyById({ id });
            if (null == money) {
                req.flash(`err`, `Usuario no encontrado.`);
                return res.redirect(`/config/moneys/list`);
            }
            const Params = { data: money };
            return res.render(`s/config/money/show.hbs`, Params);
        });
    }
    // render list method
    RenderMethodList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pag = req.params.pag | 0;
            const limit = req.params.limit | 10;
            const method = MethodModel_1.default.GetAllMethodPayment({ pag, limit });
            const countPromise = MethodModel_1.default.CountMethodBy({ filter: {} });
            const Params = {
                list: yield method,
                next: `/config/method/list?pag=${pag + 1}`,
                previous: pag == 0 ? null : `/config/method/list?pag=${pag - 1}`,
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
            return res.render(`s/config/method/list.hbs`, Params);
        });
    }
    // render create method
    RenderMethodCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const moneyPromise = MethodModel_1.default.GetAllMoney({ limit: 10, pag: 0 });
            const Params = {
                moneys: yield moneyPromise
            };
            return res.render(`s/config/method/create.hbs`, Params);
        });
    }
    // render show and update method
    RenderMethodShow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const method = yield MethodModel_1.default.GetMethodPaymentById({ id });
            if (null == method) {
                req.flash(`err`, `Usuario no encontrado.`);
                return res.redirect(`/config/methods/list`);
            }
            const Params = {
                data: method,
                methodTransaction: 20,
            };
            return res.render(`s/config/method/show.hbs`, Params);
        });
    }
    // logic create money
    CreateMoneyPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const id = user.userId;
                const NewMoney = {
                    createBy: id,
                    description: req.body.description,
                    prefix: req.body.prefix,
                    title: req.body.title
                };
                const result = yield MethodModel_1.default.CreateMoney({ data: NewMoney });
                req.flash(`succ`, `Moneda creada`);
                return res.redirect(`/config/moneys`);
            }
            catch (error) {
                console.log(error);
                req.flash(`err`, `Error temporal.`);
                return res.redirect(`/config/money/create`);
            }
        });
    }
    // logic update money
    UpdateMoneyPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const id = req.params.id;
                const Update = {
                    createBy: user.userId,
                    description: req.body.description,
                    prefix: req.body.prefix,
                    title: req.body.title
                };
                const result = yield MethodModel_1.default.UpdateMoney({ id, data: Update });
                req.flash(`succ`, `Moneda actualizada.`);
                return res.redirect(`/config/moneys`);
            }
            catch (error) {
                console.log(error);
                req.flash(`err`, `Error temporal.`);
                return res.redirect(`/config/moneys`);
            }
        });
    }
    // logic create method
    CreateMethodPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const id = user.userId;
                const NewMethod = {
                    createBy: id,
                    description: req.body.description,
                    title: req.body.title,
                    moneyId: req.body.money
                };
                const result = yield MethodModel_1.default.CreateMethodPayment({ data: NewMethod });
                req.flash(`succ`, `Método creado.`);
                return res.redirect(`/config/methods`);
            }
            catch (error) {
                console.log(error);
                req.flash(`err`, `Error temporal.`);
                return res.redirect(`/config/money/create`);
            }
        });
    }
    // logic update method
    UpdateMethodPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const id = req.params.id;
                const NewMethod = {
                    createBy: user.userId,
                    description: req.body.description,
                    title: req.body.title,
                    moneyId: req.body.money
                };
                const result = yield MethodModel_1.default.UpdateMethodPayment({ id, data: NewMethod });
                req.flash(`succ`, `Método actualizado.`);
                return res.redirect(`/config/methods`);
            }
            catch (error) {
                console.log(error);
                req.flash(`err`, `Error temporal.`);
                return res.redirect(`/config/methods`);
            }
        });
    }
}
exports.default = ConfigController;
