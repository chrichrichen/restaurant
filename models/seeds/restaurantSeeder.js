const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantList = require("../../restaurant.json").results

const db = require('../../config/mongoose')

db.once('open',()=>{
  console.log('mongoose connected!')


Restaurant.create(restaurantList)
.then(()=>{
  console.log("restaurantSeeder connected!")
  db.close()
})
.catch(error => console.log(error))
})