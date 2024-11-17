const { Low, JSONFile } = require('lowdb');
const FileAdapter = require('lowdb/adapters/FileSync');

// Create an adapter
const adapter = new FileAdapter('db.json');
export const db = new Low(adapter);