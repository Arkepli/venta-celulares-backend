const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);
const dbName = "venta_celulares";
const collectionName = "proveedores";

async function handler(req, res) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  if (req.method === "GET" && req.url === "/proveedores") {
    const proveedores = await collection.find().toArray();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(proveedores));
  }

  if (req.method === "GET" && req.url.startsWith("/proveedores/")) {
    const id = req.url.split("/")[2];
    const proveedor = await collection.findOne({ _id: new ObjectId(id) });
    if (proveedor) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(proveedor));
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Proveedor not found" }));
  }

  if (req.method === "POST" && req.url === "/proveedores") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const newProveedor = JSON.parse(body);
      const result = await collection.insertOne(newProveedor);
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ insertedId: result.insertedId }));
    });
    return;
  }

  if (req.method === "PUT" && req.url.startsWith("/proveedores/")) {
    const id = req.url.split("/")[2];
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const updatedProveedor = JSON.parse(body);
      if (updatedProveedor._id) {
        delete updatedProveedor._id;
      }
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedProveedor }
      );
      if (result.matchedCount > 0) {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Proveedor updated" }));
      }
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Proveedor not found" }));
    });
    return;
  }

  if (req.method === "DELETE" && req.url.startsWith("/proveedores/")) {
    const id = req.url.split("/")[2];
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Proveedor deleted" }));
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Proveedor not found" }));
  }

  res.writeHead(405, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Method not allowed" }));
}

module.exports = handler;
