const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/restaurant");

// 新增餐廳頁面
router.get("/new", (req, res) => {
  return res.render("new");
});

// 提交新增
router.post("/", (req, res) => {
  const userId = req.user._id;
  const {
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  } = req.body; 
  Restaurant.create({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
    userId,
  })
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

// 瀏覽詳細頁
router.get("/:id", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id;  
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render("show", { restaurant }))
    .catch((error) => console.log(error));
});

// 編輯頁面
router.get("/:id/edit", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id; 
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render("edit", { restaurant }))
    .catch((error) => console.log(error));
});

// 提交編輯
router.put("/:id", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id; 
  return Restaurant.findOne({ _id, userId })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch((error) => console.log(error));
});

// 刪除餐廳
router.delete("/:id", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id; 
  return Restaurant.findOne({ _id, userId })
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

module.exports = router;
