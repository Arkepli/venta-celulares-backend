// Cambiar todas las referencias de 'categorias' a 'mantenimiento_tecnico' y la ruta a '/mantenimiento-tecnico'
const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);
const dbName = "venta_celulares";
const collectionName = "mantenimiento_tecnico";

async function handler(req, res) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  if (req.method === "GET" && req.url === "/mantenimiento-tecnico") {
    const mantenimientos = await collection.find().toArray();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(mantenimientos));
  }

  if (req.method === "GET" && req.url.startsWith("/mantenimiento-tecnico/")) {
    const id = req.url.split("/")[2];
    const mantenimiento = await collection.findOne({ _id: new ObjectId(id) });
    if (mantenimiento) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(mantenimiento));
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({ message: "Mantenimiento técnico not found" })
    );
  }

  if (req.method === "POST" && req.url === "/mantenimiento-tecnico") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const newMantenimiento = JSON.parse(body);
      const result = await collection.insertOne(newMantenimiento);
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ insertedId: result.insertedId }));
    });
    return;
  }

  if (req.method === "PUT" && req.url.startsWith("/mantenimiento-tecnico/")) {
    const id = req.url.split("/")[2];
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const updatedMantenimiento = JSON.parse(body);
      if (updatedMantenimiento._id) {
        delete updatedMantenimiento._id;
      }
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedMantenimiento }
      );
      if (result.matchedCount > 0) {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ message: "Mantenimiento técnico updated" })
        );
      }
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Mantenimiento técnico not found" })
      );
    });
    return;
  }

  if (
    req.method === "DELETE" &&
    req.url.startsWith("/mantenimiento-tecnico/")
  ) {
    const id = req.url.split("/")[2];
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Mantenimiento técnico deleted" })
      );
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({ message: "Mantenimiento técnico not found" })
    );
  }

  res.writeHead(405, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Method not allowed" }));
}

module.exports = handler;
