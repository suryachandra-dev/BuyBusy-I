// Imports
import { useProductContext } from "../../Context/productsContext"
import ProductsCard from "../Product Card/ProductCard"
import styles from "./ProductsList.module.css"

// Page for the Prdouct's List
export default function ProductsList(){
    // Fetching context here.
    const {products, isFiltered, filteredProducts} = useProductContext();

    // Returning Jsx
    return(
        <div className={styles.productListConatiner}>
        {isFiltered ? filteredProducts.map((product) => (
            <ProductsCard  
                key={product.id}
                id={product.id} 
                title={product.title}
                description={product.description} 
                price={product.price} 
                category={product.category} 
                image={product.image}
            />
            )) : products.map((product) => (
            <ProductsCard  
                key={product.id}
                id={product.id} 
                title={product.title}
                description={product.description} 
                price={product.price} 
                category={product.category} 
                image={product.image}
            />
            
        ))}
        </div>
    )
}