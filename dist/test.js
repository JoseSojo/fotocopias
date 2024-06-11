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
// import { ProductCompleted, ProductCreate, StockCreate } from "../types/stock";
// import { MoneyCreate, MethodPaymentCreate, MoneyCompleted, MethodPaymentCompleted } from "../types/method";
// import { ServiceTypeCreate, ServiceCreate, ServiceTypeCompleted } from "../types/services";
// import { TransactionCreate } from "../types/transaction";
class GlobalTest {
    // private stock = new StockModel();
    // private method = new MethodModel();
    // private service = new ServiceModel();
    // private transaction = new TransactionModel();
    // private adminTest: UserCompleted|null = null
    // private methodGlobal: MethodPaymentCompleted|null = null
    // private productGlobal: ProductCompleted|null = null
    // private serviceTypeGlobal: ServiceTypeCompleted|null = null
    constructor() {
        this.user = new UserModel_1.default();
        this.user = new UserModel_1.default();
        // this.stock = new StockModel();
        // this.method = new MethodModel();
        // this.service = new ServiceModel();
        // this.transaction = new TransactionModel();
    }
    CreateUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const superadminData = {
                email: `admin01@foto.ft`,
                lastname: `Fotoft`,
                name: `Admin`,
                password: `admin.abc.123`,
                username: `admin01`,
                createBy: null
            };
            const superadmin = yield this.user.CreateUser({ data: superadminData });
            const admins = [
                {
                    email: `admin02@foto.ft`,
                    lastname: `Fotoft`,
                    name: `Admin2`,
                    password: `admin.abc.123`,
                    username: `admin02`,
                    createBy: superadmin.userId
                },
                {
                    email: `admin03@foto.ft`,
                    lastname: `Fotoft`,
                    name: `Admin3`,
                    password: `admin.abc.123`,
                    username: `admin03`,
                    createBy: superadmin.userId
                }
            ];
            const promiseAdmin1 = this.user.CreateUser({ data: admins[1] });
            const promiseAdmin2 = this.user.CreateUser({ data: admins[2] });
            const admin1 = yield promiseAdmin1;
            const admin2 = yield promiseAdmin2;
            console.log(`
            usuarios creados: ${superadmin.userId} - ${superadmin.username} - ${superadmin.createBy} (super)
            usuarios creados: ${admin1.userId} - ${admin1.username} - ${admin1.createBy}
            usuarios creados: ${admin2.userId} - ${admin2.username} - ${admin2.createBy}
        `);
            return;
        });
    }
}
exports.default = GlobalTest;
