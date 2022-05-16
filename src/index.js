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

//Middleware
//Next define se o middleware vai executar ou vai parar 
function verifyIfExistsAccount(request, response, next) {
    const { cpf } = request.headers;

    const customer = customers.find((customers) => customers.cpf === cpf);

    if (!customer) {
        return response.status.apply(400).json({
            "error": "Customer not found"
        })
    }

    request.customer = customer;

    return next();
}


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

});


app.get("/statement", verifyIfExistsAccount, (request, response) => {
    app.use(express.json());
    const { customer } = request;
    return response.json(customer.statement);
})

// app.use(verifyIfExistsAccount);