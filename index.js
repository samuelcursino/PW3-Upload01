// Importação do express, multer e fs
const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
app.use(express.json());

// ----- CONFIGURAÇÕES DO MULTER -----
//STORAGE
const storage = multer.diskStorage(
    {                         //cb = callback
        destination:(req, file, cb)=>{
            cb(null, './uploads')
        },
        filename:(req, file, cb)=>{
            cb(null, Date.now().toString() + '_' + file.originalname)
        }
    }
);

//FILTER
const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb (null, true);
    } else {
        cb(null, false);
    }
}

//UPLOAD
/*
storage
limits o quanto de bytes que vc vai subir
flterfiles
*/
const upload = multer(
    {
        storage:storage,
        limits:{
            fileSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
    }
);

//ROTA POST DE UPLOAD
app.post ('/upload', upload.array('imagem', 3), (req, res)=>{
    console.log(req.files);
    console.log(req.body.nome);
    console.log(req.body.email);
    res.send('upload efetuado com sucesso!');
});

app.delete('/delete/:imagem', (req, res)=>{

    let {imagem} = req.params;
    let caminho = './uploads/' + imagem;

    fs.unlink(caminho, (error)=>{
        if(error){
            res.send('erro ao excluir a imagem!')
            console.log('error: ' + error)
        } else {
            res.send('imagem excluída com sucesso')
        }
    })
})

//Criando servidor de requisições
app.listen(3000, ()=>{
    console.log('servidor rodando em http://localhost:3000')
});
