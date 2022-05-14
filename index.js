const express = require('express')

/**
 * cpf          => string 
 * nome         => string 
 * id           => uuid (Ele gera um número, usamos uma biblioteca "uuid")
 * statement    => []
 */

app.post("/account", (request, response) => {
    const { cpf, nome } = request.body;
})


app.listem(3333);