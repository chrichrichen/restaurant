const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')


router.get('/', (req, res) => {
  Restaurant.find()
  .lean()
  .sort({_id:'asc'})
  .then(restaurants => res.render(`index`, {restaurants}))
  .catch(error=>console.error(error))
})

router.get("/search", (req, res) => {
 
  const keywords = req.query.keywords
  const keyword = req.query.keywords.trim().toLowerCase()

  Restaurant.find({})
    .lean()
    .then(restaurants => {
      const filterRestaurantsData = restaurants.filter(
        data =>
          data.name.toLowerCase().includes(keyword) ||
          data.category.includes(keyword)
      )
      res.render("index", {
        filterRestaurantsData,
        keywords,
      })
    })
    .catch(err => console.log(err))
})


module.exports = router