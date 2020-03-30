// usei o express pra criar e configurar meu servidor
const express = require('express')
const server = express()

const db = require("./db")

//  Configurar arquivos estaticos
server.use(express.static("public"))

// Habilitar uso do req.body
server.use(express.urlencoded({ extended: true }))

// Config do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server,
    noCache: true,
})

//Rotas da aplicação
server.get("/", function(req, res) {

    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados! 😨")
        }

        const reversedIdeas = [...rows].reverse()

        let lastIdeas = []
        for (idea of reversedIdeas) {
            if (lastIdeas.length < 2) {
                lastIdeas.push(idea)
            }
        }

        return res.render("index.html", { ideas: lastIdeas })
    })

})

server.post("/", function(req, res) {
    // Inserindo na tabela
    const query = `
    INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link
    ) VALUES (?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link
    ]

    db.run(query, values, function(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados! 😨")
        }

        return res.redirect("/ideias")
    })
})

server.get("/ideias", function(req, res) {
    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados! 😨")
        }

        const reversedIdeas = [...rows].reverse()

        return res.render("ideias.html", { ideas: reversedIdeas })
    })
})

// liguei meu servidor na porta 3333
server.listen(3333, () => {
    console.log("Server rodando")
})