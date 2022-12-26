const fs = require('fs');

// tsconfig.json 添加路径别名
const addTsConfigPathAlias = (filePath) => {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      throw err;
    }
    // parse JSON object
    const config = JSON.parse(data.toString());
  
    // 添加路径别名
    config.compilerOptions.paths = {
      "@/*": ["./src/*"],
    };
  
    fs.writeFile(filePath, JSON.stringify(config, '', '\t'), (err) => {
      if (err) throw err;
      console.log('添加路径别名');
    });
  });
}


module.exports = {
  addTsConfigPathAlias,
}