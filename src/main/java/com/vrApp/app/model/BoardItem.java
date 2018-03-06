package com.vrApp.app.model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="boards")
public class BoardItem {

	@Id
	public String id;
	public String title, content, imageId, image, userName, date;
	public List<CommentItem> commentList = new ArrayList<>();
	public int hits = 0;
//	public MultipartFile imageFile;
//	public byte[] image;
	
	public BoardItem() {}
	
	public BoardItem(String title, String content) {
		super();
		this.title = title;
		this.content = content;		
	}
	
	
	
	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getImageId() {
		return imageId;
	}

	public void setImageId(String imageId) {
		this.imageId = imageId;
	}

	public String getUserName() {
		return userName;
	}
	
	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
//	public MultipartFile getImageFile() {
//		return imageFile;
//	}
//	public void setImageFile(MultipartFile imageFile) {
//		this.imageFile = imageFile;
//	}
	public int getHits() {
		return hits;
	}
	public void setHits(int hits) {
		this.hits = hits;
	}

	public List<CommentItem> getCommentList() {
		return commentList;
	}

	public void setCommentList(List<CommentItem> commentList) {
		this.commentList = commentList;
	}
	
	@Override
    public String toString() {
        return String.format(
                "BoardItem[id=%s, title='%s', content='%s', date="+date+"]",
                id, title, content);
    }
	
}
