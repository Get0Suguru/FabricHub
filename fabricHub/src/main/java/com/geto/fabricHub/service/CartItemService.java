package com.geto.fabricHub.service;

import com.geto.fabricHub.exception.CartItemException;
import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.Cart;
import com.geto.fabricHub.model.CartItem;
import com.geto.fabricHub.model.Product;
import com.geto.fabricHub.model.User;

public interface CartItemService {

    public CartItem createCartItem(CartItem cartItem);

//    todo || idk why the fk its taking extra id -> maybe for the CartItem Id (will fix)
    public CartItem updateCartItem(Long userId, Long id) throws CartItemException, UserException;

    public CartItem isCartItemExist(Long cartId, Long productId, String size, Long userId) throws CartItemException, UserException;

    public void removeCartItem(Long userId, Long cartItemId) throws CartItemException, UserException;

//    public CartItem findCartItemById(Long cartItemId) throws CartItemException;

}
