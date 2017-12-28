package com.albumBox.app.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Repository;

import com.albumBox.app.model.BoardItem;
import com.albumBox.app.repository.BoardRepository;
import com.mongodb.gridfs.GridFSDBFile;

@Repository("BoardDao")
public class BoardDao {
	
	@Autowired
	private BoardRepository repository;
	@Autowired
	private GridFsTemplate gridFsTemplate;
	
	public void insert(BoardItem boardItem) {
		repository.insert(boardItem);
	}
	
	public void deleteAll() {
		repository.deleteAll();
	}
	
	public List<BoardItem> getList() {
		return repository.findAll();
	}
	
	public List<BoardItem> getPageList(int start){
		Pageable pageable = new PageRequest(start, 6); //get 6 profiles on a page
	    Page<BoardItem> page = repository.findAllByOrderByIdDesc(pageable);
	    	List<BoardItem> list = page.getContent();
	    	System.out.println(list);
	    return list;
	}
	
	public GridFSDBFile getImage(BoardItem boardItem) {
		return gridFsTemplate.findOne(new Query(Criteria.where("_id").is(boardItem.getImageId())));
	}

}
