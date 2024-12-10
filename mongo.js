import { MongoClient } from "mongodb";
import { Router } from "express";

const router = Router();
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

router.get("/mongo", async (req, res) => {
    try {
        // Conectar al cliente
        await client.connect();
        
        // Seleccionar la base de datos y colección
        const database = client.db("libros");
        const collection = database.collection("filosofia");

        // Obtener los documentos y convertirlos a un arreglo
        const resultado = await collection.find().toArray();

        // Enviar el resultado como respuesta
        console.log("Colección:", resultado);
        res.json(resultado); // Enviar como JSON
    } catch (error) {
        console.error("Error al conectar con MongoDB:", error);
        res.status(500).send("Error al conectar con MongoDB");
    } finally {
        // Cerrar el cliente
        await client.close();
    }
});

export default router;
