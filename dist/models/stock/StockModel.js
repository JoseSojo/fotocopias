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
const BaseModel_1 = __importDefault(require("../BaseModel"));
class StockModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    // crea stock
    CreateStock(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            this.StartPrisma();
            const result = yield this.prisma.stock.create({ data });
            this.DistroyPrisma();
            this.StaticticsUpdate({});
            return result; // StockCompleto
        });
    }
    // actualiza stock
    UpdateStock(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, id }) {
            this.StartPrisma();
            const result = yield this.prisma.stock.update({ data, where: { stockId: id } });
            this.DistroyPrisma();
            return result; // StockCompleto
        });
    }
    // delete stock
    DeleteStock(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            const result = yield this.prisma.stock.update({ data: { delete_at: Date.now().toString() }, where: { stockId: id } });
            this.DistroyPrisma();
            return result; // StockCompleto
        });
    }
    // obtiene todos los productos de 10 en 10
    GetAllStock(_a) {
        return __awaiter(this, arguments, void 0, function* ({ pag, limit = 10 }) {
            this.StartPrisma();
            const result = yield this.prisma.stock.findMany({
                where: { delete_at: null },
                skip: pag * limit,
                take: limit,
                include: {
                    _count: true,
                    transaction: true,
                    serviceType: true,
                    updateReference: true
                }
            });
            this.DistroyPrisma();
            return result;
        });
    }
    CountStockBy(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            this.StartPrisma();
            const result = yield this.prisma.stock.count({ where: filter });
            this.DistroyPrisma();
            return result;
        });
    }
    // obtiene un stock por id
    GetStockById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            const result = yield this.prisma.stock.findFirst({
                where: { stockId: id },
                include: {
                    transaction: true,
                    updateReference: true,
                    moneyReference: true,
                    serviceType: true
                },
            });
            if (result == null)
                return null;
            this.DistroyPrisma();
            return result;
        });
    }
    // statictics globals
    StaticticsAll(_a) {
        return __awaiter(this, arguments, void 0, function* ({}) {
            this.StartPrisma();
            const equipmentsPromise = this.prisma.equipment.findMany({ select: { name: true, equipmentId: true, servicesId: true } });
            const serviceTypePromise = this.prisma.serviceType.findMany({ select: { name: true, serviceTypeId: true, services: true } });
            const resultEquipment = [];
            const equipments = yield equipmentsPromise;
            equipments.forEach(key => {
                resultEquipment.push({
                    name: key.name,
                    id: key.equipmentId,
                    count: key.servicesId.length
                });
            });
            const resultServiceType = [];
            const servicesType = yield serviceTypePromise;
            servicesType.forEach(key => {
                resultServiceType.push({
                    name: key.name,
                    id: key.serviceTypeId,
                    count: key.services.length
                });
            });
            this.DistroyPrisma();
            return { resultServiceType, resultEquipment };
        });
    }
}
exports.default = new StockModel();
