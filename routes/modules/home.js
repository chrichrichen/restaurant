const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant.find({userId})
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

router.get('/search', (req, res) => {
  console.log(req.query.keyword)

  const keyword = req.query.keyword.trim().toLowerCase()

  Restaurant.find({})
    .lean()
    .then(restaurants => {
      const filterRestaurantsData = restaurants.filter(
        data =>
          data.name.toLowerCase().includes(keyword) ||
          data.category.includes(keyword)
      )
      res.render('index', {
        restaurants: filterRestaurantsData,
        keyword
      })
    })
    .catch(error => console.log(error))
})

module.exports = router
