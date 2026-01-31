import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

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
        `,
        resolvers: {
            Query: {
               hello: () => `Hello i am graphQl server`,
               say: (_,{name}: {name: string}) => `helllo i am ${name}`
            }
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