const express = require("express")
const { User } = require("./models/User")
const jwt = require("jsonwebtoken")
const SECRET = "ASFASFAFWEW112142"

const app = express()

app.use(express.json()) // 接收客户端的json数据


app.get("/api", async (req, res) => {

  res.send("ok")
})

// 获取所有用户
app.get("/api/users", async (req, res) => {
  const users = await User.find()

  res.send(users)
})

// 注册 
app.post("/api/register", async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password
  })
  res.send(user)
})


// 登陆
app.post("/api/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username })
  if (!user) {
    return res.status(422).send({ msg: "用户不存在" })
  }

  const isPasswordValid = await require("bcrypt").compareSync(
    req.body.password,
    user.password
  )
  if (!isPasswordValid) {
    return res.status(422).send({ msg: "密码无效" })
  }

  // 生成token
  const token = jwt.sign({
    id: String(user._id)
  }, SECRET)
  res.send({
    user,
    token: `Bearer ${token}`
  })
})

// 复用验证的中间件
const auth = async(req, res, next)=>{
  const tokenData = String(req.headers.authorization).split(" ").pop()
  const raw = jwt.verify(tokenData, SECRET)

  // console.log(raw)
  req.user = await User.findById(raw.id) // 存放在req中
  next()
}

// 获取个人信息
app.get("/api/profile", auth, async (req, res) => {

  res.send(req.user)
})

app.listen(3001, () => {
  console.log("http://localhost:3001")
})
