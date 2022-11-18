const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const restaurantList = require('../../restaurant.json').results
const Restaurant = require('../restaurant')
const User = require('../user')

const SEED_USER = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
    restaurantIndex: [0, 1, 2]
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678',
    restaurantIndex: [3, 4, 5]
  }
]

db.once('open', () => {
  return Promise.all(
    SEED_USER.map((user) => {
      const { name, email, password, restaurantIndex } = user
      return User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      }).then((user) => {
        const restaurants = restaurantIndex.map((index) => {
          const restaurant = restaurantList[index]
          restaurant.userId = user._id
          return restaurant
        })
        return Restaurant.create(restaurants)
      })
    })
  )
    .then(() => {
      console.log(' seeder created successfully')
      process.exit()
    })
    .catch((error) => console.log(error))
})