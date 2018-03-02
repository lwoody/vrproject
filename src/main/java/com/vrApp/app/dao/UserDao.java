package com.vrApp.app.dao;

import java.util.List;

import com.vrApp.app.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;

import com.vrApp.app.repository.UserRepository;

@Repository(value="UserDao")
public class UserDao{
	
	@Autowired
	private UserRepository repository;
	@Autowired
    private MongoOperations mongoOperations;
	@Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	@Autowired
	public UserDao(UserRepository repository, BCryptPasswordEncoder bCryptPasswordEncoder) {
		super();
		this.repository = repository;
		this.bCryptPasswordEncoder = bCryptPasswordEncoder;
	}

	public void insert(User user) {
		user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        repository.insert(user);
	}
	
	public void update(User user) {
		//mongoOperations.updateFirst(new Query(Criteria.where("_id").is(user.getId())),Update.update("itemList", user.getItemList()), User.class);
//		repository.findByName(user.getName()).getItemList().add(user.getItemList().get(0));
//		Query searchUserQuery = new Query(Criteria.where("name").is(user.getName()));
//		mongoOperations.updateFirst(searchUserQuery,
//                Update.update("itemList", user.getItemList()),User.class);
		repository.save(user);
	}
	
	public void deleteAll() {
		repository.deleteAll();
	}
	
	public List<User> getList() {
		return repository.findAll();
	}

	public User getUser(User user) {
		// TODO Auto-generated method stub
		return repository.findByName(user.name);
	}

	public User getUserByName(String name) {
		// TODO Auto-generated method stub
		return repository.findByName(name);
	}
	
}
