import fs from 'fs';
import path from 'path';

const filePath = 'productos.json';


class ProductsManager {
    constructor(filePath = 'productos.json') {
        this.products = [];
        this.path = path.resolve(filePath);
        this.loadFromFile(this.path);
    }

    async readFile() {
        try {
            const dataProducts = await fs.promises.readFile(this.path, 'utf-8')
            console.log(dataProducts);
            return JSON.parse(dataProducts)
        } catch (error) {
            return []
        }
    }

    getProducts() {
        return this.products;
    }

    async addProduct(product) {
        try {
            console.log('Iniciando operación AddProduct: ', product)
            if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock || !product.status || !product.category){
                console.log(`Todos los campos del artículo con nombre "${product.title}" deben contener datos`);
                return `Todos los campos del artículo con nombre "${product.title}" deben contener datos`
            }
    
            const newProduct = await this.products.find(prod => prod.code === product.code);
            if (newProduct) {
                console.log(`El código del artículo con nombre "${product.title}" no puede estar repetido`);
                return "No es posible cargar más de un producto con el mismo código"
            }
    
            product.id = this.products.length + 1
            this.products.push(product);
            console.log(`Se agregó el artículo con nombre "${product.title}" al arreglo`);
    
            await this.saveToFile();
    
            return `${product.title} agregado`            
        } catch (error) {
            console.error('Error en addProduct:', error);
            return error
        }
    }

    async getProductById(pid) {
        try {
            const otroProducto = await this.products.find(prod => prod.id === pid)
            if (!otroProducto)
                return `El articulo seleccionado con ID "${pid}" no existe`
    
            return otroProducto            
        } catch (error) {
            return error
        }
    }

    async updateProduct(pid, updatedFields) {
        try {
            const productIndex = this.products.findIndex(prod => prod.id === pid);
            if (productIndex === -1) {
                throw new Error(`El artículo con ID "${pid}" no existe`);
            }
    
            
            if (!Object.keys(updatedFields).length) {
                throw new Error(`Debe proporcionar al menos un campo para actualizar`);
            }
    
           
            this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
    
            await this.saveToFile()
    
            return `El artículo con ID "${pid}" ha sido actualizado`;            
        } catch (error) {
            return error;
        }
    }

    async deleteProduct(pid) {
        try {
            const eliminarProducto = this.products.filter(prod => prod.id !== pid)
            
            if (eliminarProducto.length === this.products.length ){
                return `El producto cuyo ID es "${pid}" no existe, no se puede eliminar un producto que no existe`
            }
            if (eliminarProducto) {
                console.log(`Se eliminó el artículo con ID "${pid}" del arreglo`)
                this.products = eliminarProducto
                await this.saveToFile()
                return this.products
            }
            
            
        } catch (error) {
            return error
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

export default ProductsManager