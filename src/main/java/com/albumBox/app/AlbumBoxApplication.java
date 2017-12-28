package com.albumBox.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ImportResource;

@SpringBootApplication
@ImportResource("classpath:app-config.xml")
//public class WedprojectApplication implements CommandLineRunner{
public class AlbumBoxApplication{
	
//	private UserRepository userRepository;
//	private BoardRepository boardRepository;
//	
//	@Autowired
//	public AlbumBoxApplication(UserRepository userRepo,BoardRepository boardRepo) {
//		this.userRepository=userRepo;
//		this.boardRepository=boardRepo;
//	}

	public static void main(String[] args) {
		SpringApplication.run(AlbumBoxApplication.class, args);
	}

//	@Override
//	public void run(String... args) throws Exception {
//		
//		repository.deleteAll();
//		
//		// save a couple of Users
//		repository.save(new User("lwoody","1234"));
//		repository.save(new User("kevin", "4321"));
//
//		// fetch all Users
//		System.out.println("Users found with findAll():");
//		System.out.println("-------------------------------");
//		for (User User : repository.findAll()) {
//			System.out.println(User);
//		}
//		System.out.println();
//
//		// fetch an individual User
//		System.out.println("User found with findByFirstName('lwoody'):");
//		System.out.println("--------------------------------");
//		System.out.println(repository.findByName("lwoody"));
//
//		System.out.println("Users found with findByLastName('kevin'):");
//		System.out.println("--------------------------------");
//		for (User User : repository.findByName("kevin")) {
//			System.out.println(User);
//		}
//
//	}
}
