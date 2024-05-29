
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

}

export default AbstractModel;
