//package com.geto.fabricHub.RunnerService;
//
//import com.geto.fabricHub.model.Product;
//import com.geto.fabricHub.model.Size;
//import com.geto.fabricHub.repo.ProductRepo;
//import com.geto.fabricHub.repo.SizeRepo;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//import java.util.*;
//
//@Component
//public class SizeSeeder implements CommandLineRunner {
//
//    @Autowired
//    private ProductRepo productRepo;
//
//    @Autowired
//    private SizeRepo sizeRepo;
//
//    Random random = new Random();
//
//    public int giveMeRandomSize(){
//        return random.nextInt(10)+2;
//    }
//
//    @Override
//    public void run(String... args) throws Exception {
//
//        List<Product> products = productRepo.findAll();
//
//        for(Product product: products){
//           Size size1 =  new Size();
//           size1.setQuantity(giveMeRandomSize());
//           size1.setName("S");
//           size1.setProduct(product);
//           sizeRepo.save(size1);
//
//
//           Size size2 =  new Size();
//           size2.setQuantity(giveMeRandomSize());
//           size2.setName("M");
//           size2.setProduct(product);
//           sizeRepo.save(size2);
//
//           Size size3 =  new Size();
//           size3.setQuantity(giveMeRandomSize());
//           size3.setName("L");
//           size3.setProduct(product);
//           sizeRepo.save(size3);
//
//           Size size4 =  new Size();
//           size4.setQuantity(giveMeRandomSize());
//           size4.setName("XL");
//           size4.setProduct(product);
//           sizeRepo.save(size4);
//
//           product.setQuantity(size1.getQuantity() + size2.getQuantity() + size3.getQuantity() + size4.getQuantity());
//
//           List<Size> sizes = new ArrayList<>();
//           sizes.add(size1);
//           sizes.add(size2);
//           sizes.add(size3);
//           sizes.add(size4);
//           product.setSize(sizes);
//
//           productRepo.save(product);
//
//
//            System.out.println("random sizes getting save for product :" + product.getId());
//        }
//    }
//}
