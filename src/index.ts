import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import {prisma} from './lib/db'

const port = process.env.PORT || 8000
const app = express()

app.use(express.json())

async function init() {
    
    const server = new ApolloServer({
        typeDefs: `
           type Query {
               hello: String
               say(name: String): String
           }
           
           type Mutation {
               createUser(firstName: String!,lastName: String!,email: String!,password: String!): Boolean
           }
        `,
        resolvers: {
            Query: {
               hello: () => `Hello i am graphQl server`,
               say: (_,{name}: {name: string}) => `helllo i am ${name}`
            },

            Mutation: {
                createUser: async(_,
                    {firstName,
                    lastName,
                    email,
                    password}: 
                    {firstName:string;
                     lastName:string; 
                     email:string;
                     password:string}) => {
                    
                    await prisma.user.create({
                        data: {
                            email,
                            password,
                            firstName,
                            lastName,
                            salt: "random-salt"
                        }
                    })

                   return true;
                }
            },
        },
    })

    await server.start()

    app.use('/graphql' , expressMiddleware(server))
}

init()

app.get('/' , (req,res) =>{
    res.json({message: "App is working"})
})

app.listen(port , ()=>{
    console.log(`server is running at port ${port}`)
})