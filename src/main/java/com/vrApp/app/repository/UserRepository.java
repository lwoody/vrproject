package com.vrApp.app.repository;

import com.vrApp.app.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {

    public User findByName(String name);
    
}
