import { prisma } from "../lib/db"
import {createHmac , randomBytes } from "node:crypto"
import JWT from 'jsonwebtoken'

const JSON_SECRET = "heelo@welcomPrisma_grapql"


export interface createUserPayload {
    firstName: string
    lastName?: string
    email: string
    password: string
}

export interface userGetTokenPayoload{
    email: string
    password: string
}


class UserServices {

    private static generateHash(salt: string, password: string){
       const hashedPassword = createHmac('sha256' , salt).update(password).digest('hex')
       return hashedPassword
    }
    public static createUser(payload: createUserPayload){
        const {firstName,lastName,email,password} = payload
        const salt = randomBytes(32).toString("hex");
        const hashedPassword = UserServices.generateHash(salt,password)
        return prisma.user.create({
            data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            salt
            }
        })
    }

    private static findUserByEmail(email: string){
       return prisma.user.findUnique({ where:{email}})
    }

    public static async getUserToken(payload: userGetTokenPayoload){
        const {email,password} = payload

        const user = await UserServices.findUserByEmail(email)
        if(!user) throw new Error('user not found')
        
        const userSalt = user.salt
        const userHasedPassword = UserServices.generateHash(userSalt,password);

        if(userHasedPassword !== user.password)
            throw new Error('Invaild password')
        
        const token = JWT.sign(
            {
                id: user.id,
                email: user.email
            },
            JSON_SECRET
        )

        return token
    }
}

export default UserServices