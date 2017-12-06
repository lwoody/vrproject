package com.wedproject.app;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class MainController {
	
//	@RequestMapping(value="/")
//	public String home() {
//		return "index";
//	}
//	
//	@RequestMapping(value="/when-where")
//	public String when_where() {
//		return "when-where";
//	}
	
	@Autowired
	private CustomerService service;
	
	@RequestMapping(value="/")
	public String wedweb() {
		
		return "wedweb";
	}
	
//	@RequestMapping(value="/attendCheck",method=RequestMethod.POST)
//	public String attendCheck(Customer customer) {
//		service.insert(customer);
//		List<Customer> list = service.getList();
//		for(Customer a:list) {
//			System.out.println(a.toString());			
//		}
//		return"redirect:/";
//	}
	
	@RequestMapping(value="/attendCheck",method=RequestMethod.POST)
	public String attendCheck(Customer customer) {
		
		return"redirect:/";
	}
	
	
	

}
