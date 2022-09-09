const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantList = require("../../restaurant.json").results
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true, useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', ()=>{
  console.log('mongodb error!')
})
db.once('open',()=>{
  console.log('mongoose connected!')


Restaurant.create(restaurantList)
.then(()=>{
  console.log("restaurantSeeder connected!")
  db.close()
})
.catch(error => console.log(error))
})
