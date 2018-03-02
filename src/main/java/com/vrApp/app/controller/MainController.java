package com.vrApp.app.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.vrApp.app.model.BoardItem;
import com.vrApp.app.model.User;
import com.vrApp.app.service.BoardService;
import com.vrApp.app.service.UserService;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.multipart.MultipartFile;

@Controller
//@SessionAttributes("loginUser")
public class MainController {
	
	
//	private UserService service;
	private UserService userService;
	private BoardService boardService;
	private GridFsTemplate gridFsTemplate;

	@Autowired
	public MainController(UserService userService, BoardService boardService, GridFsTemplate gridFsTemplate) {
		
		this.userService=userService;
		this.boardService=boardService;
		this.gridFsTemplate=gridFsTemplate;
		
//		userService.deleteAll();
//
//		gridFsTemplate.delete(new Query(Criteria.where("_id").exists(true)));
//		User user = new User("lwoody","1234");
////		for(int i=1;i<100;i++) {
////			BoardItem boardItem = new BoardItem(Integer.toString(i),Integer.toString(i));
////
////			boardService.insert(boardItem, "lwoody");
////			System.out.println(boardService.getList());
////		}
//		userService.insert(user);
//		for (User User : userService.getList()) {
//			System.out.println(User.toString());
//			System.out.println(User.getPassword());
//
//		}
	}
	
	// @RequestMapping(value="/")
	// public String index() {
		
	// 	for (User User : userService.getList()) {
	// 		System.out.println(User.toString());
			
	// }
	
	//	return "index";
	//}
	
	@RequestMapping(value="/home")
	public String main() {
		
		for (User User : userService.getList()) {
			System.out.println(User.toString());
			
		}
	
		return "index";
	}
	
	@RequestMapping(value="/show-about")
	public String showAbout() {
		
		return "about";
	}
	
	@RequestMapping(value="/show-album")
	public String showAlbum(Model model) {
		
		//sort by date(most recent board must show first) - replaced with mongodb repository api with id Desc
		List<BoardItem> list = boardService.getPageList(0);//start and 6 items load
//		Collections.sort(list, new DateComparator());
		model.addAttribute("boardList", list );
		
		return "album";
	}
	
	@RequestMapping(value="/load-album", method=RequestMethod.POST)
	public @ResponseBody List<BoardItem> loadAlbum(@RequestParam int start, HttpServletRequest request) {
		
		List<BoardItem> list = boardService.getPageList(start);
	
		return list;
	}
	
	
	
	@RequestMapping(value="/create-board")
	public String showCreateView() {
		
		return "create-form";
	}
	
	@RequestMapping(value="/create-boardItem", method=RequestMethod.POST)
	public String createBoardItem(@RequestParam("imageFile") MultipartFile imageFile, BoardItem boardItem, Authentication authentication) throws IOException {
		
		//get current login user
		UserDetails userDetails = (UserDetails) authentication.getPrincipal();
		
		//image to imageStorage
//		DBObject metaData = new BasicDBObject();
//		metaData.put("user", userDetails.getUsername());
//		metaData.put("title", boardItem.getTitle());
		String imageId = gridFsTemplate.store(imageFile.getInputStream(), imageFile.getOriginalFilename(), imageFile.getContentType()).getId().toString();	
				
		//add board to documnet and connect user(link image with the boardItem
		boardItem.setImageId(imageId);
		boardItem.setImage(Base64.encodeBase64String(imageFile.getBytes())); // urlsafe 빼야함
		boardService.insert(boardItem, userDetails.getUsername());		
		
		//user boardlist update
		User loginUser = userService.getUserByName(userDetails.getUsername());
		userService.updateBoardList(loginUser,boardItem);	
		
		return "redirect:/show-photo-detail";
	}
	
	@RequestMapping(value="/show-photo-detail")
	public String showPortfolioPage() {
		
		for (User User : userService.getList()) {
			System.out.println(User.toString());
			System.out.println(User.getPassword());
		}
		
		return "photo-detail";
	}
	
	@RequestMapping(value="/login")
	public String login(HttpSession session) {
	
		return "login";
	}
	
	@RequestMapping(value="/login-check", method=RequestMethod.GET)
	public @ResponseBody boolean loginCheck(HttpSession session, Authentication authentication) {
	
		boolean response = false;
		if(authentication != null) {
			response = true;
		}
		System.out.println(response);
		return response;
	}
	
	@RequestMapping("/login-error")
	  public String loginError(Model model) {
	    model.addAttribute("loginError", true);
	    return "login";
	  }
	
	@RequestMapping(value="/logout")
	public String logout(SessionStatus status, HttpSession session) {
		
		session.invalidate();
		status.setComplete();
		
		return "redirect:/home";
	}
	
	@RequestMapping(value="/register", method=RequestMethod.POST)
	public String register(@RequestParam("username") String username, @RequestParam("password") String password, @RequestParam("repassword") String repassword
			, HttpServletRequest request) throws ServletException {
		
		User user = new User(username,password);
		userService.insert(user);
		request.login(username, password);
		
		return "redirect:/home";

	}
	
	@PostMapping(value="/register-confirm")
	public @ResponseBody User registerConfirm(@RequestParam("username") String username, @RequestParam("password") String password, @RequestParam("repassword") String repassword
			, HttpServletRequest request) throws ServletException {
		
		System.out.println(username);
		
		User user = new User(username,password);
		User userExist = userService.getUser(user);
		User userError;
		if(userExist != null) {
			userError = new User("이미 존재하는 이름입니다.",password);
			return userError;
		}else if(!password.equals(repassword)){
			userError = new User(username,"패스워드가 일치하지 않습니다.");
			return userError;
		}else if(username.equals("")||password.equals("")||username==null||password==null){
			userError = new User(username,"모두 입력하세요.");
			return userError;
		}else {
			userError = new User("correct","correct");
			
			return userError;
		}
	}

	@RequestMapping("/")
	public String showCurrentStatus(){
		return "currentStatus";
	}

	@PostMapping(value="/addCustomer")
	public @ResponseBody boolean addCustomer(@RequestParam("memberCount") String memberCount, HttpServletRequest request){

		return true;
	}
	
}
