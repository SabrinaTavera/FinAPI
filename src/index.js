const { request } = require("express");
const { response } = require("express");
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

    console.log(customer)
    if (!customer) {
        return response.status(400).json({
            "error": "Customer not found"
        })
    }

    request.customer = customer;

    return next();
}

function getBalance(statement) {
    const balnace = statement.reduce((acc, operation) => {
        if (operation.type === 'credit') {
            return acc + operation.amount;
        } else {
            return acc - operation.amount;
        }
    }, 0)

    return balnace;
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


app.post("/deposit", verifyIfExistsAccount, (request, response) => {
    const { description, amount } = request.body;

    const { customer } = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation);

    return response.status(201).send();
})

app.post("/withdraw", verifyIfExistsAccount, (request, response) => {

    const { amount } = request.body;
    const { customer } = request;

    const balance = getBalance(customer.statement);

    if (balance < amount) {
        return response.status(400).json({
            error: "Insuficient funds!"
        })
    }

    const statementOperation = {

        amount,
        created_at: new Date(),
        type: "debit"
    };

    customer.statement.push(statementOperation);

    return response.status(201).send();

})

app.get("/statement/date", verifyIfExistsAccount, (request, response) => {


    const { customer } = request;
    const { date } = request.query;


    const dateFormat = new Date(date + " 00:00");

    const statement = customer.statement.filter((statement) => statement.created_at.toDateString() === new Date(dateFormat).toDateString())

    console.log("valor do consele " + statement)

    return response.json(statement);
})


app.put("/account", verifyIfExistsAccount, (request, response) => {
    const { name } = request.body;
    const { customer } = request;

    customer.name = name;

    return response.status(201).send()


})

app.get("/account", verifyIfExistsAccount, (request, response) => {
    const { customer } = request;

    console.log(customer)
    return response.json(customer)
})

app.delete("/account", verifyIfExistsAccount, (request, response) => {
    const { customer } = request;

    console.log(request)
        //splice
    customers.splice(customer, 1)

    return response.status(200).json(customers)
})




// app.use(verifyIfExistsAccount);