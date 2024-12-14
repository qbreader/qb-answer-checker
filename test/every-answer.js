import 'dotenv/config';

import { MongoClient } from 'mongodb';
import checkAnswer from '../lib/check-answer.js';

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME || 'geoffreywu42'}:${process.env.MONGODB_PASSWORD || 'password'}@qbreader.0i7oej9.mongodb.net/?retryWrites=true&w=majority`;
export const mongoClient = new MongoClient(uri);

await mongoClient.connect();
console.log('connected to mongodb');

export const qbreader = mongoClient.db('qbreader');

const total = await qbreader.collection('tossups').countDocuments();
let count = 0;
const cursor = qbreader.collection('tossups').find({});
let current = await cursor.next();
while (current) {
  count++;
  if (count % 1000 === 0) {
    console.log(`${count} / ${total}`);
  }
  const { answer, answer_sanitized: answerSanitized } = current;
  try {
    checkAnswer(answer, answerSanitized);
    current = await cursor.next();
  } catch (e) {
    console.log({ answer, answerSanitized });
    console.error(e);
    break;
  }
}
