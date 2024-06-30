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
const EquipmentModel_1 = __importDefault(require("../../models/equipment/EquipmentModel"));
class ReportEquitment extends ReportController_1.ReportBaseController {
    constructor() {
        super();
    }
    ReportUniqueEquitment(req, res) {
        const _super = Object.create(null, {
            GenerateName: { get: () => super.GenerateName },
            GetHeader: { get: () => super.GetHeader },
            GenerateTablePdf: { get: () => super.GenerateTablePdf },
            GetFooter: { get: () => super.GetFooter },
            GeneratePDF: { get: () => super.GeneratePDF }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const equitment = yield EquipmentModel_1.default.GetEquipmentById({ id });
            const user = req.user;
            if (!equitment) {
                req.flash(`err`, `No se ubicó el equitment`);
                return res.redirect(`/users/list`);
            }
            const dateNow = _super.GenerateName.call(this);
            const path = `public/report/${dateNow}.pdf`;
            const downloader = `/report/${dateNow}.pdf`;
            const serviceHead = `
            <tr>
                <td>Fecha</td>
                <td>Servicio</td>
                <td>Mount</td>
            </tr>
        `;
            let serviceBody = ``;
            equitment.servicesId.forEach((item) => {
                serviceBody += `
                <tr style="border-bottom:1px solid #212529">
                    <td>${item.date}</td>
                    <td>${item.typeReferences.name}</td>
                    <td>${item.transaction.mount} ${item.transaction.methodPaymentReference.moneyReference.prefix}</td>
                </tr>
            `;
            });
            const content = `
            ${_super.GetHeader.call(this)}
            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de equipo<h6>
                <h6>${equitment.name}<h6>
                <p>${equitment.description}<p>
                <h6>Creado por: ${equitment.createReference.name} ${equitment.createReference.lastname} (${equitment.createReference.rol})<h6>
            </div>

            <div>
                ${_super.GenerateTablePdf.call(this, { title: `Servicio`, listTr: serviceBody, tHead: serviceHead })}
            </div>
            ${_super.GetFooter.call(this)}
        `;
            EquipmentModel_1.default.CreateReport({ data: {
                    createBy: user.userId,
                    downloader,
                    path,
                    fecha: dateNow,
                    objectType: `equipo/equipment`,
                } });
            yield _super.GeneratePDF.call(this, { content, pathPdf: path });
            setTimeout(() => {
                return res.redirect(`/report/${dateNow}.pdf`);
            }, 1000);
        });
    }
    ReportListEquipment(req, res) {
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
            const countUser = yield EquipmentModel_1.default.CountEquipmentBy({ filter: {} });
            while (countUser > now) {
                const listPromise = EquipmentModel_1.default.GetAllEquipment({ pag, limit });
                pag++;
                now += limit;
                const list = yield listPromise;
                list.forEach((item) => {
                    bodyTable += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.createReference.name} ${item.createReference.lastname}</td>
                        <td>${item._count.servicesId}</td>
                    </tr>
                `;
                });
            }
            const tHead = `
            <tr>
                <td>Nombre</td>
                <td>Creador</td>
                <td>Servicios</td>
            </tr>
        `;
            const content = `
            ${_super.GetHeader.call(this)}

            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <hr>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de lista de equipos<h6>
                <span style="font-size:17px;color:#212529">Generado por: ${user.name} ${user.lastname} (${user.rol})<span>
                <br>
                <span style="font-size:17px;color:#212529">Fecha: ${dateNow}<span>

                <br>
                <hr>
                <br>
            </div>


            ${_super.GenerateTablePdf.call(this, { listTr: bodyTable, tHead, title: `Lista de equipos` })}

            ${_super.GetFooter.call(this)}
        `;
            EquipmentModel_1.default.CreateReport({ data: {
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
exports.default = ReportEquitment;
