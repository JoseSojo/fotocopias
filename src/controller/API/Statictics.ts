import BaseController from "../BaseController";
import ServiceModel from "../../models/service/ServiceModel";
import MethodModel from "../../models/method/MethodModel";
import StockModel from "../../models/stock/StockModel";
import TransactionModel from "../../models/transacction/TransactionModel";
import UserModel from "../../models/user/UserModel";
import { Request, Response } from "express";

class StaticticsController extends BaseController {
    
    // top 5 usuarios mas ativos
    async APIStaticticsTop5Users(req: Request, res: Response) {
        const limit = req.query.limit;
        const usersList = UserModel.StaticticsTopUsers({ limit:limit ? Number(limit) : 3 });

        return res.json({body:await usersList});
    }


    // metodos de pagos ma usados
    // ingresos egresos
    async APIStaticsMethodPayment(req: Request, res: Response) {
        const result = MethodModel.StaticticsMethod({});
        const result2 = MethodModel.StaticticsEgresoIngreso({});
        return res.json({method:await result, mount: await result2});
    }

    // equipos mas usados
    // stock mas usado
    async APIStockStaticitcs(req: Request, res: Response) {
        const {resultEquipment,resultServiceType} = await StockModel.StaticticsAll({});
        return res.json({ resultEquipment, resultServiceType });
    }

    // tipos mas usados
    // grafica de tiempo con servicios
    // ingresos/egresos

    async APIStaticticsServiceType(req: Request, res: Response) {
        const result = await ServiceModel.StatisticsServicesType();
        const serviceTypes = await ServiceModel.GetAllTypes({ pag:0, limit:100 });

        const servicesTypesList: any[] = [];

        result.forEach(async(key,i) => {
            const save = {
                typeId: key.typeId,
                count: key._count._all,
                name: serviceTypes.find(item => item.serviceTypeId == key.typeId)?.name
            }
            servicesTypesList.push(save);
        });

        return res.json({ body: servicesTypesList });
    }

    // estadisticas por year
    async APIStaticsForYear(req: Request, res: Response) {
        const {year} = req.query;
        let yearSend = year;
        if(!year) {
            const date = new Date();
            yearSend = date.getFullYear();
        }

        const response = await UserModel.GetStatcticByYear({ year:Number(yearSend) });
        return res.json({ body:response });
    }

}

export default StaticticsController;
