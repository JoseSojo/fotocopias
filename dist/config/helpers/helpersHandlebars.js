"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpersHandlebars = {
    formatDate(date, options) {
        return `${date.toString().split(`GMT`)[0]}`;
    },
    validRoot(user, options) {
        return user.rol == `ROOT` ? options.fn(true) : options.inverse(false);
    },
};
exports.default = helpersHandlebars;
