import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewsRouter from "./routers/views.router.js"
import { Server } from "socket.io";

const app = express();
const PORT = 8080
const httpServer = app.listen(PORT, () => {
    console.log(`escuchando en el puerto ${PORT}`)
})


const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));
app.use('/', viewsRouter);


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado")

    socket.on('message', data => {
        console.log(data);
    })

    
})


