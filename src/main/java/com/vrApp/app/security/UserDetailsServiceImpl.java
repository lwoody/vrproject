package com.vrApp.app.security;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.vrApp.app.model.User;
import com.vrApp.app.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService{
	
	@Autowired
	private UserRepository repository;
	
	@Override
    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
        User user = repository.findByName(name);
        
        Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
        grantedAuthorities.add(new SimpleGrantedAuthority(user.getRole()));
        
        return new org.springframework.security.core.userdetails.User(user.getName(), user.getPassword(), grantedAuthorities);
        
    }

}
