
const helpersHandlebars = {

    formatDate(date: any, options: any) {
        return `${date.toString().split(`GMT`)[0]}`
    },

    validRoot(user: any, options: any) {
        return user.rol == `ROOT` ? options.fn(true) : options.inverse(false);
    },

};

export default helpersHandlebars;
