const express = require('express')
const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const routes = require('./routes')
require('./config/mongoose')
const PORT = process.env.PORT || 3000
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(routes)

app.listen(PORT, () => {
  console.log(`creating restaurant project http://localhost:${PORT}`)
})
