"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpersHandlebars = {
    formatDate(date, options) {
        return `${date.toString().split(`GMT`)[0]}`;
    },
    validRoot(user, options) {
        return user.rol == `ROOT` ? options.fn(true) : options.inverse(false);
    },
    ifEqual(user, options) {
        return user.rol == `ROOT`
            ? `
            <li class="menu">
                <a href="/config" data-active="true" class="dropdown-toggle">
                    <p class="">
                        <i class="lead bi bi-wrench-adjustable-circle-fill"></i>
                        <strong>Configuraciones</strong>
                    </p>
                </a>
            </li>
        `
            : `
            <li class="menu">
                <a href="/config/methods" data-active="true" class="dropdown-toggle">
                    <p class="">
                        <i class="lead bi bi-wrench-adjustable-circle-fill"></i>
                        <strong>Métodos de pago</strong>
                    </p>
                </a>
            </li>
        `;
    }
};
exports.default = helpersHandlebars;
