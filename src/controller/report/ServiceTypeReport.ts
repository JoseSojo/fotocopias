import { ReportBaseController } from './ReportController';
import { Request, Response } from "express";
import ServiceModel from "../../models/service/ServiceModel";
import { UserCompleted } from '../../types/user';

export default class ReportTypeService extends ReportBaseController {

    constructor() {
        super();
    }

    public async ReportUniqueService(req: Request, res: Response) {
        const user = req.user as UserCompleted;
        const id = req.params.id;
        const type = await ServiceModel.GetTypeById({ id });

        if(!type) {
            req.flash(`err`, `No se ubicó el tipo`);
            return res.redirect(`/users/list`);
        }

        const dateNow = super.GenerateName();
        const path = `public/report/${dateNow}.pdf`;
        const downloader = `/report/${dateNow}.pdf`;

        const serviceHead = `
            <tr>
                <td>Fecha</td>
                <td>Servicio</td>
                <td>Producto</td>
                <td>Servicios realizados</td>
            </tr>
        `

        let serviceBody = `
            <tr style="border-bottom:1px solid #212529">
                <td>${type.create_at}</td>
                <td>${type.name}</td>
                <td>${type.stockExpenseReference.name}</td>
                <td>${type._count.services}</td>
            </tr>
        `
        

        const content = `
            ${super.GetHeader()}
            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de tipo de servicio<h6>
                <h6>${type.name}<h6>
                <p>${type.description}<p>
                <h6>Creado por: ${type.createReference.name} ${type.createReference.lastname} (${type.createReference.rol})<h6>
            </div>

            <div>
                ${super.GenerateTablePdf({ title:`Tipo de servicio`,listTr:serviceBody, tHead:serviceHead })}
            </div>
            ${super.GetFooter()}
        `;

        ServiceModel.CreateReport({ data:{
            createBy: user.userId,
            downloader,
            path,
            fecha: dateNow,
            objectType: `equipo/equipment`
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

        const countUser = await ServiceModel.CountTypesBy({ filter:{} }); 
        
        while (countUser > now) {
            const listPromise = ServiceModel.GetAllTypes({ pag, limit });
            pag++;
            now += limit;

            const list = await listPromise;
            list.forEach((item) => {
                bodyTable += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.createReference.name} ${item.createReference.lastname}</td>
                        <td>${item.stockExpenseReference.name}</td>
                        <td>${item._count.services}</td>
                    </tr>
                `;
            })
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
            ${super.GetHeader()}

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


            ${super.GenerateTablePdf({ listTr:bodyTable, tHead, title:`Lista de tipos de servicios` })}

            ${super.GetFooter()}
        `;

        ServiceModel.CreateReport({ data:{
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
