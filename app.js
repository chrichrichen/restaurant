const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
// 引用 body-parser
const bodyParser = require('body-parser')
const methodOverride = require("method-override");
const flash = require("connect-flash"); 

// 引用路由器
const routes = require('./routes')
const usePassport = require("./config/passport");

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require("./config/mongoose"); // need to below line 10

const app = express();
const port = process.env.PORT;

app.engine("hbs", exphbs({ defaultLayout: "main", extname: '.hbs' }));
app.set("view engine", "hbs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);


app.use(express.static("public"));

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride("_method"));

usePassport(app);

app.use(flash());

app.use((req, res, next) => {
  // 你可以在這裡 console.log(req.user) 等資訊來觀察
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash("success_msg"); // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash("warning_msg"); // 設定 warning_msg 訊息
  next();
});

// 將 request 導入路由器
app.use(routes)

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});