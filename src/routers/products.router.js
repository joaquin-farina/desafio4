import { Router } from "express";
import productos from "../ProductManager.js";

const productsRouter = Router();

let products = [
]

productsRouter.get('/', (req, res) => {
    const productsLimit = req.query.limit
    if (productsLimit < productos.getProducts().length + 1) {
        const productsNumber = productos.getProducts().slice(0, productsLimit);
        res.status(201).send({
            status: 'ok',
            message: 'Productos disponibles',
            productsNumber
        })
    }

    if (productsLimit > productos.getProducts().length){
        res.status(400).send({
            status: 'error',
            message: `El número de productos elegido es mayor al stock, actualmente la cantidad es de "${productos.getProducts().length}"`,
        })
    }

    res.status(200).send({
        status: 'succes',
        productos
    })
});

productsRouter.get('/:pid', (req, res) => {
    const { pid } = req.params
    const newProduct = productos.getProducts().find(prod => prod.id === Number(pid))
    if (!newProduct) {
        res.status(400).send({
            status: 'error',
            message: `El ID número ${pid} no existe en el catálogo de productos`
        })
    }
    res.status(200).send({
        status: 'success',
        newProduct
    })
})

productsRouter.post('/', (req, res) => {
    const product = req.body;

    if (product.title) {

        if (product.id) {
            res.status(400).send({
                status: 'error',
                message: `El ID del producto "${product.title}" debe ser generado de forma automática`
            })
        }

        if (!product.description || !product.code || !product.price || !product.stock || !product.category)
            res.status(400).send({
                status: 'error',
                message: `El producto "${product.title}" que está intentando agregar contiene algún campo vacío`
            })

        const newProductCode = products.find(prod => prod.code === product.code);
        if (newProductCode)
            res.status(400).send({
                status: 'error',
                message: `El código "${product.code}" del producto "${product.title}" que está intentando agregar ya existe, no se puede agregar dos productos con un mismo código`
            })

        productos.getProducts().push(product);
        product.status = true;
        product.id = productos. getProducts().length + 1;
        res.status(201).send({
            status: "success",
            message: `El producto de nombre "${product.title}" ha sido agregado de forma exitosa`,
            productos
        })
    }

    res.status(400).send({
        status: "error",
        message: 'El producto que esta intentando agregar no tiene nombre, no puede agregar un producto que no tenga nombre'
    })
})

productsRouter.put('/:pid', (req, res) => {
    const { pid } = req.params
    const { title, description, code, price, status, stock, category, thumbnail } = req.body

    
    const productIndex = productos.getProducts().findIndex(prod => prod.id === Number(pid));

    
    if (productIndex === -1) {
        return res.status(404).send({
            status: 'error',
            message: `El producto con ID "${pid}" no se encuentra en el catálogo`,
        });
    }

    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail) {
        res.status(400).send('Todos los campos del producto, excepto el ID, son requeridos')
    }
    
    productos.getProducts()[productIndex] = { id: Number(pid), title, description, code, price, status, stock, category, thumbnail };
    console.log(products)

    res.status(200).send({
        status: 'succes',
        message: `El producto ha sido actualizado`,
        products
    })
})

productsRouter.delete('/:pid',async (req, res) => {
    const { pid } = req.params
    const deleteProduct = productos.getProducts().filter(prod => prod.id !== Number(pid))

    try {
        res.status(200).send({
            status: 'succes',
            message: `El producto de ID "${pid}" ha sido eliminado`,
            deleteProduct
        })
        
    } catch (error) {
        
    }
})

export default productsRouter