package com.vrApp.app;

import com.mongodb.MongoClientURI;
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
		return "heroku_rb8fsctc";
	}

	@Override
	@Bean
	public Mongo mongo() throws Exception {
		//return new MongoClient("127.0.0.1");
		MongoClientURI uri = new MongoClientURI("mongodb://heroku_rb8fsctc:ko28uje2golc051h659ciotsbr@ds235708.mlab.com:35708/heroku_rb8fsctc");
		MongoClient client = new MongoClient(uri);
		return client;
	}

}
