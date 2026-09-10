import pkg from "pg"; //detects this automatically, but importing it ensures it's bundled correctly
import "dotenv/config";
import {DataSource} from "typeorm";//main class TypeORM uses to manage database connections, queries, and transactions.
import { User } from "../entities/User.js";
import { Task } from "../entities/Task.js";


//creating a new datasouce instance
export const AppDataSource = new DataSource({
  type:"postgres",

  host:process.env.DB_HOST,
  port:process.env.DB_PORT,
  username:process.env.DB_USERNAME,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_NAME,

  entities: [User , Task], //if we dont mention typeorm will ignore them 
  migrations: ["src/migrations/*.js"],
  //Migrations are version-controlled scripts that safely apply these changes to your database. This line tells TypeORM exactly where to look for those script files.
  
  synchronize: false,

});
