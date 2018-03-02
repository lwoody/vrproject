package com.vrApp.app;

import org.springframework.boot.autoconfigure.mongo.MongoProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;

import com.mongodb.Mongo;
import com.mongodb.MongoClient;

@Configuration
public class SpringConfig extends AbstractMongoConfiguration{
	
//	@Bean
//	public MultipartResolver multipartResolver() {
//	    CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
////	    multipartResolver.setMaxUploadSize(500000000);
//	    multipartResolver.setDefaultEncoding("utf-8");
//	    return multipartResolver;
//	}
	
	@Bean
	public GridFsTemplate gridFsTemplate() throws Exception {
		return new GridFsTemplate(mongoDbFactory(), mappingMongoConverter());
	}

	@Override
	protected String getDatabaseName() {
		//return "yourdb";
		return new MongoProperties().getDatabase();
	}

	@Override
	@Bean
	public Mongo mongo() throws Exception {
		//return new MongoClient("127.0.0.1");
		return new Mongo();
	}

}
