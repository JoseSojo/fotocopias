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
const StockModel_1 = __importDefault(require("../../models/stock/StockModel"));
const ServiceModel_1 = __importDefault(require("../../models/service/ServiceModel"));
const MethodModel_1 = __importDefault(require("../../models/method/MethodModel"));
const EquipmentModel_1 = __importDefault(require("../../models/equipment/EquipmentModel"));
const TransactionModel_1 = __importDefault(require("../../models/transacction/TransactionModel"));
class ServiceController extends BaseController_1.default {
    constructor() {
        super();
    }
    RenderDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const stockPromise = StockModel_1.default.GetAllStock({ pag: 0, limit: 100 });
            const statisticsServiceType = ServiceModel_1.default.StatisticsServicesType();
            const ToView = {
                stock: yield stockPromise,
                staticticsServiceType: yield statisticsServiceType
            };
            return res.render(`s/service/dashboard.hbs`, ToView);
        });
    }
    RenderCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const typesPromise = ServiceModel_1.default.GetAllTypes({ pag: 0, limit: 100 });
            const moneyPromise = MethodModel_1.default.GetAllMoney({ pag: 0, limit: 100 });
            const methodPromise = MethodModel_1.default.GetAllMethodPayment({ pag: 0, limit: 100 });
            const equipmentPromise = EquipmentModel_1.default.GetAllEquipment({ pag: 0, limit: 100 });
            const ToView = {
                types: yield typesPromise,
                moneys: yield moneyPromise,
                methods: yield methodPromise,
                equipments: yield equipmentPromise,
            };
            return res.render(`s/service/create.hbs`, ToView);
        });
    }
    RenderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pag = req.query.pag | 0;
            const limit = req.query.limit | 10;
            const types = ServiceModel_1.default.GetAllService({ pag, limit });
            const typesCount = ServiceModel_1.default.CountService({ filter: {} });
            const Params = {
                list: yield types,
                next: `/service/list?pag=${pag + 1}`,
                previous: pag == 0 ? null : `/service/list?pag=${pag - 1}`,
                count: yield typesCount,
                nowTotal: ``,
                requirePagination: false,
                nowPath: pag,
                nowPathOne: pag != 0 ? true : false,
                nowPathEnd: false,
            };
            Params.nowTotal = `${Params.list.length + (pag * 10)} / ${Params.count}`;
            Params.nowPathEnd = (Params.list.length - 9) > 0 ? true : false;
            Params.requirePagination = Params.count > 10 ? true : false;
            return res.render(`s/service/list.hbs`, Params);
        });
    }
    RenderShow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const service = yield ServiceModel_1.default.GetServiceById({ id });
            const ToView = { data: service };
            return res.render(`s/service/show.hbs`, ToView);
        });
    }
    CreateTypePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { date, description, stockExpenseId, serviceType, quantity, equipment, method, mount, concepto } = req.body;
            const user = req.user;
            req.flash(`succ`, `Servicio creado.`);
            return res.redirect(`/service/types`);
        });
    }
    CreateServicePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { date, description, stockExpenseId, serviceType, quantity, equipment, method, mount, concepto, moneyId } = req.body;
            const user = req.user;
            const data = {
                date,
                description,
                createBy: user.userId,
                equipmentId: equipment,
                typeId: serviceType.split(`---`)[0],
                transactionId: ``
            };
            const transactionSave = {
                concepto,
                mount: Number(mount),
                createBy: user.userId,
                methodPaymentId: method,
                type: "INGRESO"
            };
            const stock = yield StockModel_1.default.GetStockById({ id: stockExpenseId });
            if (!stock) {
                req.flash(`err`, `Error temporal, intentelo más tarde`);
                return res.redirect(`/service`);
            }
            // actualiza stock
            const save = stock.quantity - Number(quantity);
            const stockPromise = StockModel_1.default.UpdateStock({ id: stock.stockId, data: { quantity: save } });
            const transactionResult = yield TransactionModel_1.default.CreateTransaction({ data: transactionSave });
            data.transactionId = transactionResult.transactionId;
            const updateSaldoPromise = MethodModel_1.default.UpdateSaldo({ id: moneyId, saldo: mount });
            const servicePromise = ServiceModel_1.default.CreateService({ data });
            yield stockPromise;
            yield servicePromise;
            yield updateSaldoPromise;
            req.flash(`succ`, `Servicio creado.`);
            return res.redirect(`/service/types`);
        });
    }
}
exports.default = ServiceController;
