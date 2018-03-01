package com.vrApp.app.repository;

import com.vrApp.app.model.BoardItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BoardRepository extends MongoRepository<BoardItem, String>{
	
	public BoardItem findById(String id);
	public Page<BoardItem> findAllByOrderByIdDesc(Pageable pageable);
	
}
