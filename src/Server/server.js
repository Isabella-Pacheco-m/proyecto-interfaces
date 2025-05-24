import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Para ES modules -> obtener __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(express.json());

const distPath = path.join(__dirname, '../../dist');

app.use(express.static(distPath));


app.get('/', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath);
});


app.get('*', (req, res) => {
  if (req.path.includes('.')) {
    res.status(404).send('404');
    return;
  }
  
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`El server node está ejecutándose en http://localhost:${PORT}`);
  console.log(`Sirviendo los archivos desde: ${distPath}`);
});