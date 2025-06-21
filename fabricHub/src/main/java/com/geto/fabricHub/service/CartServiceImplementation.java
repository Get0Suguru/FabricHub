package com.geto.fabricHub.service;

import com.geto.fabricHub.dto.AddItemRequest;
import com.geto.fabricHub.exception.CartItemException;
import com.geto.fabricHub.exception.ProductException;
import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.Cart;
import com.geto.fabricHub.model.CartItem;
import com.geto.fabricHub.model.Product;
import com.geto.fabricHub.model.User;
import com.geto.fabricHub.repo.CartItemRepo;
import com.geto.fabricHub.repo.CartRepo;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImplementation implements CartService{


    private final CartItemRepo cartItemRepo;
    private final CartRepo cartRepo;
    private final CartItemService cartItemService;
    private final ProductService productService;



    public CartServiceImplementation(CartRepo cartRepo, CartItemService cartItemService, ProductService productService, CartItemRepo cartItemRepo) {
        this.cartRepo = cartRepo;
        this.cartItemService = cartItemService;
        this.productService = productService;
        this.cartItemRepo = cartItemRepo;
    }

    @Override
    public Cart createCart(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepo.save(cart);
    }

    @Override
    public String addCartItem(User user, AddItemRequest req) throws ProductException, CartItemException, UserException {
        Cart cart = cartRepo.findByUserId(user.getId());


        //get the product to store in cart as cartItem
        Product product = productService.findProductById(req.getProductId());

        //to check cartItem exist (as of same product, size we have made a method in cartItemService
        CartItem presentCartItem = cartItemService.isCartItemExist(cart.getId(), product.getId(), req.getSize(), user.getId());

        // if no cartItem in for user in cart as per told stuff -> make one
        if(presentCartItem == null){
            CartItem cartItem = new CartItem();
            cartItem.setUser(user);
            cartItem.setProduct(product);
            cartItem.setSize(req.getSize());
            cartItem.setQuantity(req.getQuantity());

            int price = req.getQuantity()*product.getPrice();
            cartItem.setPrice(price);

            int discountedPrice = req.getQuantity()*product.getDiscountedPrice();
            cartItem.setDiscountedPrice(discountedPrice);

            cartItem.setCart(cart);
            cartItemRepo.save(cartItem);






        }
//      todo -> well as if the presentCartItem isn't null i mean update the quantity by 1
        else{
            cartItemService.updateCartItem(user.getId(), presentCartItem.getId());
        }
        return "Item added to cart";
    }

    //we have 3 methods - 1 create, 2 add new, 3 find
    // in 3 we are updating no's like price, discountedPrice, quantity  -> for cart's total stuff
    @Override
    public Cart findUserCart(Long userId) {
        Cart cart = cartRepo.findByUserId(userId);

        int totalPrice=0;
        int totalDiscountedPrice=0;
        int totalItem=0;

        for(CartItem cartItem : cart.getCartItems()){
            cartItem.getUser().getEmail();
            totalPrice = totalPrice + cartItem.getPrice();
            totalDiscountedPrice = totalDiscountedPrice + cartItem.getDiscountedPrice();
            totalItem = totalItem + cartItem.getQuantity();

        }
        cart.setTotalPrice(totalPrice);
        cart.setTotalDiscountedPrice(totalDiscountedPrice);
        cart.setTotalItem(totalItem);
        cart.setDiscount(totalPrice-totalDiscountedPrice);

        return cartRepo.save(cart);
    }

    @Override
    public String clearCart(Cart cart) throws CartItemException, UserException {
            System.out.println("the cart id is " + cart.getId() + "so technically it should work now i guess");
            List<CartItem> cartItems = cartItemRepo.findByCartId(cart.getId());

        for (CartItem cartItem : cartItems) {
                System.out.println("cart item with id " + cartItem.getId() + " removed");
                cartItemRepo.deleteCartItemById(cartItem.getId());
            }

            // clear stuff/data in cart too
            cart.setTotalPrice(0);
            cart.setTotalItem(0);
            cart.setTotalDiscountedPrice(0);
            cart.setDiscount(0);
            cartRepo.save(cart);


            return "Cart cleared";



    }
}
