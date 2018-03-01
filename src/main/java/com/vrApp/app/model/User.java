package com.vrApp.app.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User{

    @Id
    public String name;
    public String password;
    public List<BoardItem> itemList = new ArrayList<>();
    public String role;
    
    public User() {}

	public User(String name, String password) {
		super();
		this.name = name;
		this.password = password;
		this.role = "USER";
	}

	public String getRole() {
		return role;
	}



	public void setRole(String role) {
		this.role = role;
	}



//	public String getId() {
//		return id;
//	}
//
//
//
//	public void setId(String id) {
//		this.id = id;
//	}



	public String getName() {
		return name;
	}



	public void setName(String name) {
		this.name = name;
	}



	public String getPassword() {
		return password;
	}



	public void setPassword(String password) {
		this.password = password;
	}



	public List<BoardItem> getItemList() {
		return itemList;
	}



	public void setItemList(List<BoardItem> itemList) {
		this.itemList = itemList;
	}



	@Override
    public String toString() {
        return String.format(
                "User[name='%s', items="+itemList.size()+"]",
                 name);
    }

}
