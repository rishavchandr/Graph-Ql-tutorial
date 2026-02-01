import express from "express";
import { expressMiddleware } from '@as-integrations/express5';
import createApolloGraphQlServer from './graphQl/index'

const port = process.env.PORT || 8000
const app = express()
app.use(express.json())

async function init() {
    const graphqlServer = await createApolloGraphQlServer()
    app.use('/graphql' , expressMiddleware(graphqlServer))
}

init()



app.get('/' , (req,res) =>{
    res.json({message: "App is working"})
})

app.listen(port , ()=>{
    console.log(`server is running at port ${port}`)
})