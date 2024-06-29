
const helpersHandlebars = {

    formatDate(date: any, options: any) {
        return `${date.toString().split(`GMT`)[0]}`
    },

    validRoot(user: any, options: any) {
        return user.rol == `ROOT` ? options.fn(true) : options.inverse(false);
    },

    ifEqual(user: any, options:any ) {
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

export default helpersHandlebars;
