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
const TransactionModel_1 = __importDefault(require("../../models/transacction/TransactionModel"));
class TransactionController extends BaseController_1.default {
    constructor() {
        super();
    }
    RenderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pag = req.query.pag | 0;
            const limit = req.query.limit | 10;
            const type = req.query.type || `ALL`;
            const filter = {};
            if (type === `INGRESO`) {
                filter.type = `INGRESO`;
            }
            if (type === `EGRESO`) {
                filter.type = `EGRESO`;
            }
            const transaction = TransactionModel_1.default.GetAllTransaction({ pag: parseInt(`${pag}`), limit: parseInt(`${limit}`), filter });
            const transactionCount = yield TransactionModel_1.default.CountAllTransactions({ filter });
            const Params = {
                list: yield transaction,
                next: `/transaction/list?pag=${pag + 1}&type=${type}`,
                previous: pag == 0 ? null : `/transaction/list?pag=${pag - 1}&type=${type}&limit=${limit}`,
                count: type == `EGRESO` ? transactionCount.egreso :
                    type == `INGRESO` ? transactionCount.ingreso :
                        transactionCount.all,
                nowTotal: ``,
                requirePagination: false,
                nowPath: pag,
                nowPathOne: pag != 0 ? true : false,
                nowPathEnd: false,
            };
            Params.nowTotal = `${Params.list.length + (pag * 10)} / ${Params.count}`;
            Params.nowPathEnd = (Params.list.length - 9) > 0 ? true : false;
            Params.requirePagination = Params.count > 10 ? true : false;
            return res.render(`s/transaction/list.hbs`, Params);
        });
    }
    RenderShow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const transaction = yield TransactionModel_1.default.GetTransactionById({ id });
            const ToView = { data: transaction };
            return res.render(`s/transaction/show.hbs`, ToView);
        });
    }
}
exports.default = TransactionController;
