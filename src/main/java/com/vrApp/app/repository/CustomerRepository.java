package com.vrApp.app.repository;

import com.vrApp.app.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CustomerRepository extends MongoRepository<Customer, String> {

    public Customer findById(String id);
    
}
