const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/fiapbooks', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const usuarioSchema = new mongoose.Schema({
    nome: { type: String },
    email: { type: String, required: true },
    senha: { type: String },
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

app.post("/cadastrarUsuario", async (req, res) => {
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;

    if (!email || !senha || !nome) {
        return res.status(400).json({ error: "Preencher todos os campos" });
    }

    const emailExiste = await Usuario.findOne({ email: email });
    if (emailExiste) {
        return res.status(400).json({ error: "O e-mail cadastrado já existe!!!" });
    }

    const usuario = new Usuario({
        nome: nome,
        email: email,
        senha: senha,
    });

    try {
        const newUsuario = await usuario.save();
        res.json({ error: null, msg: "Cadastro ok", usuarioId: newUsuario._id });
    } catch (error) {
        res.status(400).json({ error });
    }
});

app.get("/cadastrarUsuario", async (req, res) => {
    res.sendFile(__dirname + "/cadastro.html");
});

const produtoSchema = new mongoose.Schema({
    codigo: { type: String, required: true },
    descricao: { type: String },
    fornecedor: { type: String },
    data_impressao: { type: Date },
    quantidade_estoque: { type: Number },
});

const Produto = mongoose.model('Produto', produtoSchema);

app.post("/cadastrarProduto", async (req, res) => {
    const codigo = req.body.codigo;
    const descricao = req.body.descricao;
    const fornecedor = req.body.fornecedor;
    const data_impressao = req.body.data_impressao;
    const quantidade_estoque = req.body.quantidade_estoque;

    if (!codigo || !descricao || !fornecedor || !data_impressao || !quantidade_estoque) {
        return res.status(400).json({ error: "Preencher todos os campos" });
    }

    const codigoExiste = await Produto.findOne({ codigo: codigo });
    if (codigoExiste) {
        return res.status(400).json({ error: "O produto já existe!!!" });
    }

    const produto = new Produto({
        codigo: codigo,
        descricao: descricao,
        fornecedor: fornecedor,
        data_impressao: data_impressao,
        quantidade_estoque: quantidade_estoque,
    });

    try {
        const newProduto = await produto.save();
        res.json({ error: null, msg: "Cadastro ok", produto: newProduto });
    } catch (error) {
        res.status(400).json({ error });
    }
});

app.get("/cadastrarProduto", async (req, res) => {
    res.sendFile(__dirname + "/cad-livros.html");
});

app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
