import fs from 'fs';

class ProductsManager {
    constructor(filePath = 'productos.json') {
        this.products = [];
        this.path = filePath;
        this.loadFromFile(this.path);
    }

    getProducts() {
        return this.products;
    }

    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock || !product.status || !product.category)
            return `Todos los campos del artículo con nombre "${product.title}" deben contener datos`

        const newProduct = this.products.find(prod => prod.code === product.code);
        if (newProduct) {
            console.log(`El código del artículo con nombre "${product.title}" no puede estar repetido`);
            return "No es posible cargar más de un producto con el mismo código"
        }

        product.id = this.products.length + 1
        this.products.push(product);
        console.log(`Se agregó el artículo con nombre "${product.title}" al carrito`)

        this.saveToFile()

        return `${product.title} agregado`
    }

    getProductById(pid) {
        const otroProducto = this.products.find(prod => prod.id === pid)
        if (!otroProducto)
            return `El articulo seleccionado con ID "${pid}" no existe`

        return otroProducto
    }

    updateProduct(pid, updatedFields) {
        const productIndex = this.products.findIndex(prod => prod.id === pid);
        if (productIndex === -1) {
            throw new Error(`El artículo con ID "${pid}" no existe`);
        }

        
        if (!Object.keys(updatedFields).length) {
            throw new Error(`Debe proporcionar al menos un campo para actualizar`);
        }

        
        this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };

        this.saveToFile()

        return `El artículo con ID "${pid}" ha sido actualizado`;
    }

    deleteProduct(pid) {
        const eliminarProducto = this.products.filter(prod => prod.id !== pid)
        if (eliminarProducto) {
            console.log(`Se eliminó el artículo con ID "${pid}" del carrito`)
            this.products = eliminarProducto
            this.saveToFile()
            return this.products
        }
    }

    async saveToFile() {
        const data = JSON.stringify(this.products, null, 2);
        await fs.promises.writeFile(this.path, data, 'utf8')
            .then(() => {
                console.log('Datos guardados en el archivo:', this.path);
            })
            .catch((error) => {
                console.error('Error al guardar datos en el archivo:', error);
            });
    }

    loadFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
            console.log(`Datos cargados desde el archivo: "${this.path}"`);
        } catch (error) {
            console.error('Error al cargar datos desde el archivo:', `El archivo "${this.path}" no está bien definido o no existe`);
            
            this.products = [];
        }
    }
}


const productos = new ProductsManager();

const producto1 = { title: "producto 1", description: "", price: 1590, thumbnail: "Sin imagen", code: "abc123", stock: 25, status: true, category: "products" }

const producto2 = { title: "producto 2", description: "", price: 2560, thumbnail: "Sin imagen", code: "abc1234", stock: 188,status: true, category: "products" }

const producto3 = { title: "producto 3", description: "", price: 400, thumbnail: "Sin imagen", code: "abc12345", stock: 20, status: true, category: "products" }

const producto4 = { title: "producto 4", description: "", price: 800, thumbnail: "Sin imagen", code: "abc123456", stock: 100, status: true, category: "products" }

const producto5 = { title: "producto 5", description: "", price: 500, thumbnail: "Sin imagen", code: "abc1234567", stock: 100, status: true, category: "products" }

const producto6 = { title: "producto 6", description: "", price: 5600, thumbnail: "Sin imagen", code: "abc12345678", stock: 100, status: true, category: "products" }

const producto7 = { title: "producto 7", description: "", price: 3200, thumbnail: "Sin imagen", code: "abc1234568", stock: 100, status: true, category: "products" }

const producto8 = { title: "producto 8", description: "", price: 20, thumbnail: "Sin imagen", code: "abc1234569", stock: 100, status: true, category: "products" }

const producto9 = { title: "producto 9", description: "", price: 70, thumbnail: "Sin imagen", code: "abc12345689", stock: 100, status: true, category: "products" }

const producto10 = { title: "producto 10", description: "", price: 890, thumbnail: "Sin imagen", code: "abc12345679", stock: 100, status: true, category: "products" }


export default productos