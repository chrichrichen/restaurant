const bcrypt = require("bcryptjs");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const Restaurant = require("../restaurant");
const User = require("../user");
const restaurantData = require("../../restaurant.json").results;
const db = require("../../config/mongoose");
const SEED_USERS = [
  {
    name: "user1",
    email: "user1@example.com",
    password: "12345678",
    restaurantIndex: [0, 1, 2],
  },
  {
    name: "user2",
    email: "user2@example.com",
    password: "12345678",
    restaurantIndex: [3, 4, 5],
  },
];

db.once("open", () => {
  return Promise.all(
    SEED_USERS.map((user) => {
      const { restaurantIndex } = user;
      return bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(user.password, salt))
        .then((hash) =>
          User.create({
            name: user.name,
            email: user.email,
            password: hash,
          })
        )
        .then((user) => {
          const restaurants = restaurantIndex.map((index) => {
            const restaurant = restaurantData[index];
            restaurant.userId = user._id;
            return restaurant;
          });
          return Restaurant.create(restaurants);
        })
        .catch((error) => console.log(error));
    })
  )
    .then(() => {
      console.log("done");
      process.exit();
    })
    .catch((error) => console.log(error));
});
