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
const ServiceModel_1 = __importDefault(require("../../models/service/ServiceModel"));
class ReportService extends ReportController_1.ReportBaseController {
    constructor() {
        super();
    }
    ReportUniqueService(req, res) {
        const _super = Object.create(null, {
            GenerateName: { get: () => super.GenerateName },
            GetHeader: { get: () => super.GetHeader },
            GenerateListUnorder: { get: () => super.GenerateListUnorder },
            GetFooter: { get: () => super.GetFooter },
            GeneratePDF: { get: () => super.GeneratePDF }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const service = yield ServiceModel_1.default.GetServiceById({ id });
            const user = req.user;
            if (!service) {
                req.flash(`err`, `No se ubicó el servicio`);
                return res.redirect(`/users/list`);
            }
            const dateNow = _super.GenerateName.call(this);
            const path = `public/report/${dateNow}.pdf`;
            const downloader = `/report/${dateNow}.pdf`;
            const dataService = [
                { name: `Tipo de servicio`, value: service.typeReferences.name },
                { name: `Fecha`, value: service.date.toString() },
                { name: `Producto utilizado`, value: service.typeReferences.stockExpenseReference.name }
            ];
            const dataTransaction = [
                { name: `ID`, value: service.transaction.transactionId },
                { name: `Método de pago`, value: service.transaction.methodPaymentReference.title },
                { name: `Moneda`, value: service.transaction.methodPaymentReference.moneyReference.title },
                { name: `Monto`, value: service.transaction.mount },
                { name: `Concepto`, value: service.transaction.concepto },
            ];
            const dataUser = [
                { name: `Nombre completo`, value: `${service.createReference.name} ${service.createReference.lastname}` },
                { name: `Correo`, value: service.createReference.email },
                { name: `Usuario`, value: `${service.createReference.username}` },
                { name: `Rol`, value: `${service.createReference.rol}` },
            ];
            const content = `
            ${_super.GetHeader.call(this)}
            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de servicio<h6>
                <p>${service.description}<p>
                <h6>Creado por: ${service.createReference.name} ${service.createReference.lastname} (${service.createReference.rol})<h6>
            </div>

            <div>
                ${_super.GenerateListUnorder.call(this, { title: `Datos servicio`, listUl: dataService })}
                ${_super.GenerateListUnorder.call(this, { title: `Datos de usuario`, listUl: dataUser })}
                ${_super.GenerateListUnorder.call(this, { title: `Datos de transacción`, listUl: dataTransaction })}
            </div>
            ${_super.GetFooter.call(this)}
        `;
            ServiceModel_1.default.CreateReport({ data: {
                    createBy: user.userId,
                    downloader,
                    path,
                    fecha: dateNow,
                    objectType: `equipo/equipment`
                } });
            yield _super.GeneratePDF.call(this, { content, pathPdf: path });
            setTimeout(() => {
                return res.redirect(`/report/${dateNow}.pdf`);
            }, 1000);
        });
    }
    ReportListService(req, res) {
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
            const countUser = yield ServiceModel_1.default.CountService({ filter: {} });
            while (countUser > now) {
                const listPromise = ServiceModel_1.default.GetAllService({ pag, limit });
                pag++;
                now += limit;
                const list = yield listPromise;
                list.forEach((item) => {
                    bodyTable += `
                    <tr>
                        <td>${item.date}</td>
                        <td>${item.createReference.name} ${item.createReference.lastname}</td>
                        <td>${item.typeReferences.name}</td>
                        <td>${item.transaction.mount}</td>
                        <td>${item.transaction.methodPaymentReference.title}</td>
                    </tr>
                `;
                });
            }
            const tHead = `
            <tr>
                <td>Fehca</td>
                <td>Creador</td>
                <td>Tipo</td>
                <td>Monto</td>
                <td>Metodo de pago</td>
            </tr>
        `;
            const content = `
            ${_super.GetHeader.call(this)}

            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <hr>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de lista de servicio<h6>
                <span style="font-size:17px;color:#212529">Generado por: ${user.name} ${user.lastname} (${user.rol})<span>
                <br>
                <span style="font-size:17px;color:#212529">Fecha: ${dateNow}<span>

                <br>
                <hr>
                <br>
            </div>


            ${_super.GenerateTablePdf.call(this, { listTr: bodyTable, tHead, title: `Lista de servicios` })}

            ${_super.GetFooter.call(this)}
        `;
            ServiceModel_1.default.CreateReport({ data: {
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
exports.default = ReportService;
