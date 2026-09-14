import { useCallback, useMemo, useState } from "react";
import CartContext from "@/context/CartContext";
import {
  addDish,
  clearCart,
  loadCart,
  removeDish,
  saveCart,
  setCartQuantity,
} from "@/lib/cart";

function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);

  const addItem = useCallback((dish) => {
    setCart((current) => saveCart(addDish(current, dish)));
  }, []);

  const updateQuantity = useCallback((dishId, quantity) => {
    setCart((current) => saveCart(setCartQuantity(current, dishId, quantity)));
  }, []);

  const removeItem = useCallback((dishId) => {
    setCart((current) => saveCart(removeDish(current, dishId)));
  }, []);

  const clear = useCallback(() => {
    setCart(saveCart(clearCart()));
  }, []);

  const value = useMemo(
    () => ({ cart, addItem, updateQuantity, removeItem, clear }),
    [cart, addItem, updateQuantity, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;