import { Request, Response } from "express";
import UserModel from "../models/user/UserModel";
import { UserCreate } from "../types/user.d";

class BaseController {

    async InsertUserBase(req: Request, res: Response) {
        try {
            const listResponse = [];
            const model = new UserModel();
            const superadmin: UserCreate = {
                email: `superadmin@fotocopia.ft`,
                lastname: `Ft`,
                name: `Superadmin`,
                password: await model.HashPassword({password:`superadmin@foto.ft`}),
                username: `superadmin`,
            }
            
            const superadminResult = await model.CreateUser({data:superadmin});

            const admin1: UserCreate = {
                email: `admin01@fotocopia.ft`,
                lastname: `Ft`,
                name: `Admin`,
                password: await model.HashPassword({password:`admin@foto.ft`}),
                username: `Admin01`
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

            listResponse.push(`UserCreate: ${superadminResult.name} ${superadminResult.lastname}`);        
            listResponse.push(`UserCreate: ${admin1Result.name} ${admin1Result.lastname}`);        
            listResponse.push(`UserCreate: ${admin2Result.name} ${admin2Result.lastname}`);    
            
            return res.status(200).json({body:listResponse});
        } catch (error) {
            console.log(error);
            res.status(500).json({ok:false});   
        }
    }

}

export default BaseController;
