import { TransactionCreate } from '../types/transaction.d'; 
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

class AbstractModel {

    public prisma = new PrismaClient();
    public bcrypt = bcrypt;

    constructor () {
        this.prisma = new PrismaClient();
        this.bcrypt = bcrypt;
    }

    StartPrisma() {
        this.prisma = new PrismaClient();
    }

    async DistroyPrisma() {
        await this.prisma.$disconnect();
    }

    async CreateTransaction({data}: {data: TransactionCreate}) {
        this.StartPrisma();
        const result = await this.prisma.transaction.create({data});
        this.DistroyPrisma();
        return result;
    }

}

export default AbstractModel;
