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
    CreateEquipment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            this.StartPrisma();
            const result = yield this.prisma.equipment.create({ data });
            this.DistroyPrisma();
            this.StaticticsUpdate({});
            return result;
        });
    }
    GetEquipmentById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            const result = yield this.prisma.equipment.findFirst({ where: { equipmentId: id }, include: { servicesId: true, createReference: true } });
            this.DistroyPrisma();
            return result;
        });
    }
    GetAllEquipment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ pag, limit = 10 }) {
            this.StartPrisma();
            const result = yield this.prisma.equipment.findMany({
                skip: pag * limit,
                take: limit,
                include: { servicesId: true, createReference: true }
            });
            this.DistroyPrisma();
            return result;
        });
    }
    UpdateEquipment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, data }) {
            this.StartPrisma();
            const result = yield this.prisma.equipment.update({ where: { equipmentId: id }, data });
            this.DistroyPrisma();
            return result;
        });
    }
    CountEquipmentBy(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            this.StartPrisma();
            const result = yield this.prisma.equipment.count({ where: filter });
            this.DistroyPrisma();
            return result;
        });
    }
}
exports.default = new MethodModel();
