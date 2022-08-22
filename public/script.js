const socket = io('/');         //to root path
const videoGrid = document.getElementById('video-grid');
const peers = {}

const __peer = new Peer(undefined, {
    host: '/',
    port: '3001'
})

const myVideo = document.createElement('video');
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)
    __peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })
    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})

function connectToNewUser(userId, stream) {
    const call = __peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      video.remove()
    })

    peers[userId] = call
}

__peer.on('open', userId=>{
    socket.emit('join-room', ROOM_ID, userId);
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
})

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
}