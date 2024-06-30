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
const EquipmentModel_1 = __importDefault(require("../../models/equipment/EquipmentModel"));
class MethodController extends BaseController_1.default {
    constructor() {
        super();
    }
    RenderCreateEquipment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ToView = {};
            return res.render(`s/stock/equipment/create.hbs`, ToView);
        });
    }
    RenderShowEquipment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const equipmentPromise = yield EquipmentModel_1.default.GetEquipmentById({ id });
            const ToView = {
                data: equipmentPromise
            };
            return res.render(`s/stock/equipment/show.hbs`, ToView);
        });
    }
    RenderListEquipment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pag = req.query.pag | 0;
            const limit = req.query.limit | 10;
            const money = EquipmentModel_1.default.GetAllEquipment({ pag, limit });
            const countPromise = EquipmentModel_1.default.CountEquipmentBy({ filter: {} });
            const Params = {
                list: yield money,
                next: `/stock/equiment/list?pag=${pag + 1}`,
                previous: pag == 0 ? null : `/stock/equiment/list?pag=${pag - 1}`,
                count: yield countPromise,
                nowTotal: ``,
                requirePagination: false,
                nowPath: pag,
                nowPathOne: pag != 0 ? true : false,
                nowPathEnd: false,
            };
            Params.nowTotal = `${Params.list.length + (pag * 10)} / ${Params.count}`;
            Params.nowPathEnd = (Params.list.length - 9) > 0 ? true : false;
            Params.requirePagination = Params.count > 10 ? true : false;
            return res.render(`s/stock/equipment/list.hbs`, Params);
        });
    }
    // logic
    CreateEquipment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description } = req.body;
            const user = req.user;
            yield EquipmentModel_1.default.CreateEquipment({ data: { name, description, createBy: user.userId } });
            req.flash(`succ`, `Equipo creado, ${name}`);
            return res.redirect(`/stock/equipment`);
        });
    }
    UpdateEquipment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description } = req.body;
            const id = req.params.id;
            const user = req.user;
            yield EquipmentModel_1.default.UpdateEquipment({ id, data: { name, description, createBy: user.userId } });
            req.flash(`succ`, `Equipo actualizado, ${name}`);
            return res.redirect(`/stock/equipment`);
        });
    }
}
exports.default = MethodController;
