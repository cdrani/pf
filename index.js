#!/usr/bin/env node

const fs = require('fs')

const fields = process.argv.slice(2)
const filePath = `./package.json`

const checkFile = async () =>
  new Promise((resolve, reject) => {
    fs.access(filePath, fs.F_OK, err => {
      if (err) {
        reject(false)
      }
      resolve(true)
    })
  })

const readJsonFile = async () =>
  new Promise((resolve, reject) => {
    const fileExists = checkFile()
    if (fileExists) {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject('package.json can not be read.')
        }

        const jsonData = JSON.parse(data)
        resolve(jsonData)
      })
    }
  })

const prettyLog = data => {
  console.log(JSON.stringify(data, null, 2))
}

const getFields = async () => {
  const results = {}
  const data = await readJsonFile()
  if (fields.length) {
    fields.forEach(field => {
      if (data[field]) {
        results[field] = data[field]
      }
    })
    return prettyLog(results)
  } else {
    const { name, version, description } = data
    return prettyLog({ name, version, description })
  }
}

getFields()
