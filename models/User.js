const mongoose = require("mongoose")

// 地址:端口/数据库
mongoose.connect("mongodb://localhost:27017/express-auth", {
  useNewUrlParser: true,
  useCreateIndex: true
})

const UserSchema = new mongoose.Schema({
  // 字段名 数据类型 唯一键
  username: { type: String, unique: true },
  password: {
    type: String,
    set(val) {
      return require('bcrypt').hashSync(val,10)
    }
  }
})

const User = mongoose.model("User", UserSchema)

// User.db.dropCollection("users")

module.exports = { User }