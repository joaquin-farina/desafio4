import { Router } from "express";
import carts from "../CartsManager.js";

const cartsRouter = Router();

cartsRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params
    try {
        const cartId = await carts.getCartById(Number(cid))
        
        if (cartId.length !== 0){
            res.status(200).send({
                status: "succes",
                cartId
            })
        }
        
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: 'El carrito solicitado no existe o está vacío'
        })
        
    }

})

cartsRouter.post('/', async (req, res) => {
    try {    
        const newCarts = await carts.createCart()
        console.log(newCarts)
        res.status(201).send({
            status: "success",
            message: 'El producto se ha agregado al carrito',
            newCarts
        })
        
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Error al agregar el producto al carrito',
            error: error.message
        })        
    }

})

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const cartId = await carts.addProductToCart(Number(cid), Number(pid))

    try {
            res.status(200).send({
                status: "succes",
                message: 'Producto agregado al carrito con éxito',
                payload: await cartId,
                
            })
        
    } catch (error) {
        res.status(404).send({
            status: 'error',
            mesagge: 'El carrito está vacio',
            carts
        })
        
    }

})

export default cartsRouter