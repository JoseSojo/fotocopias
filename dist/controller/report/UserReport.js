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
const ReportController_1 = require("./ReportController");
const UserModel_1 = __importDefault(require("../../models/user/UserModel"));
class ReportUser extends ReportController_1.ReportBaseController {
    constructor() {
        super();
    }
    ReportUniqueUser(req, res) {
        const _super = Object.create(null, {
            GenerateName: { get: () => super.GenerateName },
            GetHeader: { get: () => super.GetHeader },
            GenerateTablePdf: { get: () => super.GenerateTablePdf },
            GetFooter: { get: () => super.GetFooter },
            GeneratePDF: { get: () => super.GeneratePDF }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user = yield UserModel_1.default.FindUserById({ id });
            if (!user) {
                req.flash(`err`, `No se ubicó el usuario`);
                return res.redirect(`/users/list`);
            }
            const dateNow = _super.GenerateName.call(this);
            const path = `public/report/${dateNow}.pdf`;
            const serviceHead = `
            <tr>
                <td>Fecha</td>
                <td>Descripción</td>
                <td>Tipo de servicio</td>
                <td></td>
            </tr>
        `;
            let serviceBody = ``;
            user.service.forEach((item) => {
                serviceBody += `
                <tr style="border-bottom:1px solid #212529">
                    <td>${item.date}</td>
                    <td>${item.description}</td>
                    <td>${item.typeReferences.name}</td>
                    <td>${item.transaction.type} ${item.transaction.mount} ${item.transaction.methodPaymentReference.moneyReference.prefix}</td>
                </tr>
            `;
            });
            const DataCount = [
                { title: `Metodos de pago`, count: user._count.paymentMethod },
                { title: `Monedas`, count: user._count.meney },
                { title: `Inventario`, count: user._count.stock },
                { title: `Transacciones`, count: user._count.transaction },
                { title: `Tipos de servicios`, count: user._count.serviceType },
                { title: `Servicios`, count: user._count.service },
                { title: `Equipo`, count: user._count.equiment }
            ];
            let ListCount = ``;
            DataCount.forEach((item) => {
                ListCount += `
                <li>
                    <span>${item.title}</span>:
                    <span>${item.count}</span>
                </li>
            `;
            });
            const content = `
            ${_super.GetHeader.call(this)}
            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de usuario<h6>
                <h6>${user.name} ${user.lastname}<h6>
                <h6>${user.email}<h6>
                <h6>(${user.rol})<h6>
            </div>

            <div style="margin:1.5em 0">
                ${ListCount}
            </div>

            <div>
                ${_super.GenerateTablePdf.call(this, { title: `Servicio`, listTr: serviceBody, tHead: serviceHead })}
            </div>
            ${_super.GetFooter.call(this)}
        `;
            yield _super.GeneratePDF.call(this, { content, pathPdf: path });
            setTimeout(() => {
                return res.redirect(`/report/${dateNow}.pdf`);
            }, 1000);
        });
    }
    ReportListUser(req, res) {
        const _super = Object.create(null, {
            GenerateName: { get: () => super.GenerateName },
            GetHeader: { get: () => super.GetHeader },
            GenerateTablePdf: { get: () => super.GenerateTablePdf },
            GetFooter: { get: () => super.GetFooter },
            GeneratePDF: { get: () => super.GeneratePDF }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            let limit = 20;
            let pag = 0;
            let now = 0;
            const dateNow = _super.GenerateName.call(this);
            const path = `public/report/${dateNow}.pdf`;
            let bodyTable = ``;
            const countUser = yield UserModel_1.default.CountBy({ filter: {} });
            while (countUser > now) {
                const listPromise = UserModel_1.default.GetUsers({ pag, limit });
                pag++;
                now += limit;
                const list = yield listPromise;
                list.forEach((item) => {
                    bodyTable += `
                    <tr>
                        <td>${item.username}</td>
                        <td>${item.name}</td>
                        <td>${item.lastname}</td>
                        <td>${item.rol}</td>
                        <td>${item.email}</td>
                    </tr>
                `;
                });
            }
            const tHead = `
            <tr>
                <td>username</td>
                <td>name</td>
                <td>lastname</td>
                <td>rol</td>
                <td>email</td>
            </tr>
        `;
            const content = `
            ${_super.GetHeader.call(this)}

            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <hr>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de lista de usuarios<h6>
                <span style="font-size:17px;color:#212529">Generado por: ${user.name} ${user.lastname} (${user.rol})<span>
                <br>
                <span style="font-size:17px;color:#212529">Fecha: ${dateNow}<span>

                <br>
                <hr>
                <br>
            </div>


            ${_super.GenerateTablePdf.call(this, { listTr: bodyTable, tHead, title: `Lista de usuarios` })}

            ${_super.GetFooter.call(this)}
        `;
            _super.GeneratePDF.call(this, { content, pathPdf: path });
            setTimeout(() => {
                return res.redirect(`/report/${dateNow}.pdf`);
            }, 1500);
        });
    }
}
exports.default = ReportUser;
