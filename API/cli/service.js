const fs = require("fs")
const path = require("path")
const service = process.argv[process.argv.length-1]

const controllerPath = path.join("./controller",`${service}.controller.js`)
const routePath = path.join("./routes",`${service}.routes.js`)

fs.writeFileSync(controllerPath, "")
fs.writeFileSync(routePath, "")

// not linked anywhere if you want to use this link this package.json file
// "script":{"service":"node ./cli/services.js"}

