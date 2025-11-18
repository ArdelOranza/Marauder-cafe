
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CartItemType, MenuItemType } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  cartItems: CartItemType[];
  addToCart: (item: MenuItemType, quantity?: number) => void;
  addMultipleToCart: (items: CartItemType[]) => void;
  removeFromCart: (itemName: string) => void;
  updateQuantity: (itemName: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
    children: ReactNode;
}

const getInitialCart = (): CartItemType[] => {
    try {
        const item = window.localStorage.getItem('marauders-cart');
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error("Could not parse cart from localStorage", error);
        return [];
    }
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>(getInitialCart);
  const { addToast } = useToast();

  useEffect(() => {
      try {
          window.localStorage.setItem('marauders-cart', JSON.stringify(cartItems));
      } catch (error) {
          console.error("Could not save cart to localStorage", error);
      }
  }, [cartItems]);

  const addToCart = (item: MenuItemType, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.name === item.name);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.name === item.name ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
        );
      }
      return [...prevItems, { ...item, quantity }];
    });
    addToast(`${quantity}x ${item.name} added to order.`, 'success');
  };

  const addMultipleToCart = (items: CartItemType[]) => {
      setCartItems(prevItems => {
          const newItems = [...prevItems];
          items.forEach(itemToAdd => {
              const existingItemIndex = newItems.findIndex(cartItem => cartItem.name === itemToAdd.name);
              if (existingItemIndex > -1) {
                  newItems[existingItemIndex].quantity += itemToAdd.quantity;
              } else {
                  newItems.push(itemToAdd);
              }
          });
          return newItems;
      });
      addToast('Previous order added to your order.', 'success');
  };

  const removeFromCart = (itemName: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.name !== itemName));
  };

  const updateQuantity = (itemName: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemName);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.name === itemName ? { ...item, quantity } : item
        )
      );
    }
  };
    
  const clearCart = () => {
      setCartItems([]);
  }

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    addMultipleToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};