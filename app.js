const express = require('express')
const routes = require('./routes')
const app = express()
const port = 4000
const Restaurant = require('./models/restaurant')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const restaurantList = require('./restaurant.json')

require('./config/mongoose')


app.use(bodyParser.urlencoded({extended:true}))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(routes)







app.listen(port, () => {
  console.log(`creating restaurant project http://localhost:${port}`)
})