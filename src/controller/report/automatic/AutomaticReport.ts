import ServiceModel from "../../../models/service/ServiceModel";
import { ReportBaseController } from "../ReportController";

class AutomaticReport extends ReportBaseController {

    public async ReportForDay() {
        let limit = 20;
        let pag = 0;
        let now = 0;

        const dateNow = super.GenerateName();
        const path = `public/report/${dateNow}.pdf`
        const downloader = `/report/${dateNow}.pdf`;
    
        let bodyTable = ``;

        const date = new Date();
        const month = date.getMonth()+1;
        const day = date.getDate();
        const toDay = `${date.getFullYear()}-${month<10 ? `0${month}`:`${month}` }-${day<10 ? `0${day}`:`${day}` }`;

        const countService = await ServiceModel.CountService({ filter:{date:toDay} })

        while (countService > now) {
            const listPromise = ServiceModel.GetAllServicesFilter({ filter:{date:toDay}, pag, limit });
            pag++;
            now += limit;

            const list = await listPromise;
            list.forEach((item) => {
                bodyTable += `
                    <tr>
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
                <h6>Reporte diario (cierre de caja)<h6>
                <br>
                <hr>
                <br>
            </div>

            ${super.GenerateTablePdf({ listTr:bodyTable, tHead, title:`Lista de servicios del ${dateNow}` })}

            ${super.GetFooter()}
        `;

        ServiceModel.CreateReport({ data:{
            downloader,
            path,
            fecha: dateNow,
            generateType: `automatico`,
            objectType: `service`
        }});
        super.GeneratePDF({ content, pathPdf:path });
    }

}

export default AutomaticReport;
