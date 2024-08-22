// Creating products context API here.
// Imports
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../Database/firebaseConfig";
import { toast } from "react-toastify";
import { useUserContext } from "./usersContext";

// Creating Context here
export const productContext = createContext();

// Custom hooks to use product context
export function useProductContext(){
    const value = useContext(productContext);
    return value;
}

// Creating Custom provider component
export function CustomProductContext({ children }){
    // States
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [isFiltered, setIsfiltered] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [selectedPrice, setSelectedPrice] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [productLoading, setProductLoading] = useState(true);
    // Carts
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [cartLoading, setcartLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(true);
    // Consuming user context for fetching user cart items.
    const {signedUser} = useUserContext();

    // Fetching products data here.
    useEffect(() => {
        async function fetchData() {
          try {
            const response = await fetch('https://fakestoreapi.com/products');
            const data = await response.json();
            // Converting the prices in the Dollar to Rupees
            const productsWithINRPrice = data.map(product => ({
              ...product,
              price: Math.round(product.price * 80) // Assuming 1 USD = 74.5 INR
            }));

            // Setting the products state here
            setProducts(productsWithINRPrice);
            setProductLoading(false);
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        }
    
        fetchData();
      }, []);

    // Search and filter
    useEffect(() => {
      // Setting isFiltered state to true
      setIsfiltered(true);
      let filteredProducts = products;
    
      // If both price and categories selected
      if (selectedPrice && selectedCategories.length > 0) {
        filteredProducts = products.filter(
          (product) => product.price <= selectedPrice && selectedCategories.includes(product.category)
        );
      } else if(searchValue){
        filteredProducts = products.filter((product) => product.title.toLowerCase().includes(searchValue));
      } else if (selectedPrice) { 
        filteredProducts = products.filter((product) => product.price <= selectedPrice);
      } else if (selectedCategories.length > 0) {
        filteredProducts = products.filter((product) => selectedCategories.includes(product.category));
      }
      // If price and categories both deselected then setting isFiltered false
      else if(!searchValue && !selectedPrice && selectedCategories.length === 0)
      {
        setIsfiltered(false);
      }
      // Setting the state for filtered products
      setFilteredProducts(filteredProducts);
      // Showing notification
    }, [products, searchValue, selectedPrice, selectedCategories]);

    
    // Function to handle the search name.
    const handleSearchProductByName = (event) => {
      const selectedName = event.target.value.toLowerCase();
      setSearchValue(selectedName)
    }
    

    // Function to handle price range change
      const handlePriceChange = (event) => {
        const selectedValue = parseInt(event.target.value);
        setSelectedPrice(selectedValue);
    };

    // Function to handle category selection
    const handleCategoryChange = (event) => {
      const selectedCategory = event.target.value;
      if(selectedCategories.includes(selectedCategory))
      {
        // Remove the selected category
        const updatedCategories = selectedCategories.filter((category) => category !== selectedCategory);
        setSelectedCategories(updatedCategories);
      }
      else
      {
        setSelectedCategories([...selectedCategories, selectedCategory]);
      }
    };

    // --------------------------------Cart and order features starts from here--------------------------------------------//
          // Getting all products in cart
          useEffect(()=> {
          const fetchData = async() => {
                  if(signedUser)
                  {
                      // Filtering only the user cart items
                      const cartQuery = query(collection(db, "cart"), where('user', '==', signedUser));
                      
                      const unsubscribe = onSnapshot(cartQuery, (snapShot) => { 
                      const cartData = snapShot.docs.map((doc) => ({
                          id: doc.id,
                          ...doc.data()
                      }));
      
                      // Setting data
                      setCartItems(cartData);
                      if(cartItems)
                      {
                        setcartLoading(false);
                      }

                      // Calculating total and setting to total state
                      const totalPrice = cartData.reduce((total, item) => total + item.qty * item.product.price, 0);
                      // Setting state
                      setTotal(totalPrice);
                  });
                // Stop listening to changes
                return () => unsubscribe();
            }
          }
          fetchData();
        }, [signedUser, cartItems]);

        // Handling add to cart function here
        const handleAddToCart = async (product, user) => {
          // Adding to the database
          try {
            // Checking if it's existing item then updating quantity
            const existingItemIndex = cartItems.findIndex((item) => item.product.title === product.title && item.user === user);
            if(existingItemIndex !== -1)
            {
              const existingItem = cartItems[existingItemIndex];
              const updatedQty = existingItem.qty + 1;
              const itemRef = doc(collection(db, "cart"), existingItem.id);
              // Updating imtem quantity in database
              await updateDoc(itemRef, {
                qty: updatedQty
              });
              toast.success("Quantity increased for the item!");
            }
            else
            {
              await addDoc(collection(db, "cart"), {
                user : user,
                product: product,
                qty: 1
            });
            toast.success("Product added to cart successfully!");
            }
          } catch (error) {
              console.log(error);
              toast.error("Something went wrong!");
            }
        }

        // Handle remove an item from cart
        const handleRemoveFromCart = async(cartItemId) => {
          // Removing from database
          try {
            const docRef = doc(collection(db, "cart"), cartItemId);
            await deleteDoc(docRef);
            toast.success("Item removed successufully from cart!");
          } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
          }
        }

        // Handle increase quantity for a product
        const handleIncreaseQty = async(cartItemId) => {
          try {
            const itemRef = doc(collection(db, "cart"), cartItemId);
            // Fetch the current item data
            const itemSnapshot = await getDoc(itemRef);
            const currentItem = itemSnapshot.data();

            // Increment the quantity
            const updatedQty = currentItem.qty + 1;
            
            // Updating item quantity in database
            await updateDoc(itemRef, {
              qty: updatedQty 
            });
            toast.success("Quantity increased for the item!"); 
          } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
          }
        }

        // Handle decrease quantity for a product
        const handleDecreaseQty = async(cartItemId) => {
          try {
            const itemRef = doc(collection(db, "cart"), cartItemId);

            // Current item
            const itemSnapshot = await getDoc(itemRef);
            const currentItem = itemSnapshot.data();
            

            // Decreasing quantity
            const updatedQty = currentItem.qty - 1;

            if(updatedQty > 0)
            {
            // Updating item quantity in the database
            await updateDoc(itemRef, {
              qty: updatedQty
            });
            toast.success("Quantity decreased for the item!");
            }
            else
            {
              handleRemoveFromCart(cartItemId);
            }
          } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
          }
        }

        // Function to create order here
        const handleOrder = async() => {
          try {
            await addDoc(collection(db, "orders"), {
              cartItems: cartItems,
              total: total,
              user: signedUser,
              createdAt: new Date()
            });
            // Remove items from the cart after a successful order
            const cartQuery = query(collection(db, "cart"), where('user', '==', signedUser));
            const cartSnapshot = await getDocs(cartQuery);

            // Delete each item in the cart
            cartSnapshot.forEach(async (doc) => {
              await deleteDoc(doc.ref);
            });
            toast.success("Order created Successfully"); 
          } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
          }
        }


    // Returning Here
    return(
        // Default Provider
        <productContext.Provider value={{ 
              products,
              productLoading, 
              handlePriceChange, 
              handleCategoryChange, 
              selectedPrice, 
              isFiltered, 
              filteredProducts,
              handleSearchProductByName,
              handleAddToCart,
              cartItems,
              cartLoading,
              handleRemoveFromCart,
              total,
              handleDecreaseQty,
              handleIncreaseQty,
              handleOrder,
              orderLoading,
              setOrderLoading
            }}>
            {children}
        </productContext.Provider>
    )
}