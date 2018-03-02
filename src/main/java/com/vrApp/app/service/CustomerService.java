package com.vrApp.app.service;

import com.vrApp.app.dao.CustomerDao;
import com.vrApp.app.dao.CustomerDao;
import com.vrApp.app.model.BoardItem;
import com.vrApp.app.model.Customer;
import com.vrApp.app.model.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {
	
	@Autowired
	private CustomerDao dao;
	
	public Customer getCustomerById(Customer customer) {
		return dao.getCustomerById(customer);
	}
	
	public void insert(Customer Customer) {
		dao.insert(Customer);
	}
	
	public void deleteAll() {
		dao.deleteAll();
	}
	
	public List<Customer> getList(){
		return dao.getList();
	}
	
}
