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
const UserModel_1 = __importDefault(require("../models/user/UserModel"));
class BaseController {
    constructor() {
        this.adminTest = null;
        this.moneyTest = null;
        this.methodTest = null;
    }
    InsertUserBase(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listResponse = [];
                const model = UserModel_1.default;
                const superadmin = {
                    email: `superadmin@foto.ft`,
                    lastname: `Ft`,
                    name: `Superadmin`,
                    password: yield model.HashPassword({ password: `super@foto.ft` }),
                    username: `superadmin`,
                    createBy: null,
                };
                const superadminResult = yield model.CreateUser({ data: superadmin });
                const admin1 = {
                    email: `admin01@fotocopia.ft`,
                    lastname: `Ft`,
                    name: `Admin`,
                    password: yield model.HashPassword({ password: `admin@foto.ft` }),
                    username: `Admin01`,
                    createBy: superadminResult.userId
                };
                const admin2 = {
                    email: `admin02@fotocopia.ft`,
                    lastname: `Ft`,
                    name: `Admin`,
                    password: yield model.HashPassword({ password: `admin@foto.ft` }),
                    username: `Admin02`,
                    createBy: superadminResult.userId
                };
                if (superadminResult) {
                    admin1.createBy = superadminResult.userId;
                    admin2.createBy = superadminResult.userId;
                }
                const admin1Promise = model.CreateUser({ data: admin1 });
                const admin2Promise = model.CreateUser({ data: admin2 });
                const admin1Result = yield admin1Promise;
                const admin2Result = yield admin2Promise;
                listResponse.push(`UserCreate: ${superadminResult.name} ${superadminResult.lastname}`);
                listResponse.push(`UserCreate: ${admin1Result.name} ${admin1Result.lastname}`);
                listResponse.push(`UserCreate: ${admin2Result.name} ${admin2Result.lastname}`);
                return res.status(200).json({ body: listResponse });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ ok: false });
            }
        });
    }
    StartStaticticsForYear(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            const year = date.getFullYear();
            const result = yield UserModel_1.default.CreateStatictisForYear({ year });
            return res.json({ body: result });
        });
    }
}
exports.default = BaseController;
