import {  EntitySchema } from "typeorm";

export const User = new EntitySchema({
  name:"User",
  tableName:"users",
  columns:{
    id:{type:"uuid",primary:true,generated:"uuid"},
    name:{type:"varchar",length:100,nullable:false},
    email:{type:"varchar",length:255,unique:true,nullable:false},
    passwordHash:{type:"varchar",nullable:false},
    createdAt:{type:"timestamp",createDate:true},
    updatedAt:{type:"timestamp",updateDate:true},
    accessToken:{type:"text",nullable:true},
    accessTokenExpiresAt:{type:"timestamp",nullable:true},
    refreshToken:{type:"text",nullable:true},
    refreshTokenExpiresAt:{type:"timestamp",nullable:true}
  },
});