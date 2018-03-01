package com.vrApp.app.repository;

import com.vrApp.app.model.Customer;
import com.vrApp.app.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CustomerRepository extends MongoRepository<Customer, Integer> {

    public Customer findById(Integer id);
    
}
