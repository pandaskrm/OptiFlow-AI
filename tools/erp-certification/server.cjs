const http = require("http");

const PORT = 4010;
const API_KEY = "organia-certification-v1";

const now = new Date();
const iso = (minutes = 0) =>
  new Date(now.getTime() + minutes * 60000).toISOString();

const data = {
  orders: [
    {
      number: "CC-CERT-001",
      customer: "Client Alpha",
      carrier: "Chronopost",
      priority: "HIGH",
      status: "PREPARING",
      totalLines: 24,
      preparedLines: 18,
      scheduledAt: iso(60)
    },
    {
      number: "CC-CERT-002",
      customer: "Client Beta",
      carrier: "DHL",
      priority: "NORMAL",
      status: "READY",
      totalLines: 12,
      preparedLines: 12,
      scheduledAt: iso(90)
    }
  ],

  receptions: [
    {
      number: "REC-CERT-001",
      supplier: "Fournisseur Alpha",
      carrier: "Geodis",
      dock: "Q2",
      pallets: 8,
      status: "IN_PROGRESS",
      scheduledAt: iso(-30)
    }
  ],

  shipments: [
    {
      number: "EXP-CERT-001",
      orderNumber: "CC-CERT-002",
      customer: "Client Beta",
      carrier: "DHL",
      dock: "Q4",
      status: "READY",
      pallets: 2,
      packages: 14,
      scheduledAt: iso(45),
      shippedAt: null
    }
  ],

  stock: [
    {
      sku: "CERT-SKU-001",
      label: "Produit certification A",
      location: "A-01-01",
      quantity: 120,
      reserved: 20,
      minimum: 30
    },
    {
      sku: "CERT-SKU-002",
      label: "Produit certification B",
      location: "B-02-03",
      quantity: 8,
      reserved: 4,
      minimum: 20
    }
  ],

  employees: [
    {
      id: "CERT-E001",
      fullName: "Employé Test Alpha",
      role: "PREPARATEUR",
      team: "Préparation",
      zone: "A",
      status: "ACTIVE",
      workedMinutes: 300,
      processedUnits: 245,
      workDate: now.toISOString()
    },
    {
      id: "CERT-E002",
      fullName: "Employé Test Beta",
      role: "RECEPTION",
      team: "Réception",
      zone: "Quais",
      status: "ACTIVE",
      workedMinutes: 300,
      processedUnits: 96,
      workDate: now.toISOString()
    }
  ]
};

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.headers.authorization !== `Bearer ${API_KEY}`) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: "Unauthorized" }));
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const resource = url.pathname.replace(/^\/+|\/+$/g, "");

  if (!Object.prototype.hasOwnProperty.call(data, resource)) {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Unknown ERP resource" }));
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify(data[resource]));
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`ORGANIA_ERP_CERT_READY http://127.0.0.1:${PORT}`);
});