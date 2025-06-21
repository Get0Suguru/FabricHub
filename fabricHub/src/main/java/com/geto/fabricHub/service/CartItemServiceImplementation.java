package com.geto.fabricHub.service;

import com.geto.fabricHub.exception.CartItemException;
import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.Cart;
import com.geto.fabricHub.model.CartItem;
import com.geto.fabricHub.model.Product;
import com.geto.fabricHub.model.User;
import com.geto.fabricHub.repo.UserRepo;
import com.geto.fabricHub.repo.CartItemRepo;
import com.geto.fabricHub.repo.CartRepo;
import org.springframework.stereotype.Service;

@Service
public class CartItemServiceImplementation implements CartItemService{

    private CartItemRepo cartItemRepo;


    public CartItemServiceImplementation(CartItemRepo cartItemRepo) {
        this.cartItemRepo = cartItemRepo;
    }

    @Override
    public CartItem createCartItem(CartItem cartItem) {
//todo -> when i am getting the fk out of some method why even set those (why don't get their value from the ui part)
        cartItem.setQuantity(1);
        cartItem.setPrice(cartItem.getProduct().getPrice());
        cartItem.setDiscountedPrice(cartItem.getProduct().getDiscountedPrice());

        CartItem createdCartItem = cartItemRepo.save(cartItem);
        return createdCartItem;
    }

    @Override
    public CartItem updateCartItem(Long userId, Long cartItemId) throws CartItemException, UserException {

//        User user = userRepo.findById(userId).orElseThrow(()-> new CartItemException("user not found with id " + userId));
// just for security extra checking

        CartItem existingItem = cartItemRepo.findById(cartItemId).
                orElseThrow(()-> new CartItemException("can't update as no cartItem found with id " + cartItemId));

//        checking cartItem's User stored == is same == the user sending requests
        if(!existingItem.getUser().getId().equals(userId)){
            throw new UserException("Unexpected user is trying to make changes to the cartItem");
        }
        existingItem.setQuantity(existingItem.getQuantity()+1);                                               // don;t know about the +1 logic will fix
        existingItem.setPrice(existingItem.getPrice()*existingItem.getQuantity());
        existingItem.setDiscountedPrice(existingItem.getDiscountedPrice()*existingItem.getQuantity());

        return cartItemRepo.save(existingItem);
    }

    @Override
    public CartItem isCartItemExist(Long cartId, Long productId, String size,Long userId) throws CartItemException, UserException {
        CartItem cartItem = cartItemRepo.isCartItemExist(cartId, productId, size, userId);

        return cartItem;
    }

    @Override
    public void removeCartItem(Long userId, Long cartItemId) throws CartItemException, UserException {

        CartItem item = cartItemRepo.findById(cartItemId).orElseThrow(()-> new CartItemException("no cartItem found with id " + cartItemId));

        // for security, we check that the item's user is same the user making the request for modification
        if(!item.getUser().getId().equals(userId)){
            throw new CartItemException("u can't make any update to other users cart Item");
        }
        cartItemRepo.deleteById(cartItemId);
    }


//    @Override
//    public CartItem findCartItemById(Long cartItemId) throws CartItemException {
//        return null;
//    }
}
