import { Request, Response } from "express";
import UserModel from "../models/user/UserModel";
import MethodModel from "../models/method/MethodModel";
import StockModel from "../models/stock/StockModel";
import ServiceModel from "../models/service/ServiceModel";
import TransactionModel from "../models/transacction/TransactionModel";
import { UserCompleted, UserCreate } from "../types/user.d";
import { MoneyCreate, MethodPaymentCreate, MoneyCompleted, MethodPaymentCompleted } from "../types/method";

class BaseController {

    public adminTest: UserCompleted | null = null
    public moneyTest: MoneyCompleted | null = null
    public methodTest: MethodPaymentCompleted | null = null

    public async SerRoot(req: Request, res: Response) {
        UserModel.StartPrisma();
        UserModel.prisma.user.update({
            data: {
                rol: `ROOT`
            },
            where: {
                email: `superadmin@foto.ft`
            }
        })
    }

    public async InsertUserBase(req: Request, res: Response) {
        try {
            const listResponse = [];
            const model = UserModel;
            const superadmin: UserCreate = {
                email: `superadmin@foto.ft`,
                lastname: `Ft`,
                name: `Superadmin`,
                password: await model.HashPassword({password:`super@foto.ft`}),
                username: `superadmin`,
                createBy: null,
            }
            
            const superadminResult = await model.CreateUser({data:superadmin, rol: `ROOT`});

            const admin1: UserCreate = {
                email: `admin01@fotocopia.ft`,
                lastname: `Ft`,
                name: `Admin`,
                password: await model.HashPassword({password:`admin@foto.ft`}),
                username: `Admin01`,
                createBy: superadminResult.userId
            }
            const admin2: UserCreate = {
                email: `admin02@fotocopia.ft`,
                lastname: `Ft`,
                name: `Admin`,
                password: await model.HashPassword({password:`admin@foto.ft`}),
                username: `Admin02`,
                createBy: superadminResult.userId
            }

            if(superadminResult) {
                admin1.createBy = superadminResult.userId;
                admin2.createBy = superadminResult.userId;
            }

            const admin1Promise = model.CreateUser({data:admin1});
            const admin2Promise = model.CreateUser({data:admin2});

            const admin1Result = await admin1Promise;
            const admin2Result = await admin2Promise;

            listResponse.push(superadminResult);        
            listResponse.push(admin1Result);        
            listResponse.push(admin2Result);    
            
            return res.status(200).json({body:listResponse});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ok:false});   
        }
    }

    public async StartStaticticsForYear(req: Request, res: Response) {
        const date = new Date();
        const year = date.getFullYear();

        const result = await UserModel.CreateStatictisForYear({ year });

        return res.json({ body:result });


    }
}

export default BaseController;
