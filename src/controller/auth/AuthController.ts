
import { NextFunction, Request, Response } from "express";
import BaseController from "../BaseController";
import passport from "passport";

class AuthController extends BaseController {

    public LoginRender(req: Request, res: Response) {
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

