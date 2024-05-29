// imports
import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import path from 'path';
import flash from 'connect-flash';
import passport from 'passport';
import session from 'express-session';
import exphbs from 'express-handlebars';
import helpersHandlebars from './config/helpers/helpersHandlebars';
import './config/passport';
import UserController from './controller.ts/user/UserController';
import AuthController from './controller.ts/auth/AuthController';
import { OffSession, OnSession } from './middlewares/auth';

// start
class App {
    private app: Application = express();

    constructor () {
        this.app = express();
    }

    public Start () {
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}));
        this.app.use(flash());

        // session
        this.app.use(session({
            secret: 'configbaseapp',
            resave: true,
            saveUninitialized: true
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        //views [handlebars engine]
        this.app.set('views', path.join(process.cwd(), 'src/views'));
        this.app.engine('hbs', exphbs({
        defaultLayout: 'main.hbs',
        layoutsDir: path.join(this.app.get('views'), 'layouts'),
        partialsDir: path.join(this.app.get('views'), 'partials'),
        helpers: helpersHandlebars,
        extname: '.hbs'
        }));
        this.app.set('view engine', 'hbs');

        // globals vars
        this.app.use((req: Request, res: Response, next:NextFunction) => {
            const user = req.user as any | null; 
            res.locals.user = user || null;
            res.locals.succ = req.flash('succ');
            res.locals.err = req.flash('err');
            res.locals.error = req.flash('error');
            next();
        });

        this.app.get(`/`, (req: Request, res: Response) => {
            if(req.user) return res.redirect(`/dashboard`);
            return res.redirect(`/login`);
        });

        // routes
        this.LoadRoutes();

        // static tiles        
        this.app.use(express.static(path.join(process.cwd(), 'public')))
    }

    public async LoadRoutes() {
        // routes users
        const user = new UserController();
        this.app.get(`/dashboard`, OnSession ,user.DashboardController);

        // start user
        this.app.get(`/init/app`, user.InsertUserBase);

        // routes auth
        const auth = new AuthController();
        this.app.get(`/login`, OffSession, auth.LoginRender);
        this.app.post(`/login`, OffSession, auth.LoginController);
    }

    public Run () {
        this.Start();

        const PORT = process.env.post ? process.env.post : 8080;
        this.app.listen(
            PORT,
            () => {
                console.log(`SERVER RUN [${PORT}]`);
            }
        )
    }
}

const server = new App();

server.Run();
