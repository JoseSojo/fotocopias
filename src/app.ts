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

// start
class App {
    private app: Application = express();

    constructor () {
        this.app = express();
    }

    Start () {
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
            return res.render(`app`);
        });

        // static tiles
        console.log(path.join(process.cwd(), 'public'));
        
        this.app.use(express.static(path.join(process.cwd(), 'public')))
    }

    Run () {
        this.Start();

        const PORT = process.env.post ? process.env.post : 8080;
        this.app.listen(
            PORT,
            () => {
                console.log(`SERVER RUN -> port ${PORT}`);
                console.log(`VISITE http:localhost:${PORT}`);
            }
        )
    }
}

const server = new App();

server.Run();
