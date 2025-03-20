package com.geto.fabricHub.repo;

import com.geto.fabricHub.model.Cart;
import com.geto.fabricHub.model.CartItem;
import com.geto.fabricHub.model.Product;
import com.geto.fabricHub.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepo extends JpaRepository<CartItem, Long> {

    @Query("select ci from CartItem ci where ci.cart.id=:cartId")
    public List<CartItem> findByCartId(@Param("cartId") Long cartId);

    @Query("select ci from CartItem ci where ci.cart.id=:cartId AND ci.product.id=:productId And ci.size=:size and ci.user.id = :userId")
    public CartItem isCartItemExist(@Param("cartId") Long cartId,
                                    @Param("productId") Long productId,
                                    @Param("size") String size,
                                    @Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("delete from CartItem ci where ci.id=:id")
    public void deleteCartItemById(@Param("id") Long id);

}
