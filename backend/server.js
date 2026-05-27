const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

// middlewaare para entender json util con postman 
app.use(express.json());

// express sirve todos los files de public
app.use(express.static(path.join(__dirname, 'public')));

// inicia server
app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});