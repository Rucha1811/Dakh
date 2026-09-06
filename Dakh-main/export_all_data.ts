import * as data from './src/data/mockData.ts';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('../backend/data_backup');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const collections = {
  users: data.USERS,
  sellers: data.SELLERS,
  products: data.PRODUCTS,
  orders: data.ORDERS,
  shipments: data.SHIPMENTS,
  documents: data.DOCUMENTS,
  dnks: data.DNKS,
  notifications: data.NOTIFICATIONS,
  support_tickets: data.SUPPORT_TICKETS,
  compliance_rules: data.COMPLIANCE_RULES,
  export_journey_steps: data.EXPORT_JOURNEY_STEPS,
  assistant_qa: data.ASSISTANT_QA
};

for (const [name, records] of Object.entries(collections)) {
  if (records && Array.isArray(records)) {
    const filePath = path.join(outDir, `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(records, null, 2), 'utf-8');
    console.log(`Exported ${records.length} records to ${name}.json`);
  }
}
