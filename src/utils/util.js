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

function getTimeStamp() {
  const myStamp = new Date()
  return `${myStamp.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2})}:${myStamp.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2})}:${myStamp.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2})}.${myStamp.getMilliseconds().toLocaleString('en-US', {minimumIntegerDigits: 3})}`
}

module.exports = {getAbsolutePath, getFiles, getTimeStamp}
