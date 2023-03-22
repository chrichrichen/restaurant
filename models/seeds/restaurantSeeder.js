const bcrypt = require("bcryptjs");
const Restaurant = require("../restaurant");
const User = require("../user");
const restaurantList = require("./restaurant.json").results;
const userList = require("./user.json").results;
const db = require("../../config/mongoose");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

db.once("open", () => {
  return Promise.all(
    userList.map((userData, userIndex) => {
      return bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(userData.password, salt))
        .then((hash) =>
          User.create({
            name: userData.name,
            email: userData.email,
            password: hash,
          })
        )
        .then((user) => {
          return Promise.all(
            // userIndex 0,1
            // restaurantData.id 012,345
            Array.from(restaurantList, (restaurantData) => {
              const restaurantIndex = restaurantData.id - 1;           
              if (
                restaurantIndex >= 3 * userIndex &&
                restaurantIndex < 3 * (userIndex + 1)                
              ) {
                restaurantData.userId = user._id;
                console.log(userIndex);
                console.log(restaurantIndex);
                return Restaurant.create(restaurantData);                
              }else if (restaurantIndex >= 6 && userIndex < 1) {
                restaurantData.userId = user._id;
                console.log(userIndex);
                console.log(restaurantIndex);
                return Restaurant.create(restaurantData);
              }        
            })
          );
        })
        .catch((err) => console.log(err));
    })
  )
    .then(() => {
      console.log("Done!");
      process.exit();
    })
    .catch((err) => console.log(err));
});