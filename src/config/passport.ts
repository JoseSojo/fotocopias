import passport from "passport";
import {Strategy} from "passport-local";

passport.use("local.login", new Strategy({
  usernameField: "email",
  passwordField: "password"
}, async (email: string, password: string, done: any) => {
//   const user: any | null = await User.findOne({email});
    const user = {email:`josesojo`, password:`josesojo`,id:1};

    if (user) {
        const dbPassword: string = user.password;
        // const match = await ComparePassword({password, passwordDb: dbPassword});
        const match = true;
        if (match) {
        return done(null, user);
        } else {
        console.log(`password`, password);
        return done(null, false, {message: "Verifica tus credenciales. p"});
        }
    } else {

        return done(null, false, {message: "Verifica tus credenciales. e"});
    }
}));

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done: any) => {
    const user = {email:`josesojo`, password:`josesojo`,id:1};
    done(null, user);
});