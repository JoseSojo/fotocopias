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
const MethodModel_1 = __importDefault(require("../../models/method/MethodModel"));
class ReportMethod extends ReportController_1.ReportBaseController {
    constructor() {
        super();
    }
    ReportUniqueMethod(req, res) {
        const _super = Object.create(null, {
            GenerateName: { get: () => super.GenerateName },
            GetHeader: { get: () => super.GetHeader },
            GenerateTablePdf: { get: () => super.GenerateTablePdf },
            GetFooter: { get: () => super.GetFooter },
            GeneratePDF: { get: () => super.GeneratePDF }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const method = yield MethodModel_1.default.GetMethodPaymentById({ id });
            const user = req.user;
            if (!method) {
                req.flash(`err`, `No se ubicó el método`);
                return res.redirect(`/users/list`);
            }
            const dateNow = _super.GenerateName.call(this);
            const path = `public/report/${dateNow}.pdf`;
            const downloader = `/report/${dateNow}.pdf`;
            const serviceHead = `
            <tr>
                <td>Creado el:</td>
                <td>Creado por:</td>
                <td>Nombre</td>
                <td>Moneda</td>
                <td>Transacciones</td>
            </tr>
        `;
            let serviceBody = `
            <tr style="border-bottom:1px solid #212529">
                <td>${method.create_at}</td>
                <td>${method.createReference.name} ${method.createReference.lastname}</td>
                <td>${method.title}</td>
                <td>${method.moneyReference.title}</td>
                <td>${method._count.transaction}</td>
            </tr>
        `;
            const content = `
            ${_super.GetHeader.call(this)}
            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de moneda<h6>
                <h6>${method.title}<h6>
                <p>${method.description}<p>
                <h6>Creado por: ${method.createReference.name} ${method.createReference.lastname} (${method.createReference.rol})<h6>
            </div>

            <div>
                ${_super.GenerateTablePdf.call(this, { title: `Método de pago`, listTr: serviceBody, tHead: serviceHead })}
            </div>
            ${_super.GetFooter.call(this)}
        `;
            yield _super.GeneratePDF.call(this, { content, pathPdf: path });
            setTimeout(() => {
                return res.redirect(`/report/${dateNow}.pdf`);
            }, 1000);
        });
    }
    ReportListMethod(req, res) {
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
            const downloader = `/report/${dateNow}.pdf`;
            let bodyTable = ``;
            const countUser = yield MethodModel_1.default.CountMethodBy({ filter: {} });
            while (countUser > now) {
                const listPromise = MethodModel_1.default.GetAllMethodPayment({ pag, limit });
                pag++;
                now += limit;
                const list = yield listPromise;
                list.forEach((item) => {
                    bodyTable += `
                    <tr>
                        <td>${item.create_at}</td>
                        <td>${item.createReference.name} ${item.createReference.lastname}</td>
                        <td>${item.title}</td>
                        <td>${item.moneyReference.title}</td>
                        <td>${item._count.transaction}</td>
                    </tr>
                `;
                });
            }
            const tHead = `
            <tr>
                <td>Creado el:</td>
                <td>Creado por:</td>
                <td>Nombre</td>
                <td>Moneda</td>
                <td>Transacciones</td>
            </tr>
        `;
            const content = `
            ${_super.GetHeader.call(this)}

            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <hr>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de lista de métodos de pago<h6>
                <span style="font-size:17px;color:#212529">Generado por: ${user.name} ${user.lastname} (${user.rol})<span>
                <br>
                <span style="font-size:17px;color:#212529">Fecha: ${dateNow}<span>

                <br>
                <hr>
                <br>
            </div>


            ${_super.GenerateTablePdf.call(this, { listTr: bodyTable, tHead, title: `Lista de métodos` })}

            ${_super.GetFooter.call(this)}
        `;
            MethodModel_1.default.CreateReport({ data: {
                    createBy: user.userId,
                    downloader,
                    path,
                    fecha: dateNow,
                    objectType: `equipo/equipment`
                } });
            _super.GeneratePDF.call(this, { content, pathPdf: path });
            setTimeout(() => {
                return res.redirect(`/report/${dateNow}.pdf`);
            }, 1500);
        });
    }
}
exports.default = ReportMethod;
