
const express = require("express")
const app = express()
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")
const { firestore } = require("./firebase")
const { collection, getDoc, doc } = require("firebase/firestore")
const path = require("path")

app.use(cors())
app.use(express.static(__dirname+"/src"))
app.set("view engine", "ejs")
app.set("views", __dirname+"/src")
const server = http.createServer(app)

const io = new Server(server, {
 cors: {
  origin: "*",
  methods: ["GET", "POST"]
 }
})

const options = {
 root: path.join(__dirname)
}

var userId

const callBy = {
 peerId: null
}

const callTo = {
 peerId: null
}

io.on("connection", (socket) => {
 
 socket.on("callBy", (data) => {
  callBy.peerId = data.peerId
  console.log("callBy")
  if(callTo.peerId !== null){
   socket.broadcast.emit("canCallTo", {...callBy})
  }
 })
 
 socket.on("callTo", (data) => {
  callTo.peerId = data.peerId
  console.log("callTo")
  if(callBy.peerId !== null){
   socket.broadcast.emit("canCallTo", {...callTo})
  }
 })
 
 socket.on("disconnect", () => {
  
 })
})

app.get("/", (req, res) => {
 res.send("Sorry no id found.")
})

app.get("/:id", (req, res) => {
 const id = req.params.id
 userId = id
 getDoc(doc(firestore, `Users/${id}`))
 .then((response) => {
  if(response.data().call === true){
   res.render("./calls.ejs", {id})
  }else{
   res.render("./404.ejs")
  }
 })
 .catch(err => res.render("./404.ejs"))
 
})

app.post("/data", async (req, response) => {
 await getDoc(doc(firestore, `Users/${userId}`))
 .then(async (res) => {
  if(res.id === res.data().callBy){
   await getDoc(doc(firestore, `Users/${res.data().callTo}`))
   .then(async (ress) => {
    response.send({
     callBy: true,
     user: {
      id: res.id,
      ...res.data()
     },
     friend: {
      id: ress.id,
      ...ress.data()
     }
    })
   })
   .catch(err => console.log(err))
  }else{
   await getDoc(doc(firestore, `Users/${res.data().callBy}`))
   .then((ress) => {
    response.send({
     callBy: false,
     user: {
      id: res.id,
      ...res.data()
     },
     friend: {
      id: ress.id,
      ...ress.data()
     }
    })
   })
   .catch(err => console.log(err))
  }
 })
 .catch(err => console.log(err))
})

server.listen(process.env.PORT || 3000, () => {
 console.log("server started.")
})
