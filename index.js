const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const path = require('path');
const uri = require('./mongodb.js');
const PORT = 80; // Escolha a porta que desejar
const jwt = require('jsonwebtoken');
const axios = require('axios');
const app = express();
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase.json'); // Substitua pelo caminho correto do seu arquivo de configuração

app.use(cors());

const Empresa = ['marloscardoso', 'pizzaria'];
for (let i = 0; i < Empresa.length; i++) {
    const empresas = Empresa[i]
}





async function main() {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
        // Conectar ao servidor MongoDB
        await client.connect();
        console.log('Conexão estabelecida com o servidor MongoDB');

        // Selecionar o banco de dados
        const db = client.db();

        // Faça algo com o banco de dados aqui, se desejar

        // Iniciar o servidor Express após a conexão com o banco de dados
        app.listen(PORT, () => {
            console.log(`Servidor iniciado na porta ${PORT}`);
        });
    } catch (err) {
        console.error('Erro ao conectar ao servidor MongoDB', err);
    }
}

main().catch(console.error);

const publicPath = path.join(__dirname, './admin');
app.use(express.static(publicPath));

// Rotas do Express
app.get('/admin', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Rotas do Express
app.get('/home', (req, res) => {
    res.sendFile(path.join(publicPath, 'home.html'));
});

// Rotas do Express

app.use(express.json());

function generateToken(user) {
    return jwt.sign({ username: user.username }, 'GeniusLeap', { expiresIn: '1h' });
}




app.post('/api/marloscardoso/loginadmin', async(req, res) => {
    try {
        const { username, password } = req.body;

        // Conectar ao servidor MongoDB
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();


        // Selecionar o banco de dados
        const db = client.db('usuarios');

        // Verificar se o usuário existe na coleção de usuários
        const user = await db.collection("admin").findOne({ username, password });

        // Fechar a conexão com o MongoDB
        await client.close();
        // Gerar o token de autenticação

        if (user) {
            const tken = generateToken(user);
            const token = tken
            saveData(token);
            res.status(200).json({ token });
        } else {
            res.status(401).json({ message: 'Credenciais inválidas. Tente novamente.' });
        }
    } catch (err) {
        console.error('Erro ao processar a solicitação', err);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});
app.post('/api/marloscardoso/loginusuario', async(req, res) => {
    try {
        const { username, password } = req.body;

        // Conectar ao servidor MongoDB
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();


        // Selecionar o banco de dados
        const db = client.db('MarlosCardoso');

        // Verificar se o usuário existe na coleção de usuários
        const user = await db.collection("Clientes").findOne({ username, password });

        // Fechar a conexão com o MongoDB
        await client.close();
        // Gerar o token de autenticação

        if (user) {
            const tken = generateToken(user);
            const token = tken
            const cpf = user.cpf
            saveData(token, username, password);
            res.status(200).json({ message: 'Logado.', token, cpf });
        } else {
            res.status(401).json({ message: 'Credenciais inválidas. Tente novamente.' });
        }
    } catch (err) {
        console.error('Erro ao processar a solicitação', err);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

async function saveData(token, username, password) {

    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const database = client.db("MarlosCardoso");
    const collection = database.collection("Token");

    const newData = { usertoken: token, username: username, password: password };
    const result = await collection.insertOne(newData);

    console.log('Token Salvo', result.insertedId);

    client.close();
}



app.post('/api/marloscardoso/token', async(req, res) => {
    try {
        const { token } = req.body;

        // Conectar ao servidor MongoDB
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();


        // Selecionar o banco de dados
        const db = client.db('MarlosCardoso');

        // Verificar se o usuário existe na coleção de usuários
        const user = await db.collection("Token").findOne({ usertoken: token });

        // Fechar a conexão com o MongoDB
        await client.close();
        // Gerar o token de autenticação

        if (user) {

            res.status(200).json({ message: 'Token Valido' });
        } else {
            res.status(401).json({ message: 'Token Invalido' });
        }
    } catch (err) {
        console.error('Erro ao processar a solicitação', err);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});



// Endpoint para receber os dados do formulário
app.post('/api/marloscardoso/addproduto', async(req, res) => {
    try {
        const formData = req.body; // Dados enviados pelo cliente

        // Conectar ao MongoDB
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();

        // Selecionar o banco de dados
        const db = client.db('MarlosCardoso');

        // Salvar os dados no MongoDB (coleção Produtos)
        await db.collection('Produtos').insertOne(formData);

        // Fechar a conexão com o MongoDB
        await client.close();

        // Responder ao cliente com sucesso
        res.status(200).json({ message: 'Produto Cadastrado' });
    } catch (err) {
        console.error('Erro ao salvar os dados no MongoDB', err);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});
// Endpoint para receber os dados do formulário
app.post('/api/marloscardoso/pedidos', async(req, res) => {
    try {
        const formData = req.body; // Dados enviados pelo cliente

        // Conectar ao MongoDB
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();

        // Selecionar o banco de dados
        const db = client.db('MarlosCardoso');

        // Salvar os dados no MongoDB (coleção Produtos)
        await db.collection('Pedidos').insertOne(formData);

        // Fechar a conexão com o MongoDB
        await client.close();

        // Responder ao cliente com sucesso
        res.status(200).json({ message: 'Produto Cadastrado' });
    } catch (err) {
        console.error('Erro ao salvar os dados no MongoDB', err);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});
// Endpoint para receber os dados do formulário
app.post('/api/marloscardoso/addpedidos', async(req, res) => {
    try {
        const formData = req.body; // Dados enviados pelo cliente

        // Conectar ao MongoDB
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();

        // Selecionar o banco de dados
        const db = client.db('MarlosCardoso');

        // Salvar os dados no MongoDB (coleção Produtos)
        await db.collection('Pedidos').insertOne(formData);

        // Fechar a conexão com o MongoDB
        await client.close();

        // Responder ao cliente com sucesso
        res.status(200).json({ message: 'Pedido Cadastrado' });
    } catch (err) {
        console.error('Erro ao salvar os dados no MongoDB', err);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});
app.post('/api/marloscardoso/alterarclientes', async(req, res) => {
    try {
        const Dados = req.body; // Dados enviados pelo cliente

        // Verificar se o ID do cliente é uma string válida
        if (!ObjectId.isValid(Dados.id)) {
            return res.status(400).json({ message: 'ID do cliente inválido.' });
        }

        // Conectar ao MongoDB
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();

        // Selecionar o banco de dados
        const db = client.db('MarlosCardoso');

        // Verificar se o documento já existe na coleção 'Clientes'
        const existingDocument = await db.collection('Clientes').findOne({ _id: new ObjectId(Dados.id) });

        if (existingDocument) {
            // Atualizar os dados no MongoDB (coleção Clientes)
            await db.collection('Clientes').updateOne({ _id: new ObjectId(Dados.id) }, { $set: Dados });

            // Fechar a conexão com o MongoDB
            await client.close();

            // Responder ao cliente com sucesso
            res.status(200).json({ message: 'Dados Alterados' });
        } else {
            // Caso o documento não exista, responda ao cliente com erro
            res.status(404).json({ message: 'Documento não encontrado.' });
        }
    } catch (err) {
        console.error('Erro ao atualizar os dados no MongoDB', err);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});





app.post('/api/marloscardoso/alterarprodutos', async(req, res) => {
    try {
        const Dados = req.body; // Dados enviados pelo cliente

        // Verificar se o ID do cliente é uma string válida
        if (!ObjectId.isValid(Dados.id)) {
            return res.status(400).json({ message: 'ID  inválido.' });
        }

        // Conectar ao MongoDB
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();

        // Selecionar o banco de dados
        const db = client.db('MarlosCardoso');

        // Verificar se o documento já existe na coleção 'Clientes'
        const existingDocument = await db.collection('Produtos').findOne({ _id: new ObjectId(Dados.id) });

        if (existingDocument) {
            // Atualizar os dados no MongoDB (coleção Clientes)
            await db.collection('Produtos').updateOne({ _id: new ObjectId(Dados.id) }, { $set: Dados });

            // Fechar a conexão com o MongoDB
            await client.close();

            // Responder ao cliente com sucesso
            res.status(200).json({ message: 'Dados Alterados' });
        } else {
            // Caso o documento não exista, responda ao cliente com erro
            res.status(404).json({ message: 'Documento não encontrado.' });
        }
    } catch (err) {
        console.error('Erro ao atualizar os dados no MongoDB', err);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});







// Endpoint para receber os dados do formulário
app.post('/api/marloscardoso/addcategoria', async(req, res) => {
    try {
        const formData = req.body; // Dados enviados pelo cliente

        // Conectar ao MongoDB
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();

        // Selecionar o banco de dados
        const db = client.db('MarlosCardoso');

        // Salvar os dados no MongoDB (coleção Produtos)
        await db.collection('Categorias').insertOne(formData);

        // Fechar a conexão com o MongoDB
        await client.close();

        // Responder ao cliente com sucesso
        res.status(200).json({ message: 'Categoria Cadastrada' });
    } catch (err) {
        console.error('Erro ao salvar os dados no MongoDB', err);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});


app.post('/api/marloscardoso/cadastrocliente', async(req, res) => {
    try {
        const formData = req.body; // Dados enviados pelo cliente

        // Conectar ao MongoDB
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();

        // Selecionar o banco de dados
        const db = client.db('MarlosCardoso');

        // Verificar se o usuário existe na coleção de usuários
        const { username } = formData;
        const usuarioExistente = await db.collection("Clientes").findOne({ username });

        if (usuarioExistente) {
            res.status(401).json({ message: 'Usuário/Email Indisponível!' });
        } else {
            // Salvar os dados no MongoDB (coleção Clientes)
            await db.collection('Clientes').insertOne(formData);


            res.status(200).json({ message: 'Cadastrado' });
        }

        // Fechar a conexão com o MongoDB
        await client.close();
    } catch (err) {
        console.error('Erro ao salvar os dados no MongoDB', err);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'geniusleap-2c33d.appspot.com', // Substitua pelo URL do seu bucket de armazenamento
});

const bucket = admin.storage().bucket();

// Configuração do multer para processar o upload da imagem
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite de 5 MB
    },
});

// Endpoint para receber o upload da imagem
app.post('/api/marloscardoso/imgproduto', upload.single('file'), async(req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'Nenhum arquivo enviado.' });
            return;
        }

        const file = req.file;
        const fileName = `${Date.now()}_${file.originalname}`;
        const fileUpload = bucket.file(fileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        blobStream.on('error', (error) => {
            console.error('Erro ao fazer o upload da imagem:', error);
            res.status(500).json({ error: 'Erro ao enviar a imagem.' });
        });


        blobStream.on('finish', () => {
            // Configuração da URL de download da imagem (expira em 1 hora)
            const config = {
                action: 'read',
                expires: '01-01-3000',
            };
            fileUpload.getSignedUrl(config, (err, url) => {
                if (err) {
                    console.error('Erro ao gerar a URL da imagem:', err);
                    res.status(500).json({ error: 'Erro ao enviar a imagem.' });
                } else {
                    console.log('Imagem enviada com sucesso.' + url);
                    res.status(200).json({ url });
                }
            });
        });

        blobStream.end(file.buffer);
    } catch (error) {
        console.error('Erro ao processar a solicitação:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

app.get('/api/marloscardoso/listprodutos', async(req, res) => {
    try {
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();

        const db = client.db('MarlosCardoso'); // Substitua pelo nome do seu banco de dados

        // Consulta os dados na coleção 'dados' (substitua pelo nome da sua coleção)
        const collection = db.collection('Produtos');
        const dados = await collection.find().toArray();

        await client.close();

        res.json(dados);
    } catch (err) {
        console.error('Erro ao consultar os dados:', err);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

app.get('/api/marloscardoso/listapedidos', async(req, res) => {
    try {
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();

        const db = client.db('MarlosCardoso'); // Substitua pelo nome do seu banco de dados

        // Consulta os dados na coleção 'dados' (substitua pelo nome da sua coleção)
        const collection = db.collection('Pedidos');
        const dados = await collection.find().toArray();

        await client.close();

        res.json(dados);
    } catch (err) {
        console.error('Erro ao consultar os dados:', err);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

app.get('/api/marloscardoso/listapedidosuser', async(req, res) => {
    try {
        const cpf = req.query.cpf; // Recupera o valor do parâmetro "cpf" da requisição
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();

        const db = client.db('MarlosCardoso'); // Substitua pelo nome do seu banco de dados

        // Consulta os dados na coleção 'Pedidos' filtrando pelo CPF
        const collection = db.collection('Pedidos');
        const dados = await collection.find({ cpf: cpf }).toArray();

        await client.close();

        res.json(dados);
    } catch (err) {
        console.error('Erro ao consultar os dados:', err);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

app.get('/api/marloscardoso/listcategorias', async(req, res) => {
    try {
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();

        const db = client.db('MarlosCardoso'); // Substitua pelo nome do seu banco de dados

        // Consulta os dados na coleção 'dados' (substitua pelo nome da sua coleção)
        const collection = db.collection('Categorias');
        const dados = await collection.find().toArray();

        await client.close();

        res.json(dados);
    } catch (err) {
        console.error('Erro ao consultar os dados:', err);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});
app.get('/api/marloscardoso/listclientes', async(req, res) => {
    try {
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();

        const db = client.db('MarlosCardoso'); // Substitua pelo nome do seu banco de dados

        // Consulta os dados na coleção 'dados' (substitua pelo nome da sua coleção)
        const collection = db.collection('Clientes');
        const dados = await collection.find().toArray();

        await client.close();

        res.json(dados);
    } catch (err) {
        console.error('Erro ao consultar os dados:', err);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});
app.delete('/api/marloscardoso/produtos/:id', async(req, res) => {
    try {
        const idDoProdutoParaApagar = req.params.id;

        // Verifica se o ID fornecido é um ObjectId válido do MongoDB
        if (!ObjectId.isValid(idDoProdutoParaApagar)) {
            return res.status(400).json({ message: 'ID inválido.' });
        }
        const client = new MongoClient(uri);

        await client.connect();
        const collection = client.db("MarlosCardoso").collection('Produtos');

        const result = await collection.deleteOne({ _id: new ObjectId(idDoProdutoParaApagar) });

        if (result.deletedCount === 1) {
            return res.json({ message: 'Produto apagado com sucesso.' });
        } else {
            return res.status(404).json({ message: 'Nenhum produto encontrado com o ID fornecido.' });
        }
    } catch (err) {
        console.error('Erro ao apagar produto:', err);
        res.status(500).json({ message: 'Erro ao apagar produto.' });
    } finally {

    }
});

app.delete('/api/marloscardoso/categorias/:id', async(req, res) => {
    try {
        const idDoProdutoParaApagar = req.params.id;

        // Verifica se o ID fornecido é um ObjectId válido do MongoDB
        if (!ObjectId.isValid(idDoProdutoParaApagar)) {
            return res.status(400).json({ message: 'ID inválido.' });
        }
        const client = new MongoClient(uri);

        await client.connect();
        const collection = client.db("MarlosCardoso").collection('Categorias');

        const result = await collection.deleteOne({ _id: new ObjectId(idDoProdutoParaApagar) });

        if (result.deletedCount === 1) {
            return res.json({ message: 'Categoria apagada com sucesso.' });
        } else {
            return res.status(404).json({ message: 'Nenhuma categoria encontrado com o ID fornecido.' });
        }
    } catch (err) {
        console.error('Erro ao apagar produto:', err);
        res.status(500).json({ message: 'Erro ao apagar produto.' });
    } finally {

    }
});

// Endpoint para receber o upload da imagem
app.post('/api/marloscardoso/imgcategoria', upload.single('file'), async(req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'Nenhum arquivo enviado.' });
            return;
        }

        const file = req.file;
        const fileName = `${Date.now()}_${file.originalname}`;
        const fileUpload = bucket.file(fileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        blobStream.on('error', (error) => {
            console.error('Erro ao fazer o upload da imagem:', error);
            res.status(500).json({ error: 'Erro ao enviar a imagem.' });
        });


        blobStream.on('finish', () => {
            // Configuração da URL de download da imagem (expira em 1 hora)
            const config = {
                action: 'read',
                expires: '01-01-3000',
            };
            fileUpload.getSignedUrl(config, (err, url) => {
                if (err) {
                    console.error('Erro ao gerar a URL da imagem:', err);
                    res.status(500).json({ error: 'Erro ao enviar a imagem.' });
                } else {
                    console.log('Imagem enviada com sucesso.' + url);
                    res.status(200).json({ url });
                }
            });
        });

        blobStream.end(file.buffer);
    } catch (error) {
        console.error('Erro ao processar a solicitação:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});



// Endpoint para excluir um usuário
app.delete('/api/marloscardoso/excluirusuario/:id', async(req, res) => {
    try {
        const id = req.params.id; // ID do usuário a ser excluído

        // Verificar se o ID do usuário é uma string válida
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID do usuário inválido.' });
        }

        // Conectar ao MongoDB
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();

        // Selecionar o banco de dados
        const db = client.db('MarlosCardoso');

        // Verificar se o documento existe na coleção 'Usuarios'
        const existingDocument = await db.collection('Clientes').findOne({ _id: new ObjectId(id) });

        if (existingDocument) {
            // Excluir o usuário do MongoDB (coleção Usuarios)
            await db.collection('Clientes').deleteOne({ _id: new ObjectId(id) });

            // Fechar a conexão com o MongoDB
            await client.close();

            // Responder ao cliente com sucesso
            res.status(200).json({ message: 'Usuário excluído com sucesso.' });
        } else {
            // Caso o documento não exista, responda ao cliente com erro
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (err) {
        console.error('Erro ao excluir o usuário no MongoDB', err);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});