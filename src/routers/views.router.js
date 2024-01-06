import express from "express";
import ProductsManager from "../ProductManager.js";


const router = express.Router();
const products = new ProductsManager()


router.get('/', (req, res) => {
    res.render('home', {
        productos: products.products,
        style: 'index.css'
    });
})

router.get('/realtimeproducts', (req, res) => {
    
    res.render('realTimeProducts', {
        productos: products.products,
        style: 'index.css'

    })

})

export default router;