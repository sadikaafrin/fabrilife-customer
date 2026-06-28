import { createContext, useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";

const WishlistContext = createContext();

export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  // ✅ Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlistData")) || [];
    setWishlist(savedWishlist);
  }, []);

  // ✅ Save wishlist & update count whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlistData", JSON.stringify(wishlist));
    setWishlistCount(wishlist.length);
  }, [wishlist]);

  // ✅ Add to Wishlist
  const addToWishlist = (product) => {
    let { id, img: image, title: name, selling_price: price } = product;
    let size = product.size || "";

    const exists = wishlist.some((p) => p.id === id && p.size === size);

    if (exists) {
      Swal.fire({
        icon: "info",
        title: "Already in Wishlist",
        text: `${name} is already in your wishlist.`,
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    const newWishlist = [...wishlist, { id, image, name, price, size }];
    setWishlist(newWishlist);

    Swal.fire({
      icon: "success",
      title: "Added to Wishlist",
      text: `${name} has been added to your wishlist.`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // ✅ Remove from Wishlist
  const removeFromWishlist = (id, size = "default") => {
    const updated = wishlist.filter(
      (item) => !(item.id === id && item.size === size)
    );
    setWishlist(updated);
  };

  // ✅ Clear Wishlist
  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem("wishlistData");
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}