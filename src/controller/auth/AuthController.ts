
import { NextFunction, Request, Response } from "express";
import BaseController from "../BaseController";
import passport from "passport";
import MethodModel from "../../models/method/MethodModel";
import StockModel from "../../models/stock/StockModel";

class AuthController extends BaseController {

    public async LoginRender(req: Request, res: Response) {
        // const result = await StockModel.StaticticsAll({});
        // console.log(result);
        return res.render(`p/login.hbs`);
    }

    public async LoginController(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("local.login", {
            successRedirect: "/dashboard",
            failureRedirect: "/login",
            failureFlash: true
        })(req, res, next);
    }

}

export default AuthController;

