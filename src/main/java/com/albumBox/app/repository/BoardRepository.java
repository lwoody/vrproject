package com.albumBox.app.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.albumBox.app.model.BoardItem;

public interface BoardRepository extends MongoRepository<BoardItem, String>{
	
	public BoardItem findById(String id);
	public Page<BoardItem> findAllByOrderByIdDesc(Pageable pageable);
	
}
