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
const ServiceModel_1 = __importDefault(require("../../models/service/ServiceModel"));
const StockModel_1 = __importDefault(require("../../models/stock/StockModel"));
class ServiceTypeController extends BaseController_1.default {
    constructor() {
        super();
    }
    RenderCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const stockPromise = StockModel_1.default.GetAllStock({ pag: 0, limit: 100 });
            const ToView = {
                stock: yield stockPromise
            };
            return res.render(`s/service/type/create.hbs`, ToView);
        });
    }
    RenderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pag = req.query.pag | 0;
            const limit = req.query.limit | 10;
            const types = ServiceModel_1.default.GetAllTypes({ pag, limit });
            const typesCount = ServiceModel_1.default.CountTypesBy({ filter: {} });
            const Params = {
                list: yield types,
                next: `/service/types/list?pag=${pag + 1}`,
                previous: pag == 0 ? null : `/service/type/list?pag=${pag - 1}`,
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
            return res.render(`s/service/type/list.hbs`, Params);
        });
    }
    RenderShow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const type = yield ServiceModel_1.default.GetTypeById({ id });
            const ToView = { data: type };
            return res.render(`s/service/type/show.hbs`, ToView);
        });
    }
    CreateTypePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, stockExpenseId } = req.body;
            const user = req.user;
            const data = {
                createBy: user.userId,
                description,
                name,
                stockExpenseId
            };
            const result = yield ServiceModel_1.default.CreateType({ data });
            req.flash(`succ`, `Tipo creado`);
            return res.redirect(`/service/types`);
        });
    }
}
exports.default = ServiceTypeController;
