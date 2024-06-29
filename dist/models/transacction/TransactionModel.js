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
class TransactionModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    // count
    CountAllTransactions(_a) {
        return __awaiter(this, arguments, void 0, function* ({}) {
            this.StartPrisma();
            const allPromise = this.prisma.transaction.count({});
            const egresoPromise = this.prisma.transaction.count({ where: { OR: [{ type: `EGRESO` }, { concepto: { startsWith: `egreso` } }] } });
            const ingresoPromise = this.prisma.transaction.count({ where: { OR: [{ type: `INGRESO` }, { concepto: { startsWith: `ingreso` } }] } });
            const all = yield allPromise;
            const egreso = yield egresoPromise;
            const ingreso = yield ingresoPromise;
            this.DistroyPrisma();
            return { all, egreso, ingreso };
        });
    }
    // crear Transaction
    CreateTransaction(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            this.StartPrisma();
            const result = yield this.prisma.transaction.create({ data });
            this.DistroyPrisma();
            this.StaticticsUpdate({});
            return result;
        });
    }
    // actualiza Transaction
    UpdateTransaction(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, data }) {
            this.StartPrisma();
            const result = yield this.prisma.transaction.update({ data, where: { transactionId: id } });
            this.DistroyPrisma();
            return result;
        });
    }
    // elimina Transaction
    DeleteTransaction(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            yield this.prisma.transaction.update({ data: { delete_at: Date.now().toString() }, where: { transactionId: id } });
            this.DistroyPrisma();
            return true; // boolean
        });
    }
    // obtiene todos los Transaction de 10 en 10
    GetAllTransaction(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter, pag, limit = 10 }) {
            this.StartPrisma();
            const result = yield this.prisma.transaction.findMany({
                where: filter,
                skip: pag * limit,
                take: limit,
                include: {
                    createReference: true,
                    methodPaymentReference: true
                },
            });
            this.DistroyPrisma();
            return result;
        });
    }
    // obtiene un Transaction por id
    GetTransactionById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            const result = yield this.prisma.transaction.findFirst({
                where: { transactionId: id },
                include: {
                    methodPaymentReference: {
                        include: {
                            moneyReference: true
                        }
                    },
                    createReference: true,
                    service: true,
                    stock: true,
                },
            });
            if (result == null)
                return null;
            this.DistroyPrisma();
            return result;
        });
    }
    // statics users actives
    UsersActives(_a) {
        return __awaiter(this, arguments, void 0, function* ({ limit = 5 }) {
            this.StartPrisma();
            const result = yield this.prisma.transaction.groupBy({
                by: "createBy",
                _count: {
                    createBy: true
                },
                orderBy: {
                    createBy: "asc"
                },
                take: limit,
            });
            this.DistroyPrisma();
            return result;
        });
    }
}
exports.default = new TransactionModel;
