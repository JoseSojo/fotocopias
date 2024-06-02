
import UserModel from "../models/user/UserModel";
// import StockModel from "../models/stock/StockModel";
// import MethodModel from "../models/method/MethodModel";
// import ServiceModel from "../models/service/ServiceModel";
// import TransactionModel from "../models/transacction/TransactionModel";

// types
import { UserCreate, UserCompleted } from "../types/user";
// import { ProductCompleted, ProductCreate, StockCreate } from "../types/stock";
// import { MoneyCreate, MethodPaymentCreate, MoneyCompleted, MethodPaymentCompleted } from "../types/method";
// import { ServiceTypeCreate, ServiceCreate, ServiceTypeCompleted } from "../types/services";
// import { TransactionCreate } from "../types/transaction";


class GlobalTest {

    private user = new UserModel();
    // private stock = new StockModel();
    // private method = new MethodModel();
    // private service = new ServiceModel();
    // private transaction = new TransactionModel();

    // private adminTest: UserCompleted|null = null
    // private methodGlobal: MethodPaymentCompleted|null = null
    // private productGlobal: ProductCompleted|null = null
    // private serviceTypeGlobal: ServiceTypeCompleted|null = null

    constructor () {
        this.user = new UserModel();
        // this.stock = new StockModel();
        // this.method = new MethodModel();
        // this.service = new ServiceModel();
        // this.transaction = new TransactionModel();
    }

    async CreateUser() {
        const superadminData: UserCreate = {
            email: `admin01@foto.ft`,
            lastname: `Fotoft`,
            name: `Admin`,
            password: `admin.abc.123`,
            username: `admin01`,
            createBy: null
        }
        

        const superadmin: UserCompleted = await this.user.CreateUser({ data:superadminData });

        const admins: UserCreate[] = [
            {
                email: `admin02@foto.ft`,
                lastname: `Fotoft`,
                name: `Admin2`,
                password: `admin.abc.123`,
                username: `admin02`,
                createBy: superadmin.userId
            },
            {
                email: `admin03@foto.ft`,
                lastname: `Fotoft`,
                name: `Admin3`,
                password: `admin.abc.123`,
                username: `admin03`,
                createBy: superadmin.userId
            }
        ]

        const promiseAdmin1 = this.user.CreateUser({ data:admins[1] });
        const promiseAdmin2 = this.user.CreateUser({ data:admins[2] });

        const admin1 = await promiseAdmin1;
        const admin2 = await promiseAdmin2;

        console.log(`
            usuarios creados: ${superadmin.userId} - ${superadmin.username} - ${superadmin.createBy} (super)
            usuarios creados: ${admin1.userId} - ${admin1.username} - ${admin1.createBy}
            usuarios creados: ${admin2.userId} - ${admin2.username} - ${admin2.createBy}
        `);

        return;
    }
    
