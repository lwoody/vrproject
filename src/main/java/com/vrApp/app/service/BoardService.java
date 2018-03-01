package com.vrApp.app.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vrApp.app.dao.BoardDao;
import com.vrApp.app.model.BoardItem;
import com.mongodb.gridfs.GridFSDBFile;

@Service
public class BoardService {
	
	@Autowired
	private BoardDao dao;
	
	public void insert(BoardItem boardItem, String userName) {
		DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		Date date = new Date();
		boardItem.setDate(dateFormat.format(date));		
		boardItem.setUserName(userName);
		dao.insert(boardItem);
	}
	
	public void deleteAll() {
		dao.deleteAll();
	}
	
	public List<BoardItem> getList(){
		return dao.getList();
	}
	
	public List<BoardItem> getPageList(int start){
		return dao.getPageList(start);
	}
	
	public GridFSDBFile getImage(BoardItem boardItem) {
		return dao.getImage(boardItem);
	}
}
