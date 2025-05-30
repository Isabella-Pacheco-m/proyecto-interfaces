import express from 'express'; // etsmos usando express para crear el servidor web
import path from 'path'; // para el manejo de rutas de archivos
import { fileURLToPath } from 'url'; // para obtener URL en ES modules


// Este archivo es el servidor web que sirve los archivos estáticos de la aplicación, se configura
// usando Node.js y Express 

// Para ES modules -> obtener __dirname
const __filename = fileURLToPath(import.meta.url); // Convertir la URL del módulo a una ruta de archivo
const __dirname = path.dirname(__filename); // Obtener el directorio del archivo actual

const app = express(); // Crear una instancia de Express
const PORT = process.env.PORT || 3000; // Definir el puerto en el que se ejecutará el servidor

// Middleware básico
app.use(express.json()); // Para parsear el cuerpo de las solicitudes JSON

const distPath = path.join(__dirname, '../../dist'); // Ruta al directorio 'dist' donde se encuentran los archivos estáticos

app.use(express.static(distPath)); // Servir archivos estáticos desde el directorio 'dist'


app.get('/', (req, res) => { // Ruta raíz que sirve el archivo index.html
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath);
});


app.get('*', (req, res) => { // Ruta comodín para manejar todas las demás solicitudes
  if (req.path.includes('.')) {
    res.status(404).send('404'); // Si la solicitud incluye un punto (.), se asume que es un archivo y se devuelve 404
    return;
  }
  
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, () => { // Iniciar el servidor en el puerto especificado
  console.log(`El server node está ejecutándose en http://localhost:${PORT}`); // Mensaje de confirmación al iniciar el servidor
  console.log(`Sirviendo los archivos desde: ${distPath}`);
});