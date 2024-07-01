import { ReportBaseController } from './ReportController';
import { Request, Response } from "express";
import ServiceModel from "../../models/service/ServiceModel";
import { UserCompleted } from '../../types/user';

export default class ReportService extends ReportBaseController {

    constructor() {
        super();
    }

    public async ReportUniqueService(req: Request, res: Response) {
        
        const id = req.params.id;
        const service = await ServiceModel.GetServiceById({ id });
        const user = req.user as UserCompleted;

        if(!service) {
            req.flash(`err`, `No se ubicó el servicio`);
            return res.redirect(`/users/list`);
        }

        const dateNow = super.GenerateName();
        const path = `public/report/${dateNow}.pdf`;        
        const downloader = `/report/${dateNow}.pdf`;

        const dataService = [
            { name: `Tipo de servicio`, value: service.typeReferences.name },
            { name: `Fecha`, value: service.date.toString() },
            { name: `Producto utilizado`, value: service.typeReferences.stockExpenseReference.name }
        ]
        
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
            ${super.GetHeader()}
            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de servicio<h6>
                <p>${service.description}<p>
                <h6>Creado por: ${service.createReference.name} ${service.createReference.lastname} (${service.createReference.rol})<h6>
            </div>

            <div>
                ${super.GenerateListUnorder({ title:`Datos servicio`, listUl:dataService })}
                ${super.GenerateListUnorder({ title:`Datos de usuario`, listUl:dataUser })}
                ${super.GenerateListUnorder({ title:`Datos de transacción`, listUl:dataTransaction })}
            </div>
            ${super.GetFooter()}
        `;

        ServiceModel.CreateReport({ data:{
            createBy: user.userId,
            downloader,
            path,
            generateType: `manual`,
            fecha: dateNow,
            objectType: `servicio/ficha`
        }});
        await super.GeneratePDF({ content, pathPdf:path });
        setTimeout(()=>{
            return res.redirect(`/report/${dateNow}.pdf`);        
        }, 1000)
    }

    public async ReportListService(req: Request, res: Response) {
        const user = req.user as UserCompleted;
        let limit = 20;
        let pag = 0;
        let now = 0;

        const dateNow = super.GenerateName();
        const path = `public/report/${dateNow}.pdf`
        const downloader = `/report/${dateNow}.pdf`;
    
        let bodyTable = ``;

        const countUser = await ServiceModel.CountService({ filter:{} }); 
        
        while (countUser > now) {
            const listPromise = ServiceModel.GetAllService({ pag, limit });
            pag++;
            now += limit;

            const list = await listPromise;
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
            })
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
            ${super.GetHeader()}

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


            ${super.GenerateTablePdf({ listTr:bodyTable, tHead, title:`Lista de servicios` })}

            ${super.GetFooter()}
        `;

        ServiceModel.CreateReport({ data:{
            generateType: `manual`,
            createBy: user.userId,
            downloader,
            path,
            fecha: dateNow,
            objectType: `servicio/lista`
        }});
        super.GeneratePDF({ content, pathPdf:path });
        setTimeout(()=>{
            return res.redirect(`/report/${dateNow}.pdf`);        
        }, 1500)
    }
}
