const fs = require('fs-extra');
const path = require('path');

const source = path.join(__dirname, 'src', 'views');
const destination = path.join(__dirname, 'dist', 'views');

fs.copy(source, destination)
  .then(() => console.log('Carpeta de vistas copiada exitosamente.'))
  .catch(err => {
    console.error('Error al copiar la carpeta de vistas:', err);
    process.exit(1);
  });
