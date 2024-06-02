
const helpersHandlebars = {

    formatDate(date: any, options: any) {
        return `${date.toString().split(`GMT`)[0]}`
    },

    validRoot(rol: string, options: any) {
        return rol == `ROOT` ? options.fn(true) : options.inverse(false);
    },

};

export default helpersHandlebars;
