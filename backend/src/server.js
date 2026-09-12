import app from './app.js';
import "dotenv/config";

import { AppDataSource } from './config/db.js';

const PORT = process.env.PORT || 4000;

const startServer = async() =>{
  try{
    await AppDataSource.initialize();
    console.log("Database connected successfully , Postgre Sucks");
    
    app.listen(PORT,()=>{
    console.log(`Server is startiing on port :${PORT}`);
    });
  }catch(e){
    console.error("Database Connection Failed :" , e);
  }
};

startServer();