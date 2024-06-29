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
const TransactionModel_1 = __importDefault(require("../../models/transacction/TransactionModel"));
const EquipmentModel_1 = __importDefault(require("../../models/equipment/EquipmentModel"));
const MethodModel_1 = __importDefault(require("../../models/method/MethodModel"));
class StockController extends BaseController_1.default {
    // render dashboard
    RenderDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const countPromise = StockModel_1.default.CountStockBy({ filter: {} });
            const countEquipment = EquipmentModel_1.default.CountEquipmentBy({ filter: {} });
            const Params = {
                countStock: yield countPromise,
                countEquipment: yield countEquipment
            };
            return res.render(`s/stock/dashboard.hbs`, Params);
        });
    }
    // render create
    RenderCreateStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const methodsPromise = MethodModel_1.default.GetAllMethodPayment({ pag: 0, limit: 100 });
            const moneyPromise = MethodModel_1.default.GetAllMoney({ pag: 0, limit: 100 });
            const Params = {
                methods: yield methodsPromise,
                moneys: yield moneyPromise
            };
            return res.render(`s/stock/create.hbs`, Params);
        });
    }
    // render show and update
    RenderShowStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const stock = yield StockModel_1.default.GetStockById({ id });
            const methodsPromise = MethodModel_1.default.GetAllMethodPayment({ pag: 0, limit: 100 });
            const moneyPromise = MethodModel_1.default.GetAllMoney({ pag: 0, limit: 100 });
            if (null == stock) {
                req.flash(`err`, `Stock no encontrado.`);
                return res.redirect(`/stock/products`);
            }
            const Params = {
                data: stock,
                methods: yield methodsPromise,
                moneys: yield moneyPromise
            };
            return res.render(`s/stock/show.hbs`, Params);
        });
    }
    // list stock
    RenderListStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pag = req.params.pag | 0;
            const limit = req.params.limit | 10;
            const money = StockModel_1.default.GetAllStock({ pag, limit });
            const countPromise = StockModel_1.default.CountStockBy({ filter: {} });
            const Params = {
                list: yield money,
                next: `/stock/list?pag=${pag + 1}`,
                previous: pag == 0 ? null : `/stock/list?pag=${pag - 1}`,
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
            return res.render(`s/stock/list.hbs`, Params);
        });
    }
    // insert product
    CreateStockPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description, quantity, methodId, mount, concepto, moneyId } = req.body;
                const user = req.user;
                const objInsert = {
                    updateBy: user.userId,
                    description,
                    name,
                    moneyId,
                    quantity: Number(quantity),
                    transactionId: ``
                };
                const resultTransaction = yield TransactionModel_1.default.CreateTransaction({ data: {
                        concepto,
                        createBy: user.userId,
                        methodPaymentId: methodId,
                        mount: Number(mount),
                        type: `EGRESO`
                    } });
                objInsert.transactionId = resultTransaction.transactionId;
                const result = yield StockModel_1.default.CreateStock({ data: objInsert });
                req.flash(`succ`, `Producto creado, ${result.name}`);
                return res.redirect(`/stock/list`);
            }
            catch (error) {
                console.log(error);
                req.flash(`err`, `No se pudo crear el producto`);
                return res.redirect(`/stock/create`);
            }
        });
    }
    // logic update
    UpdateStockPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { quantity, methodId, mount, concepto, moneyId } = req.body;
                const user = req.user;
                const id = req.params.id;
                const objInsert = {
                    updateBy: user.userId,
                    moneyId,
                    quantity: Number(quantity),
                    transactionId: ``
                };
                const resultTransaction = yield TransactionModel_1.default.CreateTransaction({ data: {
                        concepto,
                        createBy: user.userId,
                        methodPaymentId: methodId,
                        mount: Number(mount),
                        type: `EGRESO`
                    } });
                objInsert.transactionId = resultTransaction.transactionId;
                const result = yield StockModel_1.default.UpdateStock({ id, data: objInsert });
                req.flash(`succ`, `Producto actualizado, `);
                return res.redirect(`/stock/list`);
            }
            catch (error) {
                console.log(error);
                req.flash(`err`, `No se pudo actualizar el producto.`);
                return res.redirect(`/stock/create`);
            }
        });
    }
}
exports.default = StockController;
