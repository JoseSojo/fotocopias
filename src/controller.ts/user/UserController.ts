import { Request, Response } from "express";
import BaseController from "../BaseController";

class UserController extends BaseController {

    public async DashboardController (req: Request, res: Response) {

        console.log(req.user);
        return res.render(`s/dashboard.hbs`, {
            ubication: `Resumen`
        });
    }

}

export default UserController;
