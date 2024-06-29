import { ReportBaseController } from './ReportController';
import { Request, Response } from "express";
import BaseController from "../BaseController";
import UserModel from "../../models/user/UserModel";
import { UserCompleted } from '../../types/user';

export default class ReportUser extends ReportBaseController {

    constructor() {
        super();
    }

    public async ReportUniqueUser(req: Request, res: Response) {
        
        const id = req.params.id;
        const user = await UserModel.FindUserById({ id });

        if(!user) {
            req.flash(`err`, `No se ubicó el usuario`);
            return res.redirect(`/users/list`);
        }

        const dateNow = super.GenerateName();
        const path = `public/report/${dateNow}.pdf`
    
        const serviceHead = `
            <tr>
                <td>Fecha</td>
                <td>Descripción</td>
                <td>Tipo de servicio</td>
                <td></td>
            </tr>
        `
        let serviceBody = ``;
        user.service.forEach((item) => {
            serviceBody += `
                <tr style="border-bottom:1px solid #212529">
                    <td>${item.date}</td>
                    <td>${item.description}</td>
                    <td>${item.typeReferences.name}</td>
                    <td>${item.transaction.type} ${item.transaction.mount} ${item.transaction.methodPaymentReference.moneyReference.prefix}</td>
                </tr>
            `
        })

        const DataCount = [
            {title: `Metodos de pago`, count : user._count.paymentMethod},
            {title: `Monedas`, count : user._count.meney},
            {title: `Inventario`, count : user._count.stock},
            {title: `Transacciones`, count : user._count.transaction},
            {title: `Tipos de servicios`, count : user._count.serviceType},
            {title: `Servicios`, count : user._count.service},
            {title: `Equipo`, count : user._count.equiment}
        ] 
        let ListCount = ``;
        DataCount.forEach((item) => {
            ListCount += `
                <li>
                    <span>${item.title}</span>:
                    <span>${item.count}</span>
                </li>
            `;
        });

        const content = `
            ${super.GetHeader()}
            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de usuario<h6>
                <h6>${user.name} ${user.lastname}<h6>
                <h6>${user.email}<h6>
                <h6>(${user.rol})<h6>
            </div>

            <div style="margin:1.5em 0">
                ${ListCount}
            </div>

            <div>
                ${super.GenerateTablePdf({ title:`Servicio`,listTr:serviceBody, tHead:serviceHead })}
            </div>
            ${super.GetFooter()}
        `;

        await super.GeneratePDF({ content, pathPdf:path });
        setTimeout(()=>{
            return res.redirect(`/report/${dateNow}.pdf`);        
        }, 1000)
    }

    public async ReportListUser(req: Request, res: Response) {
        const user = req.user as UserCompleted;
        let limit = 20;
        let pag = 0;
        let now = 0;

        const dateNow = super.GenerateName();
        const path = `public/report/${dateNow}.pdf`
    
        let bodyTable = ``;

        const countUser = await UserModel.CountBy({ filter:{} }); 
        
        while (countUser > now) {
            const listPromise = UserModel.GetUsers({ pag, limit });
            pag++;
            now += limit;

            const list = await listPromise;
            list.forEach((item) => {
                bodyTable += `
                    <tr>
                        <td>${item.username}</td>
                        <td>${item.name}</td>
                        <td>${item.lastname}</td>
                        <td>${item.rol}</td>
                        <td>${item.email}</td>
                    </tr>
                `;
            })
        }

        const tHead = `
            <tr>
                <td>username</td>
                <td>name</td>
                <td>lastname</td>
                <td>rol</td>
                <td>email</td>
            </tr>
        `;

        const content = `
            ${super.GetHeader()}

            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <hr>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de lista de usuarios<h6>
                <span style="font-size:17px;color:#212529">Generado por: ${user.name} ${user.lastname} (${user.rol})<span>
                <br>
                <span style="font-size:17px;color:#212529">Fecha: ${dateNow}<span>

                <br>
                <hr>
                <br>
            </div>


            ${super.GenerateTablePdf({ listTr:bodyTable, tHead, title:`Lista de usuarios` })}

            ${super.GetFooter()}
        `;

        super.GeneratePDF({ content, pathPdf:path });
        setTimeout(()=>{
            return res.redirect(`/report/${dateNow}.pdf`);        
        }, 1500)
    }
}
