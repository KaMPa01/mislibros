// /api/libros.js
import { MongoClient } from "mongodb";

// URI de conexión a la base de datos
const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  const client = await connectToDatabase();
  const db = client.db("mi_libreria"); // El nombre de la base de datos

  if (req.method === "GET") {
    try {
      const books = await db.collection("books").find().toArray();
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ error: "Error obteniendo libros" });
    }
  } else if (req.method === "POST") {
    try {
      const newBook = req.body; // El libro enviado en el cuerpo de la solicitud
      const result = await db.collection("books").insertOne(newBook); // Insertar en la colección 'books'
      res.status(200).json(result.ops ? result.ops[0] : newBook); // Devolver el libro insertado
    } catch (error) {
      res.status(500).json({ error: "Error creando el libro" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
