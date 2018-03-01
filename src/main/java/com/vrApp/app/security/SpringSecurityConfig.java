package com.vrApp.app.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;

@Configuration
public class SpringSecurityConfig extends WebSecurityConfigurerAdapter {


    @Autowired
    UserDetailsService userDetailsService ;

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
//    
//    @Bean
//    public AccessDeniedHandler accessDeniedHandler(){
//        return new MyAccessDeniedHandler();
//    }
    
    // roles admin allow to access /admin/**
    // roles user allow to access /user/**
    // custom 403 access denied handler
    @Override
    protected void configure(HttpSecurity http) throws Exception {

    			http
    				.headers().addHeaderWriter(new XFrameOptionsHeaderWriter(XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN))
    				.and()
                .authorizeRequests()
					.antMatchers("/","/home", "/about","/show-portfolio-page","/register","/register-confirm","/login-check",
							"/create-boardItem","/img/**","/css/**","/js/**").permitAll()
					.anyRequest().authenticated()
					.and()
                .formLogin()
					.loginPage("/login")
					.permitAll()
					.failureUrl("/login-error")
					.and()
                .logout()
					.permitAll();
 					
    }

    // create two users, admin and user
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
    	
    		  auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder());
    }
}
