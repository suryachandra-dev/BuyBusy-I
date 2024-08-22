// Imports
import { useProductContext } from "../../Context/productsContext";
import styles from "./Search.module.css";

// Functional component for the search and filter
export default function Search() {
    // Consuming Product Context
    const {handlePriceChange, handleCategoryChange, selectedPrice} = useProductContext();

    // Returning JSX
    return (
        <div className={styles.searchFilterContainer}>
            <form>
                <div className={styles.filterSection}>
                    <p className={styles.heading}>Filter</p>
                    <div className={styles.priceRange}>
                        {/* Price range slider */}
                        <span>Price: {selectedPrice}</span>
                        <input type="range" min="0" max="100000" onChange={(event) => handlePriceChange(event)} />
                    </div>
                </div>
                <div className={styles.categorySection}>
                    <p className={styles.heading}>Category</p>
                    {/* Category checkboxes */}
                    <label>
                        <input type="checkbox" value="men's clothing" onChange={(event) => handleCategoryChange(event)} />
                        Men's Clothing
                    </label>
                    <label>
                        <input type="checkbox" value="women's clothing" onChange={(event) => handleCategoryChange(event)} />
                        Women's Clothing
                    </label>
                    <label>
                        <input type="checkbox" value="jewelery" onChange={(event) => handleCategoryChange(event)} />
                        Jewelry
                    </label>
                    <label>
                        <input type="checkbox" value="electronics" onChange={(event) => handleCategoryChange(event)} />
                        Electronics
                    </label>
                </div>
            </form>
        </div>
    )
}
