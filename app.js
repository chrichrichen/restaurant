const express = require('express')
const app = express()
const port = 4000
const Restaurant = require('./models/restaurant')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const restaurantList = require('./restaurant.json')
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection

db.on('error',()=>{
  console.log('mongodb error!')
})

db.once('open',()=>{
  console.log('mongodb connected!')
})



app.use(bodyParser.urlencoded({extended:true}))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => {
  Restaurant.find()
  .lean()
  .then(restaurants => res.render(`index`, {restaurants}))
  .catch(error=>console.error(error))
})



app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
   return Restaurant.findById(id)
  .lean()
  .then((restaurant)=> res.render('show', {restaurant}))
  .catch(error=>console.log(error))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurants: restaurants, keyword: keyword })
})





app.listen(port, () => {
  console.log(`creating restaurant project http://localhost:${port}`)
})