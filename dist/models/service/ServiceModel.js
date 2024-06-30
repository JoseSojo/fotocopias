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
class ServiceModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    GetAllServicesFilter(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            this.StartPrisma();
            const result = yield this.prisma.service.findMany({
                where: {
                    date: {
                        equals: filter.date
                    }
                },
                include: {
                    createReference: true,
                    equipmentReference: true,
                    transaction: {
                        include: {
                            methodPaymentReference: {
                                include: {
                                    moneyReference: true
                                }
                            }
                        }
                    },
                    typeReferences: true
                }
            });
            this.DistroyPrisma();
            return result;
        });
    }
    CreateType(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            this.StartPrisma();
            const result = yield this.prisma.serviceType.create({ data });
            this.DistroyPrisma();
            return result;
        });
    }
    GetAllTypes(_a) {
        return __awaiter(this, arguments, void 0, function* ({ pag, limit = 10 }) {
            this.StartPrisma();
            const result = yield this.prisma.serviceType.findMany({
                include: {
                    createReference: true,
                    stockExpenseReference: true,
                    _count: true
                },
                skip: pag * limit,
                take: limit
            });
            this.DistroyPrisma();
            return result;
        });
    }
    GetTypeById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            const result = yield this.prisma.serviceType.findFirst({ where: { serviceTypeId: id },
                include: { createReference: true, stockExpenseReference: true, _count: true
                } });
            this.DistroyPrisma();
            return result;
        });
    }
    UpdateType(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, data }) {
            this.StartPrisma();
            const result = yield this.prisma.serviceType.update({ where: { serviceTypeId: id }, data });
            this.DistroyPrisma();
            return result;
        });
    }
    CountTypesBy(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            this.StartPrisma();
            const result = yield this.prisma.serviceType.count({ where: filter });
            this.DistroyPrisma();
            return result;
        });
    }
    CountService(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            this.StartPrisma();
            const result = yield this.prisma.service.count({ where: filter });
            this.DistroyPrisma();
            return result;
        });
    }
    CreateService(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            this.StartPrisma();
            const result = yield this.prisma.service.create({ data });
            this.DistroyPrisma();
            return result;
        });
    }
    GetAllService(_a) {
        return __awaiter(this, arguments, void 0, function* ({ pag, limit = 0 }) {
            this.StartPrisma();
            const result = yield this.prisma.service.findMany({
                include: {
                    createReference: true,
                    equipmentReference: true,
                    transaction: {
                        include: {
                            methodPaymentReference: true,
                        }
                    },
                    typeReferences: true,
                },
                skip: pag * limit,
                take: limit
            });
            this.DistroyPrisma();
            return result;
        });
    }
    GetServiceById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            const result = yield this.prisma.service.findFirst({
                where: { serviceId: id },
                include: {
                    createReference: true,
                    equipmentReference: true,
                    transaction: {
                        include: {
                            methodPaymentReference: {
                                include: {
                                    moneyReference: true
                                }
                            },
                            createReference: true,
                        }
                    },
                    typeReferences: {
                        include: {
                            stockExpenseReference: true
                        }
                    }
                }
            });
            this.DistroyPrisma();
            return result;
        });
    }
    // estadísticas.
    StatisticsServicesType() {
        return __awaiter(this, void 0, void 0, function* () {
            this.StartPrisma();
            const result = yield this.prisma.service.groupBy({
                by: "typeId",
                _count: { _all: true }
            });
            this.DistroyPrisma();
            this.StaticticsUpdate({});
            return result;
        });
    }
}
exports.default = new ServiceModel();
