package com.vrApp.app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "customers")
public class Customer {

    public String id;
    public String memberCount;
    public String startDate;
    public boolean isBeverageOrdered;

    public Customer() {}

    public Customer(String memberCount, String startDate){
        super();
        this.memberCount=memberCount;
        this.startDate=startDate;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(String memberCount) {
        this.memberCount = memberCount;
    }

    public String getstartDate() {
        return startDate;
    }

    public void setDate(String date) {
        this.startDate = date;
    }

    public boolean isBeverageOrdered() {
        return isBeverageOrdered;
    }

    public void setBeverageOrdered(boolean beverageOrdered) {
        isBeverageOrdered = beverageOrdered;
    }

    @Override
    public String toString(){
        return String.format(
                "Customer[id="+id+", memberCount="+memberCount+", date="+startDate+", isBeverageOrderd="+isBeverageOrdered);
    }
}
