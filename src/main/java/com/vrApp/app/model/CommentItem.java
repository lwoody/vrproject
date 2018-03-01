package com.vrApp.app.model;

import org.springframework.data.annotation.Id;

public class CommentItem {
	
	@Id
	public String id;
	public String content;
	
	public CommentItem(String content) {
		this.content=content;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	
	@Override
    public String toString() {
        return String.format(
                "Comment[id=%s, content='%s']",
                id, content);
    }

}
