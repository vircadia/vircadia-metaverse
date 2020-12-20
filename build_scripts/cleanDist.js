const fs = require('fs').promises;

const directory = './dist';

fs.rmdir(directory, { recursive: true })
  .then(() => console.log('Dist folder cleared!'));
  