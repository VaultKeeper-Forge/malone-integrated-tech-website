import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const html = await fs.readFile(new URL('../dist/services/index.html', import.meta.url), 'utf8');
const bodyText = html.replace(/<[^>]+>/g, ' ');
const structuredDataMatch = html.match(
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
);

assert.ok(structuredDataMatch, 'Services page must include JSON-LD structured data.');
const structuredData = JSON.parse(structuredDataMatch[1]);
const graph = structuredData['@graph'] ?? [];
const serviceList = graph.find((entry) => String(entry['@id'] ?? '').endsWith('#services'));

assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, 'Services page must have one h1.');
assert.equal(
  (html.match(/data-service-offer=/g) ?? []).length,
  14,
  'Services page must publish 14 primary offers.',
);
assert.equal(
  (html.match(/data-care-plan=/g) ?? []).length,
  3,
  'Services page must publish three care plans.',
);
assert.equal(
  serviceList?.itemListElement?.length,
  17,
  'Structured data must include 14 offers and three care plans.',
);

for (const required of [
  'Useful systems, clearly scoped.',
  'Business Systems Map',
  '$250',
  'Connected Business Website',
  '$2,500',
  'Managed Operations System',
  '$5,000–$10,000',
  '$100 / month',
]) {
  assert.ok(bodyText.includes(required), `Missing required public pricing content: ${required}`);
}

assert.doesNotMatch(
  bodyText,
  /internal floor|target margin|discount cap|labor cost|estimated hours/i,
  'Internal pricing controls leaked into the public services page.',
);

const systemsMap = serviceList.itemListElement.find(
  (entry) => entry.item?.name === 'Business Systems Map',
);
const managedOperations = serviceList.itemListElement.find(
  (entry) => entry.item?.name === 'Managed Operations System',
);
assert.equal(systemsMap?.item?.offers?.price, 250);
assert.equal(managedOperations?.item?.offers?.lowPrice, 5000);
assert.equal(managedOperations?.item?.offers?.highPrice, 10000);

console.log('Services build verified: 14 offers, 3 care plans, public/internal boundary intact.');

