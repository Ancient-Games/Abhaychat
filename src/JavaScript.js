
async function init(){
 
 const webName = window.location.protocol+"//"+window.location.hostname+":"+window.location.port
 
 document.querySelector('#volume').key = 'volume_up'
 document.querySelector('#video').key = 'videocam'

 const info = await fetch(webName+"/data", {
  method: "POST"
 })
 const data = await info.json()
 
 navigator.getUserMedia({
  video: true,
  audio: false
 }, (stream) => {
  document.querySelector("#uVideo").srcObject = stream
 }, (err) => {
  console.log(err)
 })
 
 navigator.getUserMedia({
  video: true,
  audio: true
 }, (stream) => {
  window.uStream = stream
 }, (err) => {
  console.log(err)
 })
 
 const socket = io.connect(webName)
 const peer = new Peer()
 
 peer.on("open", (id) => {
  socket.emit((data.callBy ? "callBy" : "callTo"), {peerId: id})
 })
 
 socket.on("connect_error", (e) => {
  console.log(e)
 })
 
 socket.on("canCallTo", (data) => {
  const call = peer.call(data.peerId, window.uStream)
  call.on("stream", (e) => {
   document.querySelector("#fVideo").srcObject = e
  })
 })
 
 peer.on("call", (call) => {
  call.answer(window.uStream)
  call.on("stream", (e) => {
   document.querySelector("#fVideo").srcObject = e
  })
 })
 
}

init()

function volume(){
 if(document.querySelector('#volume').key === 'volume_up'){
  document.querySelector('#volume').innerHTML = 'volume_off'
  document.querySelector('#volume').key = 'volume_off'
  window.uStream.removeTrack(window.uStream.getAudioTracks()[0])
 }else{
  document.querySelector('#volume').innerHTML = 'volume_up'
  document.querySelector('#volume').key = 'volume_up'
  navigator.getUserMedia({
   audio: true,
   video: (document.querySelector('#video').key === "videocam" ? true : false)
  }, (newStream) => {
   window.uStream.addTrack(newStream.getAudioTracks()[0])
  }, (err) => console.log(err))
 }
}

function video(){
 if(document.querySelector('#video').key === 'videocam'){
  document.querySelector('#video').innerHTML = 'videocam_off'
  document.querySelector('#video').key = 'videocam_off'
  window.uStream.removeTrack(window.uStream.getVideoTracks()[0])
 }else{
  document.querySelector('#video').innerHTML = 'videocam'
  document.querySelector('#video').key = 'videocam'
  
  navigator.getUserMedia({
   audio: (document.querySelector('#volume').key === "volume_up" ? true : false),
   video: true
  }, (newStream) => {
   window.uStream.addTrack(newStream.getVideoTracks()[0])
  }, (err) => console.log(err))
  
 }
}
