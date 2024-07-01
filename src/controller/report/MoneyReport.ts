
import { ReportBaseController } from './ReportController';
import { Request, Response } from "express";
import MethodModel from "../../models/method/MethodModel";
import { UserCompleted } from '../../types/user';

export default class ReportMoney extends ReportBaseController {

    constructor() {
        super();
    }

    public async ReportUniqueMoney(req: Request, res: Response) {
        
        const id = req.params.id;
        const money = await MethodModel.GetMoneyById({ id });
        const user = req.user as UserCompleted

        if(!money) {
            req.flash(`err`, `No se ubicó el moneda`);
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
                <td>Saldo</td>
                <td>Prefijo</td>
            </tr>
        `

        let serviceBody = `
            <tr style="border-bottom:1px solid #212529">
                <td>${money.create_at}</td>
                <td>${money.createReference.name} ${money.createReference.lastname}</td>
                <td>${money.title}</td>
                <td>${money.saldo} ${money.prefix}</td>
                <td>${money.prefix}</td>
            </tr>
        `;
        
        const content = `
            ${super.GetHeader()}
            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de moneda<h6>
                <h6>${money.title}<h6>
                <p>${money.description}<p>
                <h6>Creado por: ${money.createReference.name} ${money.createReference.lastname} (${money.createReference.rol})<h6>
            </div>

            <div>
                ${super.GenerateTablePdf({ title:`Moneda`,listTr:serviceBody, tHead:serviceHead })}
            </div>
            ${super.GetFooter()}
        `;

        MethodModel.CreateReport({ data:{
            createBy: user.userId,
            downloader,
            path,
            generateType: `manual`,
            fecha: dateNow,
            objectType: `moneda/ficha`
        }});
        await super.GeneratePDF({ content, pathPdf:path });
        setTimeout(()=>{
            return res.redirect(`/report/${dateNow}.pdf`);        
        }, 1000)
    }

    public async ReportListMoney(req: Request, res: Response) {
        const user = req.user as UserCompleted;
        let limit = 20;
        let pag = 0;
        let now = 0;

        const dateNow = super.GenerateName();
        const path = `public/report/${dateNow}.pdf`
        const downloader = `/report/${dateNow}.pdf`;
    
        let bodyTable = ``;

        const countUser = await MethodModel.CountMoneyBy({ filter:{} }); 
        
        while (countUser > now) {
            const listPromise = MethodModel.GetAllMoney({ pag, limit });
            pag++;
            now += limit;

            const list = await listPromise;
            list.forEach((item) => {
                bodyTable += `
                    <tr>
                        <td>${item.title}</td>
                        <td>${item.createReference.name} ${item.createReference.lastname}</td>
                        <td>${item.saldo}</td>
                        <td>${item.prefix}</td>
                        <td>${item._count.paymentMethod}</td>
                    </tr>
                `;
            })
        }

        const tHead = `
            <tr>
                <td>Nombre</td>
                <td>Creador</td>
                <td>Saldo</td>
                <td>Prefijo</td>
                <td>Métodos de pago</td>
            </tr>
        `;

        const content = `
            ${super.GetHeader()}

            <div class="">
                <h2 style="color:#212529">Libreria<h2>
                <hr>
                <h5 style="color:#414549">${dateNow}</h5>
                <h6>Reporte de lista de monedas<h6>
                <span style="font-size:17px;color:#212529">Generado por: ${user.name} ${user.lastname} (${user.rol})<span>
                <br>
                <span style="font-size:17px;color:#212529">Fecha: ${dateNow}<span>

                <br>
                <hr>
                <br>
            </div>


            ${super.GenerateTablePdf({ listTr:bodyTable, tHead, title:`Lista de monedas` })}

            ${super.GetFooter()}
        `;

        MethodModel.CreateReport({ data:{
            createBy: user.userId,
            downloader,
            generateType: `manual`,
            path,
            fecha: dateNow,
            objectType: `moneda/lista`
        }});
        super.GeneratePDF({ content, pathPdf:path });
        setTimeout(()=>{
            return res.redirect(`/report/${dateNow}.pdf`);        
        }, 1500)
    }
}

