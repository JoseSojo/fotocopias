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
class MethodModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    CountMoneyBy(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            const result = this.prisma.money.count({ where: filter });
            return result;
        });
    }
    CountMethodBy(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            const result = this.prisma.paymentMethod.count({ where: filter });
            return result;
        });
    }
    // crear moneda
    CreateMoney(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            this.StartPrisma();
            const result = yield this.prisma.money.create({ data });
            this.DistroyPrisma();
            this.StaticticsUpdate({});
            return result;
        });
    }
    // actualiza moneda
    UpdateMoney(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, data }) {
            this.StartPrisma();
            const result = yield this.prisma.money.update({ data, where: { moneyId: id } });
            this.DistroyPrisma();
            return result;
        });
    }
    // actualiza moneda
    UpdateSaldo(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, saldo }) {
            this.StartPrisma();
            const findMoney = yield this.GetMoneyById({ id });
            if (!findMoney)
                return;
            const saldoSave = Number(findMoney.saldo) + Number(saldo);
            const result = yield this.prisma.money.update({ data: { saldo: saldoSave }, where: { moneyId: id } });
            this.DistroyPrisma();
            return result;
        });
    }
    // elimina moneda
    DeleteMoney(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            yield this.prisma.money.update({ data: { delete_at: Date.now().toString() }, where: { moneyId: id } });
            this.DistroyPrisma();
            return true; // boolean
        });
    }
    // obtiene todos los moneda de 10 en 10
    GetAllMoney(_a) {
        return __awaiter(this, arguments, void 0, function* ({ pag, limit = 10 }) {
            this.StartPrisma();
            const result = yield this.prisma.money.findMany({
                where: { delete_at: null },
                skip: pag * limit,
                take: limit,
                include: {
                    createReference: true,
                    _count: true,
                },
            });
            this.DistroyPrisma();
            return result;
        });
    }
    // obtiene un moneda por id
    GetMoneyById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            const result = yield this.prisma.money.findFirst({
                where: { moneyId: id },
                include: { createReference: true },
            });
            if (result == null)
                return null;
            this.DistroyPrisma();
            return result;
        });
    }
    // crea MethodPayment
    CreateMethodPayment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            this.StartPrisma();
            const result = yield this.prisma.paymentMethod.create({ data });
            this.DistroyPrisma();
            this.StaticticsUpdate({});
            return result; // MethodPayment completo
        });
    }
    // actualiza MethodPayment
    UpdateMethodPayment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, id }) {
            this.StartPrisma();
            const result = yield this.prisma.paymentMethod.update({ data, where: { paymentMethodId: id } });
            this.DistroyPrisma();
            return result; // MethodPayment completo
        });
    }
    // delete MethodPayment
    DeleteMethodPayment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            const result = yield this.prisma.paymentMethod.update({ data: { delete_at: Date.now().toString() }, where: { paymentMethodId: id } });
            this.DistroyPrisma();
            return result; // MethodPayment completo
        });
    }
    // obtiene todos los MethodPayment de 10 en 10
    GetAllMethodPayment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ pag, limit = 10 }) {
            this.StartPrisma();
            const result = yield this.prisma.paymentMethod.findMany({
                where: { delete_at: null },
                skip: pag * limit,
                take: limit,
                include: {
                    createReference: true,
                    moneyReference: true,
                    _count: true,
                }
            });
            this.DistroyPrisma();
            return result;
        });
    }
    // obtiene un MethodPayment por id
    GetMethodPaymentById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            const result = yield this.prisma.paymentMethod.findFirst({
                where: { paymentMethodId: id },
                include: {
                    createReference: true,
                    moneyReference: true,
                    _count: true
                },
            });
            if (result == null)
                return null;
            this.DistroyPrisma();
            return result;
        });
    }
    StaticticsMethod(_a) {
        return __awaiter(this, arguments, void 0, function* ({}) {
            this.StartPrisma();
            const allPromise = this.prisma.transaction.groupBy({
                by: "methodPaymentId",
                _count: { methodPaymentId: true }
            });
            const methodPromise = this.prisma.paymentMethod.findMany({
                select: { title: true, paymentMethodId: true }
            });
            const all = yield allPromise;
            const method = yield methodPromise;
            const newList = [];
            all.forEach((key) => {
                newList.push({
                    count: key._count.methodPaymentId,
                    name: method.find(item => item.paymentMethodId == key.methodPaymentId),
                    methodPaymentId: key.methodPaymentId
                });
            });
            this.DistroyPrisma();
            return { newList };
        });
    }
    StaticticsEgresoIngreso(_a) {
        return __awaiter(this, arguments, void 0, function* ({}) {
            this.StartPrisma();
            const countIngresoPromise = this.prisma.transaction.count({ where: { type: `INGRESO` } });
            const countEgresoPromise = this.prisma.transaction.count({ where: { type: `EGRESO` } });
            const countsMountsPromise = this.prisma.transaction.groupBy({ _sum: { mount: true }, by: "type" });
            const ingreso = yield countIngresoPromise;
            const egreso = yield countEgresoPromise;
            const mount = yield countsMountsPromise;
            this.DistroyPrisma();
            return { ingreso, egreso, mount };
        });
    }
}
exports.default = new MethodModel();