    /*
    async CreateMethodPayment() {
        const moneyList: MoneyCreate[] = [
            {
                createBy: this.getAdminTest(),
                description: `Moneda venezolana`,
                prefix: `bs`,
                title: `Bolivar`
            },
            {
                createBy: this.getAdminTest(),
                description: `Moneda americana`,
                prefix: `$`,
                title: `Dolar`
            },
        ] 

        const bolivar = this.CreateMoney({data:moneyList[0]});
        const dolar = this.CreateMoney({data:moneyList[1]});

        const methodList: MethodPaymentCreate[] = [
            {
                createBy: this.getAdminTest(),
                description: `pagomovil al banco de venezuela`,
                moneyId: (await bolivar).moneyId,
                title: `Pagomovil`
            },
            {
                createBy: this.getAdminTest(),
                description: `efectivo en bolivares`,
                moneyId: (await bolivar).moneyId,
                title: `Efectivo`
            },
            {
                createBy: this.getAdminTest(),
                description: `Divisas al cambio del BCV`,
                moneyId: (await dolar).moneyId,
                title: `Divisas`
            }

        ]

        const PromisesMethod = [
            this.method.CreateMethodPayment({data:methodList[0]}),
            this.method.CreateMethodPayment({data:methodList[1]}),
            this.method.CreateMethodPayment({data:methodList[2]}),
        ];
        const testMethod = await PromisesMethod[0];
        this.setMethodTest({ method: testMethod });

        return null;
    }

    async CreateStock() {
        // start product
        const productsList: ProductCreate[] = [
            {
                createBy: this.adminTest ? this.adminTest.userId : `123`,
                description: `hojas tamaño carta`,
                name: `hoja carta`,
            },
            {
                createBy: this.adminTest ? this.adminTest.userId : `123`,
                description: `hojas tamaño oficio`,
                name: `hoja oficio`,
            }
        ];

        const cartaPromise = this.CreateProduct({data:productsList[0]});
        const ofiPromise = this.CreateProduct({data:productsList[0]});

        const carta = await cartaPromise;
        const ofi = await ofiPromise;
        // end products

        // start stock
        const stockList: StockCreate[] = [
            {
                productId: carta.productId,
                quantityProduct: 670,
                transactionId: (await this.GenerateTransaction({ concepto:`resma hojas carta`, mount:150 })).transactionId,
                updateBy: this.getAdminTest()
            },
            {
                productId: ofi.productId,
                quantityProduct: 355,
                transactionId: (await this.GenerateTransaction({ concepto:`resma de hojas oficio`, mount:205 })).transactionId,
                updateBy: this.getAdminTest()
            }
        ] 
        const stock1Promise = this.stock.CreateStock({ data: stockList[0] });
        const stock2Promise = this.stock.CreateStock({ data: stockList[1] });

        const stock1 = await stock1Promise;
        const stock2 = await stock2Promise;

        console.log(`
            Stock: ${stock1.quantityProduct} ${stock1.transactionId} ${stock1.updateBy}
            Stock: ${stock2.quantityProduct} ${stock2.transactionId} ${stock2.updateBy}
        `);

    }

    async CreateServiceType() {
        const serviceTypeList: ServiceTypeCreate[] = [
            {
                createBy: this.getAdminTest(),
                description: `impresion carta blanco negro`,
                name: `impresion carta`,
                tonel: true,
                productExpenseId: this.getProductTest()
            },
            {
                createBy: this.getAdminTest(),
                description: `impresion carta blanco color`,
                name: `impresion carta`,
                tonel: true,
                productExpenseId: this.getProductTest()
            },
        ]

        const serviceType1Promise = this.service.CreateServiceType({ data:serviceTypeList[0] });
        const serviceType2Promise = this.service.CreateServiceType({ data:serviceTypeList[1] });

        const serviceType1 = await serviceType1Promise;
        const serviceType2 = await serviceType2Promise;

        console.log(`
            Tipo: ${serviceType1.name} ${serviceType1.productExpenseId} ${serviceType1.tonel} ${serviceType1.createBy}
            Tipo: ${serviceType2.name} ${serviceType2.productExpenseId} ${serviceType2.tonel} ${serviceType2.createBy}
        `);

    }

    async CreateService() {

        const serviceType = [this.getServiceTypeTest(),this.getServiceTypeTest(),this.getServiceTypeTest()];

        const serviceList: ServiceCreate[] = [
            {
                createBy: this.getAdminTest(),
                date: Date.now().toString(),
                description: ``,
                listServicesReferences: JSON.stringify(serviceType),
                transactionId: (await this.GenerateTransaction({ concepto:``, mount:123.56 })).transactionId
            },
            {
                createBy: this.getAdminTest(),
                date: Date.now().toString(),
                description: ``,
                listServicesReferences: JSON.stringify(serviceType),
                transactionId: (await this.GenerateTransaction({ concepto:``, mount:23.56 })).transactionId
            },
            {
                createBy: this.getAdminTest(),
                date: Date.now().toString(),
                description: ``,
                listServicesReferences: JSON.stringify(serviceType),
                transactionId: (await this.GenerateTransaction({ concepto:``, mount:12.56 })).transactionId
            },
            {
                createBy: this.getAdminTest(),
                date: Date.now().toString(),
                description: ``,
                listServicesReferences: JSON.stringify(serviceType),
                transactionId: (await this.GenerateTransaction({ concepto:``, mount:12.60 })).transactionId
            },
            {
                createBy: this.getAdminTest(),
                date: Date.now().toString(),
                description: ``,
                listServicesReferences: JSON.stringify(serviceType),
                transactionId: (await this.GenerateTransaction({ concepto:``, mount:13.56 })).transactionId
            },
            {
                createBy: this.getAdminTest(),
                date: Date.now().toString(),
                description: ``,
                listServicesReferences: JSON.stringify(serviceType),
                transactionId: (await this.GenerateTransaction({ concepto:``, mount:53.56 })).transactionId
            },
            {
                createBy: this.getAdminTest(),
                date: Date.now().toString(),
                description: ``,
                listServicesReferences: JSON.stringify(serviceType),
                transactionId: (await this.GenerateTransaction({ concepto:``, mount:15.56 })).transactionId
            },
            {
                createBy: this.getAdminTest(),
                date: Date.now().toString(),
                description: ``,
                listServicesReferences: JSON.stringify(serviceType),
                transactionId: (await this.GenerateTransaction({ concepto:``, mount:12.56 })).transactionId
            },
            {
                createBy: this.getAdminTest(),
                date: Date.now().toString(),
                description: ``,
                listServicesReferences: JSON.stringify(serviceType),
                transactionId: (await this.GenerateTransaction({ concepto:``, mount:13.56 })).transactionId
            },
            {
                createBy: this.getAdminTest(),
                date: Date.now().toString(),
                description: ``,
                listServicesReferences: JSON.stringify(serviceType),
                transactionId: (await this.GenerateTransaction({ concepto:``, mount:23.56 })).transactionId
            },
        ]

        serviceList.forEach(async (service) => {
            const result = await this.service.CreateService({ data:service });
            console.log(`
                Servicio: ${result.listServicesReferences} ${result.transactionId} ${result.createBy}
            `);
        });

    }

    async TestNow() {
        await this.CreateUser();
        await this.CreateMethodPayment();
        await this.CreateStock();
        await this.CreateServiceType();

        console.log(this.adminTest);
        console.log(this.methodGlobal);
    }

    async GenerateTransaction({ concepto, mount }: { concepto:string, mount:number }) {
        const NewTransaction: TransactionCreate = {
            concepto, mount,
            createBy: this.getAdminTest(),
            methodPaymentId: this.getMethodTest(),
        }

        const result = await this.transaction.CreateTransaction({ data: NewTransaction });
        return result;
    }

    // generic produc create
    async CreateProduct({data}:{data:ProductCreate}) {
        return await this.stock.CreateProduct({data});
    }

    // generic produc create
    async CreateMoney({data}:{data:MoneyCreate}) {
        return await this.method.CreateMoney({data});
    }

    // set admin
    setAdminTest({user}:{user:UserCompleted}) {
        this.adminTest = user;
    }

    // get admin
    getAdminTest(): string {
        return this.adminTest ? this.adminTest.userId : `123`;
    }

    // set method
    setMethodTest({method}:{method:MethodPaymentCompleted}) {
        this.methodGlobal = method;
    }

    // get method
    getMethodTest(): string {
        return this.methodGlobal ? this.methodGlobal.paymentMethodId : `123`;
    }

    // set product
    setProductTest({produc}:{produc: ProductCompleted}) {
        this.productGlobal = produc;
    }

    // get product
    getProductTest(): string {
        return this.productGlobal ? this.productGlobal.productId : `123`;
    }

    // set servicetype
    setServiceTypeTest({type}:{type: ServiceTypeCompleted}) {
        this.serviceTypeGlobal = type;
    }

    // get servicetype
    getServiceTypeTest(): string {
        return this.serviceTypeGlobal ? this.serviceTypeGlobal.serviceTypeId : `123`;
    }
    */
}

export default GlobalTest;
