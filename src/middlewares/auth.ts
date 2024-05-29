import { NextFunction } from "express";
import { RequestExtended } from "../types/ex.d";

export const OnSession = function(req: any, res: any, next: NextFunction) {
    if (req.isAuthenticated()) {
        req as RequestExtended;
        next();
    } else {
        // here
        req.flash("err", "Debes iniciar sessión.");
        res.redirect("/login");
    }
};

export const OffSession = function(req: any, res: any, next: NextFunction) {
    if (!req.isAuthenticated()) {
        next();
    } else {
        // here
        req.flash("err", "No puedes visitar esa pagina.");
        res.redirect("/dashboard");
    }
};
