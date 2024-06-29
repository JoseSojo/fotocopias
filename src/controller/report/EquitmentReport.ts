import { ReportBaseController } from './ReportController';
import { Request, Response } from "express";
import EquitmentModel from "../../models/equipment/EquipmentModel";
import { UserCompleted } from '../../types/user';

export default class ReportEquitment extends ReportBaseController {

    constructor() {
        super();
    }

    public async ReportUniqueEquitment(req: Request, res: Response) {
        
        const id = req.params.id;
        const equitment = await EquitmentModel.GetEquipmentById({ id });
        const user = req.user as UserCompleted;

        if(!equitment) {
            req.flash(`err`, `No se ubicó el equitment`);
            return res.redirect(`/users/list`);
        }

        const dateNow = super.GenerateName();
        const path = `public/report/${dateNow}.pdf`;
        const downloader = `/report/${dateNow}.pdf`;

        const serviceHead = `
            <tr>
                <td>Fecha</td>
                <td>Servicio</td>
                <td>Mount</td>
            </tr>
        `

        let serviceBody = ``;
        equitment.servicesId.forEach((item) => {
            serviceBody += `
                <tr style="border-bottom:1px solid #212529">
                    <td>${item.date}</td>
                    <td>${item.typeReferences.name}</td>
                    <td>${item.transaction.mount} ${item.transaction.methodPaymentReference.moneyReference.prefix}</td>
                </tr>
            `
        });
        

        const content = `
            ${super.GetHeader()}
            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de equipo<h6>
                <h6>${equitment.name}<h6>
                <p>${equitment.description}<p>
                <h6>Creado por: ${equitment.createReference.name} ${equitment.createReference.lastname} (${equitment.createReference.rol})<h6>
            </div>

            <div>
                ${super.GenerateTablePdf({ title:`Servicio`,listTr:serviceBody, tHead:serviceHead })}
            </div>
            ${super.GetFooter()}
        `;

        EquitmentModel.CreateReport({ data:{
            createBy: user.userId,
            downloader,
            path,
            fecha: dateNow,
            objectType: `equipo/equipment`,
        }});
        await super.GeneratePDF({ content, pathPdf:path });
        setTimeout(()=>{
            return res.redirect(`/report/${dateNow}.pdf`);        
        }, 1000)
    }

    public async ReportListEquipment(req: Request, res: Response) {
        const user = req.user as UserCompleted;
        let limit = 20;
        let pag = 0;
        let now = 0;

        const dateNow = super.GenerateName();
        const path = `public/report/${dateNow}.pdf`
        const downloader = `/report/${dateNow}.pdf`;
    
        let bodyTable = ``;

        const countUser = await EquitmentModel.CountEquipmentBy({ filter:{} }); 
        
        while (countUser > now) {
            const listPromise = EquitmentModel.GetAllEquipment({ pag, limit });
            pag++;
            now += limit;

            const list = await listPromise;
            list.forEach((item) => {
                bodyTable += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.createReference.name} ${item.createReference.lastname}</td>
                        <td>${item._count.servicesId}</td>
                    </tr>
                `;
            })
        }

        const tHead = `
            <tr>
                <td>Nombre</td>
                <td>Creador</td>
                <td>Servicios</td>
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

        EquitmentModel.CreateReport({ data:{
            createBy: user.userId,
            downloader,
            path,
            fecha: dateNow,
            objectType: `equipo/equipment`
        }});
        super.GeneratePDF({ content, pathPdf:path });
        setTimeout(()=>{
            return res.redirect(`/report/${dateNow}.pdf`);        
        }, 1500)
    }
}
