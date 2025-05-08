const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "venta_celulares";
const collectionName = "marcas";

async function handler(req, res) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  if (req.method === "GET" && req.url === "/marcas") {
    const marcas = await collection.find().toArray();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(marcas));
  }

  if (req.method === "GET" && req.url.startsWith("/marcas/")) {
    const id = req.url.split("/")[2];
    const marca = await collection.findOne({ _id: new ObjectId(id) });
    if (marca) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(marca));
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Marca not found" }));
  }

  if (req.method === "POST" && req.url === "/marcas") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const newMarca = JSON.parse(body);
      const result = await collection.insertOne(newMarca);
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ insertedId: result.insertedId }));
    });
    return;
  }

  if (req.method === "PUT" && req.url.startsWith("/marcas/")) {
    const id = req.url.split("/")[2];
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const updatedMarca = JSON.parse(body);
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedMarca }
      );
      if (result.matchedCount > 0) {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Marca updated" }));
      }
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Marca not found" }));
    });
    return;
  }

  if (req.method === "DELETE" && req.url.startsWith("/marcas/")) {
    const id = req.url.split("/")[2];
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Marca deleted" }));
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Marca not found" }));
  }

  res.writeHead(405, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Method not allowed" }));
}

module.exports = handler;
