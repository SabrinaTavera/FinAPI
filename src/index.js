const express = require("express");
const { v4: uuidv4 } = require("uuid") // v4 gera um número randomico 

const app = express();
app.listen(3333);
app.use(express.json());

const customers = []
    /**
     * cpf          => string 
     * nome         => string 
     * id           => uuid (Ele gera um número, usamos uma biblioteca "uuid")
     * statement    => []
     */


app.post("/account", (request, response) => {
    const { cpf, name } = request.body;

    const customerAlreadyExists = customers.some(
        (customers) => customers.cpf === cpf
    )

    if (customerAlreadyExists) {
        return response.status(400).json({
            error: "Customer already exists!"
        })
    }

    app.use(express.json());

    //Insere dados dentro do array 
    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: [],
    });

    return response.status(201).send();
})