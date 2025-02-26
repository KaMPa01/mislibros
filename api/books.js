// /api/books.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  const client = await connectToDatabase();
  const db = client.db("mi_libreria"); // Asegúrate de cambiarlo por el nombre real
  
  if (req.method === "GET") {
    try {
      const books = await db.collection("books").find().toArray();
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ error: "Error obteniendo libros" });
    }
  } else if (req.method === "POST") {
    try {
      const newBook = req.body;
      const result = await db.collection("books").insertOne(newBook);
      // Nota: en versiones recientes de MongoDB Node Driver, 'result.ops[0]' podría no estar disponible. Ajusta según la versión.
      res.status(200).json(result.ops ? result.ops[0] : newBook);
    } catch (error) {
      res.status(500).json({ error: "Error creando el libro" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
