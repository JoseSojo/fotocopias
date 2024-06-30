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
const StockModel_1 = __importDefault(require("../../models/stock/StockModel"));
class ReportStock extends ReportController_1.ReportBaseController {
    constructor() {
        super();
    }
    ReportUniqueStock(req, res) {
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
            const stock = yield StockModel_1.default.GetStockById({ id });
            if (!stock) {
                req.flash(`err`, `No se ubicó el stock`);
                return res.redirect(`/users/list`);
            }
            const dateNow = _super.GenerateName.call(this);
            const path = `public/report/${dateNow}.pdf`;
            const downloader = `/report/${dateNow}.pdf`;
            const serviceHead = `
            <tr>
                <td>Agregado el:</td>
                <td>Creador</td>
                <td>Cantidad</td>
                <td>Precio Unitario</td>
                <td>Precio Total</td>
            </tr>
        `;
            let serviceBody = `
            <tr style="border-bottom:1px solid #212529">
                <td>${stock.create_at}</td>
                <td>${stock.name}</td>
                <td>${stock.quantity}</td>
                <td>${stock.quantity / stock.transaction.mount}</td>
                <td>${stock.transaction.mount}</td>
            </tr>
        `;
            const content = `
            ${_super.GetHeader.call(this)}
            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de equipo<h6>
                <h6>${stock.name}<h6>
                <p>${stock.description}<p>
                <h6>Creado por: ${stock.updateReference.name} ${stock.updateReference.lastname} (${stock.updateReference.rol})<h6>
            </div>

            <div>
                ${_super.GenerateTablePdf.call(this, { title: `Servicio`, listTr: serviceBody, tHead: serviceHead })}
            </div>
            ${_super.GetFooter.call(this)}
        `;
            StockModel_1.default.CreateReport({ data: {
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
    ReportListStock(req, res) {
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
            const countUser = yield StockModel_1.default.CountStockBy({ filter: {} });
            while (countUser > now) {
                const listPromise = StockModel_1.default.GetAllStock({ pag, limit });
                pag++;
                now += limit;
                const list = yield listPromise;
                list.forEach((item) => {
                    bodyTable += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.updateReference.name} ${item.updateReference.lastname}</td>
                        <td>${item._count.serviceType}</td>
                        <td>${item.quantity}</td>
                    </tr>
                `;
                });
            }
            const tHead = `
            <tr>
                <td>Nombre</td>
                <td>Creador</td>
                <td>Tipos ervicios</td>
                <td>Cantidad (actual: ${dateNow})</td>
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
            StockModel_1.default.CreateReport({ data: {
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
exports.default = ReportStock;
