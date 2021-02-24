const path = require('path')
const fs = require('fs')

function getAbsolutePath(rawPath) {
  let relativePath = path.join(process.cwd(), ...rawPath.trim().split('/'))
  return relativePath
}

async function getFiles(dir) {
  const dirents = fs.readdirSync(dir, {withFileTypes: true})
  const files = await Promise.all(dirents.map(dirent => {
    const res = path.resolve(dir, dirent.name)
    return dirent.isDirectory() ? getFiles(res) : res
  }))
  return Array.prototype.concat(...files)
}

module.exports = {getAbsolutePath, getFiles}
