package com.wedproject.app;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {
	
	@Autowired
	private CustomerDao dao;
	
	public void insert(Customer customer) {
		dao.insert(customer);
	}
	
	public List<Customer> getList(){
		return dao.getList();
	}
	
}
