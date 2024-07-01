import { ReportBaseController } from './ReportController';
import { Request, Response } from "express";
import StockModel from "../../models/stock/StockModel";
import { UserCompleted } from '../../types/user';

export default class ReportStock extends ReportBaseController {

    constructor() {
        super();
    }

    public async ReportUniqueStock(req: Request, res: Response) {
        const user = req.user as UserCompleted;
        const id = req.params.id;
        const stock = await StockModel.GetStockById({ id });

        if(!stock) {
            req.flash(`err`, `No se ubicó el stock`);
            return res.redirect(`/users/list`);
        }

        const dateNow = super.GenerateName();
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
        `

        let serviceBody = `
            <tr style="border-bottom:1px solid #212529">
                <td>${stock.create_at}</td>
                <td>${stock.name}</td>
                <td>${stock.quantity}</td>
                <td>${stock.quantity/stock.transaction.mount}</td>
                <td>${stock.transaction.mount}</td>
            </tr>
        `;       

        const content = `
            ${super.GetHeader()}
            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de equipo<h6>
                <h6>${stock.name}<h6>
                <p>${stock.description}<p>
                <h6>Creado por: ${stock.updateReference.name} ${stock.updateReference.lastname} (${stock.updateReference.rol})<h6>
            </div>

            <div>
                ${super.GenerateTablePdf({ title:`Servicio`,listTr:serviceBody, tHead:serviceHead })}
            </div>
            ${super.GetFooter()}
        `;

        StockModel.CreateReport({ data:{
            createBy: user.userId,
            downloader,
            generateType: `manual`,
            path,
            fecha: dateNow,
            objectType: `stock/ficha`
        }});
        await super.GeneratePDF({ content, pathPdf:path });
        setTimeout(()=>{
            return res.redirect(`/report/${dateNow}.pdf`);        
        }, 1000)
    }

    public async ReportListStock(req: Request, res: Response) {
        const user = req.user as UserCompleted;
        let limit = 20;
        let pag = 0;
        let now = 0;

        const dateNow = super.GenerateName();
        const path = `public/report/${dateNow}.pdf`
        const downloader = `/report/${dateNow}.pdf`;
    
        let bodyTable = ``;

        const countUser = await StockModel.CountStockBy({ filter:{} }); 
        
        while (countUser > now) {
            const listPromise = StockModel.GetAllStock({ pag, limit });
            pag++;
            now += limit;

            const list = await listPromise;
            list.forEach((item) => {
                bodyTable += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.updateReference.name} ${item.updateReference.lastname}</td>
                        <td>${item._count.serviceType}</td>
                        <td>${item.quantity}</td>
                    </tr>
                `;
            })
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
            ${super.GetHeader()}

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


            ${super.GenerateTablePdf({ listTr:bodyTable, tHead, title:`Lista de equipos` })}

            ${super.GetFooter()}
        `;

        StockModel.CreateReport({ data:{
            createBy: user.userId,
            downloader,
            generateType: `manual`,
            path,
            fecha: dateNow,
            objectType: `stock/lista`
        }});
        super.GeneratePDF({ content, pathPdf:path });
        setTimeout(()=>{
            return res.redirect(`/report/${dateNow}.pdf`);        
        }, 1500)
    }
}
