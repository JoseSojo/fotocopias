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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AbstractModel {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.bcrypt = bcrypt_1.default;
        this.prisma = new client_1.PrismaClient();
        this.bcrypt = bcrypt_1.default;
    }
    StartPrisma() {
        this.prisma = new client_1.PrismaClient();
    }
    DistroyPrisma() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.$disconnect();
        });
    }
    CreateTransaction(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            this.StartPrisma();
            const result = yield this.prisma.transaction.create({ data });
            this.DistroyPrisma();
            return result;
        });
    }
    CreateStatictisForYear(_a) {
        return __awaiter(this, arguments, void 0, function* ({ year }) {
            this.StartPrisma();
            const validYear = yield this.prisma.staticticsForYear.findFirst({ where: { year } });
            if (validYear) {
                return;
            }
            const result = yield this.prisma.staticticsForYear.create({ data: { year } });
            this.DistroyPrisma();
            return result;
        });
    }
    StaticticsUpdate(_a) {
        return __awaiter(this, arguments, void 0, function* ({}) {
            this.StartPrisma();
            const date = new Date();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const result = yield this.prisma.staticticsForYear.findFirst({ where: {
                    year
                } });
            if (!result) {
                this.CreateStatictisForYear({ year });
                return null;
            }
            const UpdateSet = {
                enero: result.enero,
                febrero: result.febrero,
                marzo: result.marzo,
                abril: result.abril,
                mayo: result.mayo,
                junio: result.junio,
                julio: result.julio,
                agosto: result.agosto,
                septiembre: result.septiembre,
                octubre: result.octubre,
                noviembre: result.noviembre,
                diciembre: result.diciembre
            };
            if (month == 1)
                UpdateSet.enero += 1;
            else if (month == 2)
                UpdateSet.febrero += 1;
            else if (month == 3)
                UpdateSet.marzo += 1;
            else if (month == 4)
                UpdateSet.abril += 1;
            else if (month == 5)
                UpdateSet.mayo += 1;
            else if (month == 6)
                UpdateSet.junio += 1;
            else if (month == 7)
                UpdateSet.julio += 1;
            else if (month == 8)
                UpdateSet.agosto += 1;
            else if (month == 9)
                UpdateSet.septiembre += 1;
            else if (month == 10)
                UpdateSet.octubre += 1;
            else if (month == 11)
                UpdateSet.noviembre += 1;
            else if (month == 12)
                UpdateSet.diciembre += 1;
            const response = yield this.prisma.staticticsForYear.update({ data: UpdateSet, where: { staticticsForYearId: result.staticticsForYearId } });
            this.DistroyPrisma();
            return response;
        });
    }
    GetStatcticByYear(_a) {
        return __awaiter(this, arguments, void 0, function* ({ year }) {
            this.StartPrisma();
            const result = this.prisma.staticticsForYear.findFirst({ where: { year } });
            const date = new Date();
            this.DistroyPrisma();
            return { statictic: yield result, yearRecive: year, yearNow: date.getFullYear() };
        });
    }
    GetYears(_a) {
        return __awaiter(this, arguments, void 0, function* ({}) {
            this.StartPrisma();
            const result = this.prisma.staticticsForYear.findMany({ select: { year: true, staticticsForYearId: true } });
            this.DistroyPrisma();
            return result;
        });
    }
    CreateReport(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            this.StartPrisma();
            const result = yield this.prisma.report.create({ data });
            console.log(result);
            this.DistroyPrisma();
            return result;
        });
    }
    GetReports(_a) {
        return __awaiter(this, arguments, void 0, function* ({ pag, limit }) {
            this.StartPrisma();
            const result = yield this.prisma.report.findMany({
                skip: pag * limit,
                take: limit,
                include: {
                    createReference: true,
                },
                orderBy: {
                    create_at: 'asc'
                },
                where: {
                    delete_at: undefined
                }
            });
            this.DistroyPrisma();
            return result;
        });
    }
    CountReport(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            this.StartPrisma();
            const result = yield this.prisma.report.count({ where: filter });
            this.DistroyPrisma();
            return result;
        });
    }
}
exports.default = AbstractModel;
