import "dotenv/config"
import express from "express"
import mysql from "mysql2"
import {v4 as uuidv4} from "uuid"

const PORT = process.env.PORT
const app = express()
//dados para o formato JSON
app.use(express.json())
//conexão com o banco de dados
const conn = mysql.createConnection({
    host:process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD, 
    database:process.env.MYSQL_DATABASE,
    port:process.env.MYSQL_PORT
})


app.get('/livros', (request, response)=>{
    const sql = /*sql*/ `SELECT * FROM livros`
    conn.query(sql, (err, data)=>{
        if (err) {
            console.error(err)
            response.status(500).json({err:"Erro ao buscar livro"})
            return
        }
        const livros = data
        response.status(200).json(livros)
    })
})

app.post('/livros', (request, response)=>{
    const {titulo, autor, ano_publiacao, genero, preco} = request.body

    if (!titulo) {
        response.status(400).json({err:"O titulo é obrigatório"})
        return
    }
    if (!autor) {
        response.status(400).json({err:"O autor é obrigatório"})
        return
    }
    if (!ano_publiacao) {
        response.status(400).json({err:"O ano é obrigatório"})
        return
    }
    if (!genero) {
        response.status(400).json({err:"O genero é obrigatório"})
        return
    }
    if (!preco) {
        response.status(400).json({err:"O preço é obrigatório"})
        return
    }

    //verificacao do livro
    const checkSql = /*sql*/ `SELECT * FROM livros WHERE titulo = "${titulo}" AND autor = "${autor}" AND ano_publiacao = "${ano_publiacao}"`;
    conn.query(checkSql, (err, data)=>{
        if (err) {
            console.error(err)
            response.status(500).json({err:"Erro ao buscar livro"})
            return
        }
        if (data.length > 0) {
            response.status(400).json({err: "Livro cadastrado"})
            return
        }

            //Cadastrar o livro
            const id = uuidv4()
            const disponibilidade = 1
            const insertSql = /*sql*/ `INSERT INTO livros (livro_id, titulo, autor, ano_publiacao, 
            genero, preco, disponibilidade) VALUES ("${id}", "${titulo}", "${autor}", 
            "${ano_publiacao}", "${genero}", "${preco}", "${disponibilidade}")`;

            conn.query(insertSql, (err)=>{
                if (err) {
            console.error(err)
            response.status(500).json({err:"Erro ao cadastrar"})
            return
            }
        response.status(201).json({message:"cadastro concluído!"})
        })
    })
})
//listar 1
app.get("/livros/:id", (request, response)=> {
    const {id} = request.params
    const sql = /*sql*/ `select * from livros where
    livro_id = ${id}`
    conn.query(sql, (err, data)=>{
        if (err) {
            console.error(err)
            response.status(500).json({err:"Erro ao buscar"})
            return
            }
        if (data.length === 0) {
            response.status(404).json({err: "Livro não encontrado"})
            return
        }
        const livro = data[0]
        response.status(200).json(livro)
    })
})

//atualizar
app.put("/livros/:id", (request, response)=> {
    const {id} = request.params
    const {titulo, autor, ano_publiacao, genero, preco, disponibilidade} = request.body

    if (!titulo) {
        response.status(400).json({err:"O titulo é obrigatório"})
        return
    }
    if (!autor) {
        response.status(400).json({err:"O autor é obrigatório"})
        return
    }
    if (!ano_publiacao) {
        response.status(400).json({err:"O ano é obrigatório"})
        return
    }
    if (!genero) {
        response.status(400).json({err:"O genero é obrigatório"})
        return
    }
    if (!preco) {
        response.status(400).json({err:"O preço é obrigatório"})
        return
    }

    const sql = /*sql*/ `select * from livros where
    livros_id = ${id}`
    conn.query(sql, (err, data)=>{
        if (err) {
            console.error(err)
            response.status(500).json({err:"Erro ao buscar"})
            return
            }
        if (data.length === 0) {
            response.status(404).json({err: "Livro não encontrado"})
            return
        }
        const uppdateSql = /*sql*/ `UPDATE livros SET titulo = "${titulo}", autor = "${autor}",
        ano_publiacao = "${ano_publiacao}", genero = "${genero}", preco = "${preco}",
         disponibilidade = "${disponibilidade}" WHERE livros_id = "${id}"`

         conn.query(uppdateSql, (err, result, field)=>{
            if (err) {
                console.error(err)
                response.status(500).json({err:"Erro ao atualizar livro"})
                return
                }
                response.status(200).json({err:"livro atualizado"})
         })
    })
})

//delete
app.delete("/livros/:id", (request, response)=> {})

conn.connect((err)=>{
    if (err) {
        console.error(err)
    }
    app.listen(PORT, ()=>{
       console.log("Servidor ligado PORT " + PORT)
    })
    
})