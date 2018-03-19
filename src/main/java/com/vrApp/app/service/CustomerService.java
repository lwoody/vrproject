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
	
	public Customer getCustomerByTempId(Customer customer) {
		return dao.getCustomerByTempId(customer);
	}

	public Customer getCustomerById(String id){
		return dao.getCustomerById(id);
	}

	public void update(Customer customer){
		dao.update(customer);
	}
	
	public void insert(Customer customer) {
		dao.insert(customer);
	}
	
	public void deleteAll() {
		dao.deleteAll();
	}
	
	public List<Customer> getList(){
		return dao.getList();
	}
	
}
