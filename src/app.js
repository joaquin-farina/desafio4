import express from "express";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080
app.listen(PORT, () => {
    console.log(`escuchando en el puerto ${PORT}`)
})