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
class ReportTypeService extends ReportController_1.ReportBaseController {
    constructor() {
        super();
    }
    ReportUniqueService(req, res) {
        const _super = Object.create(null, {
            GenerateName: { get: () => super.GenerateName },
            GetHeader: { get: () => super.GetHeader },
            GenerateTablePdf: { get: () => super.GenerateTablePdf },
            GetFooter: { get: () => super.GetFooter },
            GeneratePDF: { get: () => super.GeneratePDF }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const id = req.params.id;
            const type = yield ServiceModel_1.default.GetTypeById({ id });
            if (!type) {
                req.flash(`err`, `No se ubicó el tipo`);
                return res.redirect(`/users/list`);
            }
            const dateNow = _super.GenerateName.call(this);
            const path = `public/report/${dateNow}.pdf`;
            const downloader = `/report/${dateNow}.pdf`;
            const serviceHead = `
            <tr>
                <td>Fecha</td>
                <td>Servicio</td>
                <td>Producto</td>
                <td>Servicios realizados</td>
            </tr>
        `;
            let serviceBody = `
            <tr style="border-bottom:1px solid #212529">
                <td>${type.create_at}</td>
                <td>${type.name}</td>
                <td>${type.stockExpenseReference.name}</td>
                <td>${type._count.services}</td>
            </tr>
        `;
            const content = `
            ${_super.GetHeader.call(this)}
            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de tipo de servicio<h6>
                <h6>${type.name}<h6>
                <p>${type.description}<p>
                <h6>Creado por: ${type.createReference.name} ${type.createReference.lastname} (${type.createReference.rol})<h6>
            </div>

            <div>
                ${_super.GenerateTablePdf.call(this, { title: `Tipo de servicio`, listTr: serviceBody, tHead: serviceHead })}
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
            const countUser = yield ServiceModel_1.default.CountTypesBy({ filter: {} });
            while (countUser > now) {
                const listPromise = ServiceModel_1.default.GetAllTypes({ pag, limit });
                pag++;
                now += limit;
                const list = yield listPromise;
                list.forEach((item) => {
                    bodyTable += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.createReference.name} ${item.createReference.lastname}</td>
                        <td>${item.stockExpenseReference.name}</td>
                        <td>${item._count.services}</td>
                    </tr>
                `;
                });
            }
            const tHead = `
            <tr>
                <td>Nombre</td>
                <td>Creador</td>
                <td>Producto</td>
                <td>Servicios realizados</td>
            </tr>
        `;
            const content = `
            ${_super.GetHeader.call(this)}

            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <hr>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de lista de tipo de servicio<h6>
                <span style="font-size:17px;color:#212529">Generado por: ${user.name} ${user.lastname} (${user.rol})<span>
                <br>
                <span style="font-size:17px;color:#212529">Fecha: ${dateNow}<span>

                <br>
                <hr>
                <br>
            </div>


            ${_super.GenerateTablePdf.call(this, { listTr: bodyTable, tHead, title: `Lista de tipos de servicios` })}

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
exports.default = ReportTypeService;
