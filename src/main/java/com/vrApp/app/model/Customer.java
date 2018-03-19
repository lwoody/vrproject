package com.vrApp.app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document(collection = "customers")
public class Customer {

    public String id;//mongoId
    public String tempId = UUID.randomUUID().toString();
    public String memberCount;//현재 사용 안함
    public String startDate;//yymmdd
    public String remainTime;
    public String extendedTime;
    public boolean isBeverageOrdered;
    public String startTime;
    public String endTime;
    public String beverageTime;
    public String customerNo;
    public String bUsing = "0";

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

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getBeverageTime() {
        return beverageTime;
    }

    public void setBeverageTime(String beverageTime) {
        this.beverageTime = beverageTime;
    }

    public String getCustomerNo() {
        return customerNo;
    }

    public void setCustomerNo(String customerNo) {
        this.customerNo = customerNo;
    }

    public String getTempId() {
        return tempId;
    }

    public void setTempId(String tempId) {
        this.tempId = tempId;
    }

    public String getbUsing() {
        return bUsing;
    }

    public void setbUsing(String bUsing) {
        this.bUsing = bUsing;
    }

    @Override
    public String toString(){
        return String.format(
                "Customer[id="+id+", memberCount="+memberCount+", date="+startDate+", isBeverageOrderd="+isBeverageOrdered+"]");
    }
}
