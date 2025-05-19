const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);
const dbName = "venta_celulares";
const collectionName = "accesorios";

async function handler(req, res) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  if (req.method === "GET" && req.url === "/accesorios") {
    const accesorios = await collection.find().toArray();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(accesorios));
  }

  if (req.method === "GET" && req.url.startsWith("/accesorios/")) {
    const id = req.url.split("/")[2];
    const accesorio = await collection.findOne({ _id: new ObjectId(id) });
    if (accesorio) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(accesorio));
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Accesorio not found" }));
  }

  if (req.method === "POST" && req.url === "/accesorios") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const newAccesorio = JSON.parse(body);
      const result = await collection.insertOne(newAccesorio);
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ insertedId: result.insertedId }));
    });
    return;
  }

  if (req.method === "PUT" && req.url.startsWith("/accesorios/")) {
    const id = req.url.split("/")[2];
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const updatedAccesorio = JSON.parse(body);
      if (updatedAccesorio._id) {
        delete updatedAccesorio._id;
      }
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedAccesorio }
      );
      if (result.matchedCount > 0) {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Accesorio updated" }));
      }
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Accesorio not found" }));
    });
    return;
  }

  if (req.method === "DELETE" && req.url.startsWith("/accesorios/")) {
    const id = req.url.split("/")[2];
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Accesorio deleted" }));
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Accesorio not found" }));
  }

  res.writeHead(405, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Method not allowed" }));
}

module.exports = handler;
