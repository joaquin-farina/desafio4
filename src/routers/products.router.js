import { Router } from "express";
import ProductsManager from "../ProductManager.js";

const productos = new ProductsManager();

const productsRouter = Router();

let products = [
]

productsRouter.get('/', async (req, res) => {
    try {
        const productsLimit = req.query.limit
        if (productsLimit < productos.getProducts().length + 1) {
            const productsNumber = await productos.getProducts().slice(0, productsLimit);
            res.status(201).send({
                status: 'ok',
                message: 'Listado de productos solicitados',
                productsNumber
            })
        }

        if (productsLimit > productos.getProducts().length) {
            res.status(400).send({
                status: 'error',
                message: `El número de productos solicitados excede el máximo número de productos existente en catálogo, actualmente la cantidad es de "${productos.getProducts().length}"`,
            })
        }

        res.status(200).send({
            status: 'succes',
            productos
        })
    } catch (error) {
        return error
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const newProduct = await productos.getProducts().find(prod => prod.id === Number(pid))
        if (!newProduct) {
            res.status(400).send({
                status: 'error',
                message: `El ID número ${pid} no existe en el catálogo de productos`
            })
        }
        res.status(200).send({
            status: 'succes',
            newProduct
        })
    } catch (error) {
        return error
    }
})

productsRouter.post('/', async (req, res) => {
    try {
        const product = req.body;

        if (!product.title) {
            return res.status(400).send({
                status: "error",
                message: 'El producto que esta intentando agregar no tiene nombre, no puede agregar un producto que no tenga nombre'
            });
        }

        if (product.id) {
            return res.status(400).send({
                status: 'error',
                message: `El ID del producto "${product.title}" debe ser generado de forma automática`
            })
        }

        if (!product.description || !product.code || !product.price || !product.stock || !product.category) {
            return res.status(400).send({
                status: 'error',
                message: `El producto "${product.title}" que está intentando agregar contiene algún campo vacío`
            });
        }

        const newProductCode = await products.find(prod => prod.code === product.code);
        if (newProductCode) {
            return res.status(400).send({
                status: 'error',
                message: `El código "${product.code}" del producto "${product.title}" que está intentando agregar ya existe, no se puede agregar dos productos con un mismo código`
            });
        }

        product.status = true;
        product.id = productos.getProducts().length + 1;

        const result = await productos.addProduct(product);

        console.log('Enviando respuesta:', {
            status: "success",
            message: result,
            productos: productos.getProducts(),
        });

        res.status(201).send({
            status: "success",
            message: result,
            productos: productos.getProducts(),
        });
    } catch (error) {
        console.error('Error al agregar producto', error)
        res.status(500).send({
            status: 'error',
            message: 'Error interno al agregar producto'
        })
        
    }
})

productsRouter.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const { title, description, code, price, status, stock, category, thumbnail } = req.body

        
        const productIndex = await productos.getProducts().findIndex(prod => prod.id === Number(pid));

        
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

        res.status(200).send({
            status: 'succes',
            message: `El producto ha sido actualizado`,
            products: productos
        })
    } catch (error) {
        return error
    }
})

productsRouter.delete('/:pid', async (req, res) => {
    const { pid } = req.params
    
    try {
        const deleteProduct = await productos.deleteProduct(Number(pid));
        const existeDeleteProduct = Array.isArray(deleteProduct);

        if (!existeDeleteProduct) {
            return res.status(400).send({
                status: 'Error',
                message: `El producto con ID "${pid}" no existe dentro del catálogo`,
                deleteProduct
            })
        }

        return res.status(200).send({
            status: 'succes',
            message: `El producto de ID "${pid}" ha sido eliminado`,
            deleteProduct
        })

    } catch (error) {
        console.error('Error al intentar eliminar el producto:', error);
        res.status(500).send({
            status: error,
            message: 'Error interno al intentar eliminar el producto'
        });
    }
})

export default productsRouter