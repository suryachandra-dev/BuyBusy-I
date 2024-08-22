// Order's Page
// Imports
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react"
import { db } from "../../Database/firebaseConfig";
import { useUserContext } from "../../Context/usersContext";
import { toast } from "react-toastify";
import OrderTable from "../../Components/Order Table/OrderTable";
import Loader from "../../Components/Loader/Loader";
import { useProductContext } from "../../Context/productsContext";

// Component for the order page
export default function OrderPage(){
    // States
    const [orders, setOrders] = useState([]);

    // Consuming user produuct context here
    const {signedUser} = useUserContext();
    const {orderLoading, setOrderLoading} = useProductContext();

    // Fetching orders
    useEffect(() => {

        // Fetching data
        const fetchData = async() => {
            try {
                const orderQuery = query(collection(db, "orders"), where("user", "==", signedUser));
                const unsubscribe = onSnapshot(orderQuery, (snapShot) => {
                    const orderData = snapShot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    // Setting orders state
                    setOrders(orderData);
                    setOrderLoading(false);
                    // toast.success("You Orders!");

                    return () => unsubscribe();
                })
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong!");
            }
        }

        fetchData();
    }, [signedUser, setOrderLoading]);

    // Returning JSX
    return(
        <>
        {orderLoading ? <Loader/> : (
        <>
        <h1 style={{margin:"2rem", textAlign:"center", color:" #7064E5"}}>{orders.length === 0 ? "You have no orders still!" : "Your Orders"}</h1>
        {orders.length > 0 && orders.map((order, i) => (
            <OrderTable key={i} order={order}/>
        ))}
        </>
        )}
        </>
    )
}