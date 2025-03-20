package com.geto.fabricHub.repo;

import com.geto.fabricHub.model.Cart;
import com.geto.fabricHub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepo extends JpaRepository<Cart, Long>  {

//  jpa method to query creation magic
//    public Cart findByUserId(Long userId);

//    NOTE:- that's wrong
//            don't think in terms of sql and its created tables ok
//          always think in terms of jpa model classs -> u made decisions based on joinColum and that's wrong

    @Query("Select c From Cart  c where c.user.id=:userId")
    public Cart findByUserId(@Param("userId") Long userId);

}
