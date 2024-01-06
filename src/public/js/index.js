const socket = io();
socket.emit('message', 'Bienvenido a Saga Comics')
socket.on('otro-mensaje', data => {
    console.log(data)
})

