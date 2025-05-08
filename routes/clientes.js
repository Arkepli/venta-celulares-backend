const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "venta_celulares";
const collectionName = "clientes";

async function handler(req, res) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  if (req.method === "GET" && req.url === "/clientes") {
    const clientes = await collection.find().toArray();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(clientes));
  }

  if (req.method === "GET" && req.url.startsWith("/clientes/")) {
    const id = req.url.split("/")[2];
    const cliente = await collection.findOne({ _id: new ObjectId(id) });
    if (cliente) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(cliente));
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Cliente not found" }));
  }

  if (req.method === "POST" && req.url === "/clientes") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const newCliente = JSON.parse(body);
      const result = await collection.insertOne(newCliente);
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ insertedId: result.insertedId }));
    });
    return;
  }

  if (req.method === "PUT" && req.url.startsWith("/clientes/")) {
    const id = req.url.split("/")[2];
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const updatedCliente = JSON.parse(body);
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedCliente }
      );
      if (result.matchedCount > 0) {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Cliente updated" }));
      }
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Cliente not found" }));
    });
    return;
  }

  if (req.method === "DELETE" && req.url.startsWith("/clientes/")) {
    const id = req.url.split("/")[2];
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Cliente deleted" }));
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Cliente not found" }));
  }

  res.writeHead(405, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Method not allowed" }));
}

module.exports = handler;
