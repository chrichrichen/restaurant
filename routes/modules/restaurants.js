const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({extended:true}))


router.get('/new',(req,res)=>{
  return res.render('new')
})

router.post('/',(req,res)=>{
  const name = req.body.name
  return Restaurant.create(req.body)
  .then(()=>res.redirect('/'))
  .catch(error=>console.log(error))
})

router.get('/:id', (req, res) => {
  const id = req.params.id
   return Restaurant.findById(id)
  .lean()
  .then((restaurant)=> res.render('show', {restaurant}))
  .catch(error=>console.log(error))
})

router.get('/:id/edit',(req,res)=>{
  const id = req.params.id
  return Restaurant.findById(id)
  .lean()
  .then((restaurant)=>res.render('edit',{restaurant}))
  .catch(error=>console.log(error))
})

router.put('/:id',(req,res)=>{
  const id = req.params.id
  const name = req.body.name
  return Restaurant.findById(id)
  .then(restaurant =>{
    restaurant.name = name
    return restaurant.save()
  })
  .then(()=> res.redirect(`/restaurants/${id}`))
  .catch(error=>console.log(error))
})


router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurants, keyword })
})

router.delete('/:id',(req,res)=>{
  const id = req.params.id
  return Restaurant.findById(id)
  .then(restaurant => restaurant.remove())
  .then(()=>res.redirect('/'))
  .catch(error=>console.log(error))
})

module.exports = router