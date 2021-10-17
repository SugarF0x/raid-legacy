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
    allPropertiesOptional: true,
    lang: targetLanguage,
  });
}

const json = (() => {
  const assetsPath = path.resolve('public/assets')
  const paths = getAllFiles(assetsPath).map(e => e.slice(assetsPath.length + 1))
  const transformed = paths.reduce((acc, val) => {
    const array = val.split('\\')
    const file = array.pop()
    const path = array.join('.')
    if (!acc[path]) acc[path] = []
    acc[path] = [...acc[path], file]
    if (!isNaN(acc[path][0].split('.')[0])) {
      acc[path] = acc[path].sort((a,b) => Number(a.split('.')[0]) - Number(b.split('.')[0]))
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