package com.vrApp.app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "customers")
public class Customer {

    @Id
    public int id;
    public int memberCount;
    public String date;
    public boolean isBeverageOrdered;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(int memberCount) {
        this.memberCount = memberCount;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
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
                "Customer[id="+id+", memberCount="+memberCount+", date="+date+", isBeverageOrderd="+isBeverageOrdered);
    }
}
