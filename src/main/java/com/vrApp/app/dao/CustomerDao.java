package com.vrApp.app.dao;

import com.vrApp.app.model.Customer;
import com.vrApp.app.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository(value="CustomerDao")
public class CustomerDao {

	@Autowired
	private CustomerRepository repository;
	@Autowired
    private MongoOperations mongoOperations;

	@Autowired
	public CustomerDao(CustomerRepository repository) {
		super();
		this.repository = repository;
	}

	public void insert(Customer customer) {
        repository.insert(customer);
	}
	
	public void update(Customer customer) {
		//mongoOperations.updateFirst(new Query(Criteria.where("_id").is(user.getId())),Update.update("itemList", user.getItemList()), User.class);
//		repository.findByName(user.getName()).getItemList().add(user.getItemList().get(0));
//		Query searchUserQuery = new Query(Criteria.where("name").is(user.getName()));
//		mongoOperations.updateFirst(searchUserQuery,
//                Update.update("itemList", user.getItemList()),User.class);
		repository.save(customer);
	}
	
	public void deleteAll() {
		repository.deleteAll();
	}

	public List<Customer> getList() {
		return repository.findAll();
	}


	public Customer getCustomerById(Customer customer) {
		// TODO Auto-generated method stub
		return repository.findById(customer.id);
	}
	
}
