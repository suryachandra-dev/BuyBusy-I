// Imports
import styles from "./CartItem.module.css";
import { useProductContext } from "../../Context/productsContext";

// Functional component for the ProductCard of cart item
export default function ProductsCard({cartItemId, title, price, image, qty}){
    // Consuming product context here
    const {handleRemoveFromCart, handleDecreaseQty, handleIncreaseQty} = useProductContext();

    // Returning JSX
    return(
        <div className={styles.productCardContainer}>
            <div className={styles.imageContainer}>
            <img src={image} alt={title} className={styles.productImage}/>
            </div>
            <div className={styles.productTitleContainer}>
            <p className={styles.productTitle}>{title}</p>
            </div>
            <div className={styles.priceAndQtyContainer}>
            <p className={styles.productPrice}>{`₹ ${price}`}</p> 
            <span className={styles.qtyContainer}>
                <img 
                    onClick={() => handleDecreaseQty(cartItemId)}
                    src="https://cdn-icons-png.flaticon.com/128/3388/3388913.png"
                    alt="Remove"
                />
                <p>{qty}</p>
                <img 
                    onClick={() => handleIncreaseQty(cartItemId)} 
                    src="https://cdn-icons-png.flaticon.com/128/1828/1828919.png" 
                    alt="Add"
                />
            </span>
            </div>
            <button className={styles.removeFromCartBtn}
                onClick={() => handleRemoveFromCart(cartItemId)}>
                Remove From Cart
                </button>
        </div>
    )
}