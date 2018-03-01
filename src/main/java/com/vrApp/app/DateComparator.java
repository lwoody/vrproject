package com.vrApp.app;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Comparator;
import java.util.Date;

import com.vrApp.app.model.BoardItem;

public class DateComparator implements Comparator<BoardItem>{

	@Override
	public int compare(BoardItem o1, BoardItem o2) {
		
		SimpleDateFormat transFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		Date date1;
		Date date2;
		try {
			date1 = transFormat.parse(o1.getDate());
			date2 = transFormat.parse(o2.getDate());
			
			if (date1.before(date2)) {
	            return 1;
	        } else if (date1.after(date2)) {
	            return -1;
	        } else {
	            return 0;
	        }  
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return 0;
		}
		  
		 
	}

}
