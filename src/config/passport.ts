import passport from "passport";
import {Strategy} from "passport-local";
import UserModel from "../models/user/UserModel";

passport.use("local.login", new Strategy({
  usernameField: "email",
  passwordField: "password"
}, async (email: string, password: string, done: any) => {
    const model = new UserModel(); 
    const user = await model.FindUserByEmail({email});

    if (user) {
        const dbPassword: string = user.password;
        const match = await model.ComparePassword({password, dbPassword});
        console.log(match);

        if (match) {
          console.log(match);
          return done(null, user);
        }

        else return done(null, false, {message: "Verifica tus credenciales. p"});

    } else return done(null, false, {message: "Verifica tus credenciales. e"});
}));

passport.serializeUser((user: any, done: any) => {
  done(null, user.userId);
});

passport.deserializeUser(async (id: string, done: any) => {
  const model = new UserModel(); 
  const user = await model.FindUserById({id});
  if(!user) return done(true, null);
  console.log(user);
  return done(null, user); // exito
});