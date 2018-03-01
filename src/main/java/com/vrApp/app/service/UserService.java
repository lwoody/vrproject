package com.vrApp.app.service;

import java.util.List;

import com.vrApp.app.model.BoardItem;
import com.vrApp.app.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vrApp.app.dao.UserDao;

@Service
public class UserService {
	
	@Autowired
	private UserDao dao;
	
	public User getUser(User user) {
		return dao.getUser(user);
	}
	
	public User getUserByName(String name) {
		return dao.getUserByName(name);
	}
	
	public void insert(User user) {
		dao.insert(user);
	}
	
	public void updateBoardList(User user,BoardItem boardItem) {
		
		user.itemList.add(boardItem);
		dao.update(user);
	}
	
	public void deleteAll() {
		dao.deleteAll();
	}
	
	public List<User> getList(){
		return dao.getList();
	}
	
}
