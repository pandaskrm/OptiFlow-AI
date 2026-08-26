const BASE = "http://127.0.0.1:4010";
const API_KEY = "organia-certification-v1";

const resources = [
  "orders",
  "receptions",
  "shipments",
  "stock",
  "employees"
];

async function run() {
  let success = true;

  for (const resource of resources) {
    const response = await fetch(
      `${BASE}/${resource}?updatedSince=2026-01-01T00:00:00.000Z`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
          "X-Company-Id": "LCA-CERTIFICATION"
        }
      }
    );

    if (!response.ok) {
      console.error(`FAIL ${resource}: HTTP ${response.status}`);
      success = false;
      continue;
    }

    const payload = await response.json();

    if (!Array.isArray(payload)) {
      console.error(`FAIL ${resource}: réponse non tableau`);
      success = false;
      continue;
    }

    console.log(`OK   ${resource.padEnd(12)} ${payload.length} élément(s)`);
  }

  const unauthorized = await fetch(`${BASE}/orders`);

  if (unauthorized.status === 401) {
    console.log("OK   sécurité      accès sans Bearer refusé");
  } else {
    console.error(
      `FAIL sécurité: HTTP ${unauthorized.status} au lieu de 401`
    );
    success = false;
  }

  if (!success) {
    console.error("\nCERTIFICATION ERP: ECHEC");
    process.exit(1);
  }

  console.log("\nCERTIFICATION ERP: OK");
}

run().catch((error) => {
  console.error("\nCERTIFICATION ERP: ECHEC");
  console.error(error);
  process.exit(1);
});