const fs = require('fs')
const path = require('path')
const {
  quicktype,
  InputData,
  jsonInputForTargetLanguage
} = require("quicktype-core");

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
  })

  return arrayOfFiles
}

function unflatten(data) {
  if (Object(data) !== data || Array.isArray(data))
    return data;
  let regex = /\.?([^.\[\]]+)|\[(\d+)/g,
    resultholder = {};
  for (var p in data) {
    var cur = resultholder,
      prop = "",
      m;
    while (m = regex.exec(p)) {
      cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
      prop = m[2] || m[1];
    }
    cur[prop] = data[p];
  }
  return resultholder[""] || resultholder;
}

async function quicktypeJSON(targetLanguage, typeName, jsonString) {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage);
  await jsonInput.addSource({
    name: typeName,
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  return await quicktype({
    inputData,
    lang: targetLanguage,
  });
}

const json = (() => {
  const publicPath = 'public/assets'
  const assetsPath = path.resolve(publicPath)
  const paths = getAllFiles(assetsPath).map(e => e.slice(assetsPath.length + 1))
  const transformed = paths.reduce((acc, val) => {
    const array = val.split('\\')
    const file = array.pop()
    const path = array.join('.')
    const fileName = file.split('.')[0]
    const assetPublicPath = `assets/${val}`.replace(/\\/g, '/')

    if (isNaN(fileName)) {
      acc[`${path}.${fileName}`] = assetPublicPath
    } else {
      if (!acc[path]) acc[path] = []
      acc[path] = [...acc[path], assetPublicPath].sort((a,b) => {
        const firstNumber = a.split('/').pop().split('.')[0]
        const secondNumber = b.split('/').pop().split('.')[0]
        return Number(firstNumber) - Number(secondNumber)
      })
    }

    return acc
  }, {})
  return JSON.stringify({
    entries: paths.length,
    assets: unflatten(transformed)
  }, null, 2)
})()


class AssetsMap {
  apply(compiler) {
    compiler.hooks.make.tapAsync('AssetsMapPlugin', async (compilation, callback) => {
      compilation.assets['static/assetsMap.json'] = {
        source() { return json }
      }
      const { lines } = await quicktypeJSON(
        "ts",
        "AssetsMap",
        json
      );
      compilation.assets['static/development/assetsMapTypes.d.ts'] = {
        source() { return lines.join('\n') }
      }
      callback()
    })
  }
}

module.exports = AssetsMap