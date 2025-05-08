const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "venta_celulares";
const collectionName = "categorias";

async function handler(req, res) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  if (req.method === "GET" && req.url === "/categorias") {
    const categorias = await collection.find().toArray();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(categorias));
  }

  if (req.method === "GET" && req.url.startsWith("/categorias/")) {
    const id = req.url.split("/")[2];
    const categoria = await collection.findOne({ _id: new ObjectId(id) });
    if (categoria) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(categoria));
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Categoria not found" }));
  }

  if (req.method === "POST" && req.url === "/categorias") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const newCategoria = JSON.parse(body);
      const result = await collection.insertOne(newCategoria);
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ insertedId: result.insertedId }));
    });
    return;
  }

  if (req.method === "PUT" && req.url.startsWith("/categorias/")) {
    const id = req.url.split("/")[2];
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const updatedCategoria = JSON.parse(body);
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedCategoria }
      );
      if (result.matchedCount > 0) {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Categoria updated" }));
      }
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Categoria not found" }));
    });
    return;
  }

  if (req.method === "DELETE" && req.url.startsWith("/categorias/")) {
    const id = req.url.split("/")[2];
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Categoria deleted" }));
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Categoria not found" }));
  }

  res.writeHead(405, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Method not allowed" }));
}

module.exports = handler;
