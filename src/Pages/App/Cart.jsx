// Imports
import { useProductContext } from "../../Context/productsContext";
import styles from "./Cart.module.css";
import Loader from "../../Components/Loader/Loader";
import CartItem from "../../Components/Cart Item/CartItem";

// Cart page to show items in the user's cart
export default function CartPage() {
    // Consuming product context here.
    const { cartLoading, cartItems, total, handleOrder } = useProductContext();

    // Returning JSX
    return (
        <>
            {cartLoading ? (
                <Loader />
            ) : (
                cartItems.length === 0 ? (
                    <>
                    <h1 className={styles.noItemsHeading}>No items in the cart!</h1>  
                    </>
                ) : (
                    <>
                        {/* Total Price */}
                        <div className={styles.cartTotalContainer}>
                            {/* Display total price or other relevant information */}
                            <div className={styles.wrapper}>
                                <p className={styles.heading}>{`TotalPrice:- ₹${total}/-`}</p>
                                <button className={styles.purchaseButton} onClick={handleOrder}>Purchase</button>
                            </div>
                        </div>

                        {/* Cart Products List */}
                        <div className={styles.cartItemsContainer}>
                            {cartItems.map((item) => (
                                <CartItem 
                                    key={item.id} 
                                    cartItemId={item.id} 
                                    title={item.product.title} 
                                    price={item.product.price} 
                                    image={item.product.image}
                                    qty={item.qty}
                                />
                            ))}
                        </div>
                    </>
                )
            )}
        </>
    );
}
