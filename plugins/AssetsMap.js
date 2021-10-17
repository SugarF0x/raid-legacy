const fs = require('fs')
const path = require('path')

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

class AssetsMap {
  apply(compiler) {
    compiler.hooks.make.tapAsync('AssetsMapPlugin', (compilation, callback) => {
      compilation.assets['static/assetsMap.json'] = {
        source() {
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
        }
      }
      callback()
    })
  }
}

module.exports = AssetsMap