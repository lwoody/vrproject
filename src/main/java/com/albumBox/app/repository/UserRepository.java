package com.albumBox.app.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.albumBox.app.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    public User findByName(String name);
    
}
