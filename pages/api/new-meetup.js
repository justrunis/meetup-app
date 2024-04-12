// /api/new-meetup
import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const data = req.body;

      // store in a database
      const client = await MongoClient.connect(
        `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.zxzalz3.mongodb.net/meetups?retryWrites=true&w=majority`
      );
      const db = client.db();

      const meetupsCollection = db.collection("meetups");
      const result = await meetupsCollection.insertOne(data);

      console.log(result);
      client.close();

      res.status(201).json({ message: "Meetup inserted!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to insert meetup." });
    }
  }
}
