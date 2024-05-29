import { UserCreate } from "../../types/user.d";
import AbstractModel from "../BaseModel";

class UserModel extends AbstractModel {

    constructor () {
        super();
    }

    public async CreateUser({data}:{data:UserCreate}) {
        this.StartPrisma();
        const result = await this.prisma.user.create({data}); 
        this.DistroyPrisma();
        return result;
    }

    public async FindUserByEmail({email}: {email:string}) {
        this.StartPrisma();
        const result = await this.prisma.user.findUnique({ where:{email} });
        this.DistroyPrisma();
        return result;
    }

    public async FindUserByUsername({username}: {username:string}) {
        this.StartPrisma();
        const result = await this.prisma.user.findUnique({ where:{username} });
        this.DistroyPrisma();
        return result;
    }

    public async FindUserById({id}: {id:string}) {
        this.StartPrisma();
        const result = await this.prisma.user.findFirst({ where:{userId:id} });
        this.DistroyPrisma();
        return result;
    }

    public async UpdateUser() {
        this.StartPrisma();
        
        this.DistroyPrisma();
    }

    public async AtDeleteUser() {
        this.StartPrisma();

        this.DistroyPrisma();
    }

    public async DeleteUser() {
        this.StartPrisma();

        this.DistroyPrisma();
    }

    public async ComparePassword({password, dbPassword}:{password:string, dbPassword:string}) {
        const result = await this.bcrypt.compare(password, dbPassword);
        return result;
    }

    public async HashPassword({password}:{password:string}) {
        const result = await this.bcrypt.hash(password, 15);
        return result;
    }
}

export default UserModel;
