package com.wedproject.app;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository(value="CustomerDao")
public class CustomerDao {
	
	@Autowired
	private CustomerRepository repository;
	
	public void insert(Customer customer) {
		repository.insert(customer);
	}
	
	public List<Customer> getList() {
		return repository.findAll();
	}
	
}
