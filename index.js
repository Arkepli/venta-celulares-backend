const http = require("http");
const celularesHandler = require("./routes/celulares");
const ventasHandler = require("./routes/ventas");
const clientesHandler = require("./routes/clientes");
const marcasHandler = require("./routes/marcas");
const proveedoresHandler = require("./routes/proveedores");
const categoriasHandler = require("./routes/categorias");

const routes = {
  "/celulares": celularesHandler,
  "/ventas": ventasHandler,
  "/clientes": clientesHandler,
  "/marcas": marcasHandler,
  "/proveedores": proveedoresHandler,
  "/categorias": categoriasHandler,
};

const server = http.createServer((req, res) => {
  const route = Object.keys(routes).find((path) => req.url.startsWith(path));
  if (route) {
    routes[route](req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(8002, () => {
  console.log("Server running on port 8002");
});
