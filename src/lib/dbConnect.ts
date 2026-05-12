import mongoose from 'mongoose'
import dns from 'dns'

// Ye pehle add karo — connect se pehle!
dns.setServers(['1.1.1.1', '8.8.8.8'])
type ConnectionObject = {
    isConnected?: number
}

const connection : ConnectionObject = {}

export async function dbConnect(): Promise<void>{
   if(connection.isConnected){
    console.log("Already database connected")
    return
   }

   try {
      const db = await mongoose.connect(process.env.mongo_URI || '', {}) 
      connection.isConnected = db.connections[0].readyState

      console.log("Database connected successfully✅");
   } catch (error) {
      console.log("Database connection failed:", error);
      throw error;   
   }
}