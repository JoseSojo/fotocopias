
import { ReportBaseController } from './ReportController';
import { Request, Response } from "express";
import MethodModel from "../../models/method/MethodModel";
import { UserCompleted } from '../../types/user';

export default class ReportMethod extends ReportBaseController {

    constructor() {
        super();
    }

    public async ReportUniqueMethod(req: Request, res: Response) {
        
        const id = req.params.id;
        const method = await MethodModel.GetMethodPaymentById({ id });
        const user = req.user as UserCompleted;

        if(!method) {
            req.flash(`err`, `No se ubicó el método`);
            return res.redirect(`/users/list`);
        }

        const dateNow = super.GenerateName();
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
            ${super.GetHeader()}
            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de moneda<h6>
                <h6>${method.title}<h6>
                <p>${method.description}<p>
                <h6>Creado por: ${method.createReference.name} ${method.createReference.lastname} (${method.createReference.rol})<h6>
            </div>

            <div>
                ${super.GenerateTablePdf({ title:`Método de pago`,listTr:serviceBody, tHead:serviceHead })}
            </div>
            ${super.GetFooter()}
        `;

        MethodModel.CreateReport({ data:{
            createBy: user.userId,
            generateType: `manual`,
            downloader,
            path,
            fecha: dateNow,
            objectType: `metodo/ficha`
        }});
        await super.GeneratePDF({ content, pathPdf:path });
        setTimeout(()=>{
            return res.redirect(`/report/${dateNow}.pdf`);        
        }, 1000)
    }

    public async ReportListMethod(req: Request, res: Response) {
        const user = req.user as UserCompleted;
        let limit = 20;
        let pag = 0;
        let now = 0;

        const dateNow = super.GenerateName();
        const path = `public/report/${dateNow}.pdf`
        const downloader = `/report/${dateNow}.pdf`;
    
        let bodyTable = ``;

        const countUser = await MethodModel.CountMethodBy({ filter:{} }); 
        while (countUser > now) {
            const listPromise = MethodModel.GetAllMethodPayment({ pag, limit });
            pag++;
            now += limit;

            const list = await listPromise;
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
            })
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
            ${super.GetHeader()}

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


            ${super.GenerateTablePdf({ listTr:bodyTable, tHead, title:`Lista de métodos` })}

            ${super.GetFooter()}
        `;

        MethodModel.CreateReport({ data:{
            createBy: user.userId,
            generateType: `manual`,
            downloader,
            path,
            fecha: dateNow,
            objectType: `metodo/lsita`
        }});
        super.GeneratePDF({ content, pathPdf:path });
        setTimeout(()=>{
            return res.redirect(`/report/${dateNow}.pdf`);        
        }, 1500)
    }
}

