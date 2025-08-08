// Simple in-memory JSON database for mock data.
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'core', 'mock');

function readEntity(entity: string) {
  const filePath = path.join(dataDir, `${entity}.json`);
  const text = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '[]';
  return JSON.parse(text);
}

function writeEntity(entity: string, data: any) {
  const filePath = path.join(dataDir, `${entity}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export function getAll(entity: string) {
  return readEntity(entity);
}

export function getById(entity: string, id: string | number) {
  const items = readEntity(entity);
  return items.find((item: any) => String(item.id) === String(id));
}

export function create(entity: string, item: any) {
  const items = readEntity(entity);
  const newItem = { id: Date.now(), ...item };
  items.push(newItem);
  writeEntity(entity, items);
  return newItem;
}

export function update(entity: string, id: string | number, updateData: any) {
  const items = readEntity(entity);
  const index = items.findIndex((item: any) => String(item.id) === String(id));
  if (index === -1) return null;
  items[index] = { ...items[index], ...updateData };
  writeEntity(entity, items);
  return items[index];
}

export function remove(entity: string, id: string | number) {
  let items = readEntity(entity);
  items = items.filter((item: any) => String(item.id) !== String(id));
  writeEntity(entity, items);
  return { success: true };
}