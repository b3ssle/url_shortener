const express = require("express")
const exphbs = require("express-handlebars")
require("./config/mongoose")

const URL = require("./models/URL")

const app = express()
const port = 3000

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.render("index")
})

app.post("/", (req, res) => {
  let url = req.body.url
  let short = random()

  URL.findOne({ originalURL: req.body.url })
    .then(data => {
      if (data) {
        return data
      } else {
        return URL.create({ shortURL: short, originalURL: url})
      }
    })
    .then(data =>
      res.render("results", {
        originalURL: req.headers.origin,
        shortURL: data.shortURL,
      })
    )
    .catch(error => console.error(error))
})

app.listen(port, () => {
  console.log(`Express app listening on port ${port}.`)
})

const random = (length = 5) => {
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let str = ''
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return str
}