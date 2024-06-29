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
const MethodModel_1 = __importDefault(require("../../models/method/MethodModel"));
const StockModel_1 = __importDefault(require("../../models/stock/StockModel"));
const UserModel_1 = __importDefault(require("../../models/user/UserModel"));
class StaticticsController extends BaseController_1.default {
    // top 5 usuarios mas ativos
    APIStaticticsTop5Users(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = req.query.limit;
            const usersList = UserModel_1.default.StaticticsTopUsers({ limit: limit ? Number(limit) : 3 });
            return res.json({ body: yield usersList });
        });
    }
    // metodos de pagos ma usados
    // ingresos egresos
    APIStaticsMethodPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = MethodModel_1.default.StaticticsMethod({});
            const result2 = MethodModel_1.default.StaticticsEgresoIngreso({});
            return res.json({ method: yield result, mount: yield result2 });
        });
    }
    // equipos mas usados
    // stock mas usado
    APIStockStaticitcs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { resultEquipment, resultServiceType } = yield StockModel_1.default.StaticticsAll({});
            return res.json({ resultEquipment, resultServiceType });
        });
    }
    // tipos mas usados
    // grafica de tiempo con servicios
    // ingresos/egresos
    APIStaticticsServiceType(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield ServiceModel_1.default.StatisticsServicesType();
            const serviceTypes = yield ServiceModel_1.default.GetAllTypes({ pag: 0, limit: 100 });
            const servicesTypesList = [];
            result.forEach((key, i) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const save = {
                    typeId: key.typeId,
                    count: key._count._all,
                    name: (_a = serviceTypes.find(item => item.serviceTypeId == key.typeId)) === null || _a === void 0 ? void 0 : _a.name
                };
                servicesTypesList.push(save);
            }));
            return res.json({ body: servicesTypesList });
        });
    }
    // estadisticas por year
    APIStaticsForYear(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { year } = req.query;
            let yearSend = year;
            if (!year) {
                const date = new Date();
                yearSend = date.getFullYear();
            }
            const response = yield UserModel_1.default.GetStatcticByYear({ year: Number(yearSend) });
            return res.json({ body: response });
        });
    }
}
exports.default = StaticticsController;
