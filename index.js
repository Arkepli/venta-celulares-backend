const http = require("http");
const celularesHandler = require("./routes/celulares");
const ventasHandler = require("./routes/ventas");
const marcasHandler = require("./routes/marcas");
const proveedoresHandler = require("./routes/proveedores");
const mantenimientoTecnicoHandler = require("./routes/mantenimiento_tecnico");
const accesoriosHandler = require("./routes/accesorios");

const routes = {
  "/celulares": celularesHandler,
  "/ventas": ventasHandler,
  "/marcas": marcasHandler,
  "/proveedores": proveedoresHandler,
  "/mantenimiento-tecnico": mantenimientoTecnicoHandler,
  "/accesorios": accesoriosHandler,
};

const server = http.createServer((req, res) => {
  // Habilitar CORS para todas las rutas y métodos
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  const route = Object.keys(routes).find((path) => req.url.startsWith(path));
  if (route) {
    routes[route](req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(8002, '0.0.0.0', () => {
  console.log("Server running on port 8002");
});
