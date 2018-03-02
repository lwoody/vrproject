package com.vrApp.app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "customers")
public class Customer {

    public String id;
    public String memberCount;
    public String startDate;
    public String remainTime;
    public String extendedTime;
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

    public boolean isBeverageOrdered() {
        return isBeverageOrdered;
    }

    public void setBeverageOrdered(boolean beverageOrdered) {
        isBeverageOrdered = beverageOrdered;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getRemainTime() {
        return remainTime;
    }

    public void setRemainTime(String remainTime) {
        this.remainTime = remainTime;
    }

    public String getExtendedTime() {
        return extendedTime;
    }

    public void setExtendedTime(String extendedTime) {
        this.extendedTime = extendedTime;
    }

    @Override
    public String toString(){
        return String.format(
                "Customer[id="+id+", memberCount="+memberCount+", date="+startDate+", isBeverageOrderd="+isBeverageOrdered+"]");
    }
}
