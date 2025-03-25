package com.geto.fabricHub.service;

import com.geto.fabricHub.exception.CartItemException;
import com.geto.fabricHub.exception.OrderException;
import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.*;
import com.geto.fabricHub.repo.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImplementation implements OrderService {

    private OrderRepo orderRepo;
    private CartService cartService;
    private OrderItemRepo orderItemRepo;
    private AddressRepo addressRepo;

    public OrderServiceImplementation(OrderRepo orderRepo, CartService cartService, OrderItemRepo orderItemRepo, AddressRepo addressRepo) {
        this.orderRepo = orderRepo;
        this.cartService = cartService;
        this.orderItemRepo = orderItemRepo;
        this.addressRepo = addressRepo;
    }


    // create new order and return it
    @Override
    public String createOrder(User reqUser, Long addressId) throws OrderException, CartItemException, UserException {
        //i fkin did the saving of address all i am using it for selected address nothing more -> so using only its id
/*
//        setting user obj in Address model     and      saving  in db
        shippingAddress.setUser(reqUser);
        Address newAddress = addressRepo.save(shippingAddress);

//        updating address list in users table for future use       (address is a list<Address> so give suitable input)
        reqUser.getAddress().add(newAddress);
        userRepo.save(reqUser);                //this will update the existing user table's values

 */
        Cart cart = cartService.findUserCart(reqUser.getId());     //getting cart

//       create order first so u can save it in order items as they have the join column  then order list
        Order newOrder = new Order();
        newOrder.setUser(reqUser);
        newOrder.setTotalPrice(cart.getTotalPrice());
        newOrder.setTotalItems(cart.getTotalItem());
        newOrder.setTotalDicountedPrice(cart.getTotalDiscountedPrice());
        newOrder.setDiscount(cart.getDiscount());

        newOrder.setShippingAddress(addressRepo.findById(addressId).get());       // optional hai so .get() used
        newOrder.setOrderDate(LocalDateTime.now());
        newOrder.setDeliveryDate(LocalDateTime.now().plusDays(10));
        newOrder.setDeliveryDate(LocalDateTime.now());
        newOrder.setOrderStatus("PENDING");
        newOrder.setCreatedAt(LocalDateTime.now());

        Order order = orderRepo.save(newOrder);           // saving it so i get id for the order item    ||   will save order item in a sex


//       so to create order we need all the orderItems (everything in cart)     ||   similar to cart have individual items
//        PLAN: get the cart -> getItems list out of it -> loop it and create OrderItem objects

        List<OrderItem> orderItemsList = new ArrayList<>();         // gonna save stuff after conversion in it

        //to convert cartItem to orderItem
        for(CartItem item: cart.getCartItems()){
            OrderItem orderitem = new OrderItem().builder()
                    .price(item.getPrice())
                    .quantity(item.getQuantity())
                    .size(item.getSize())
                    .discountedPrice(item.getDiscountedPrice())
                    .product(item.getProduct())
                    .user(item.getUser())
                    .order(order)
                    .build();                                                   //not setted order i think should be done side by side

            //saving each into db for record and history type shit
            OrderItem createdOrderItem =orderItemRepo.save(orderitem);

            //saving in list
            orderItemsList.add(createdOrderItem);
        }

        // no need to save orderItems into order their join col is in order item if there done that's fine

        // now just delete cart
        System.out.println("ran the thing here to clear cart after creating order");
         cartService.clearCart(cart);

        return "Order Created Successfully";
    }

    @Override
    public Order placedOrder(long orderId) throws OrderException {
        Order order = findOrderById(orderId);
        order.setOrderStatus("PLACED");
        order.getPaymentDetails().setStatus("COMPLETED");
        return order;
    }

    @Override
    public Order confirmedOrder(long orderId) throws OrderException {
        Order order = findOrderById(orderId);
        order.setOrderStatus("CONFIRMED");

        return orderRepo.save(order);   // that's the saving/updating analogy of spring boot in case if backlog
    }

    @Override
    public Order shippedOrder(long orderId) throws OrderException {
        Order order = findOrderById(orderId);
        order.setOrderStatus("SHIPPED");

        return orderRepo.save(order);
    }

    @Override
    public Order deliveredOrder(long orderId) throws OrderException {
        Order order = findOrderById(orderId);
        order.setOrderStatus("DELIVERED");

        return orderRepo.save(order);
    }

    @Override
    public Order canceledOrder(long orderId) throws OrderException {
        Order order = findOrderById(orderId);
        order.setOrderStatus("CANCELLED");

        return orderRepo.save(order);
    }


    @Override
    public Order findOrderById(long orderId) throws OrderException {
        return orderRepo.findById(orderId).orElseThrow(() -> new OrderException("order not exist with id:"+ orderId));
    }

//    @Override
//    public List<Order> userOrderHistory(long userId) {
//        return orderRepo.getUsersOrder(userId);
//    }

    // this method is for admin only
    @Override
    public List<Order> getUserAllOrders(User user) {
        return orderRepo.findByUser(user);
    }


    // well with this method we fking give all orders existing
//    todo fix it for just undelviered orders  -> will fix    fk it rn
    @Override
    public List<Order> getAllOrder() {
        return orderRepo.findAll();
    }

    @Override
    public void deleteOrder(long orderId) throws OrderException {
        orderRepo.deleteById(orderId);
    }
}
