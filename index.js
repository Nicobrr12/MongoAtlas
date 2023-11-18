const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
require('dotenv').config();

const PUERTO = 8000;
const uri = process.env.MONGO_URI;
const cliente = new MongoClient(uri);

async function conectar() {
  try {
    await cliente.connect();
    await cliente.db("ListaTareas").command({ ping: 1 });
    console.log("Conexión a MongoDB establecida");
  } catch (error) {
    console.log(error);
  }
}

conectar();
app.use(express.json());

app.get("/Tareas", async (req, res) => {
  try {
    const db = cliente.db("ListaTareas");
    const coleccion = db.collection("Tareas");
    const listaTareas = await coleccion.find().toArray();
    res.send(listaTareas);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error interno del servidor");
  }
});

app.post("/AgregarTarea", async (req, res) => {
  const data = req.body;
  try {
    const db = cliente.db("ListaTareas");
    const coleccion = db.collection("Tareas");
    const resultado = await coleccion.insertOne(data);
    res.send(resultado);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error interno del servidor");
  }
});

app.put("/ActualizarTarea/:id", async (req, res) => {
  const id = req.params.id;
  const { Descripcion } = req.body;
  try {
    const db = cliente.db("ListaTareas");
    const coleccion = db.collection("Tareas");
    const resultado = await coleccion.updateOne(
      { _id: new ObjectId(id) },
      { $set: { Descripcion } }
    );
    res.send(resultado);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error interno del servidor");
  }
});

app.delete("/EliminarTarea/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const db = cliente.db("ListaTareas");
    const coleccion = db.collection("Tareas");
    const resultado = await coleccion.deleteOne({ _id: new ObjectId(id) });
    res.send(resultado);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error interno del servidor");
  }
});

app.listen(PUERTO, () => {
  console.log(`http://localhost:${PUERTO}`);
});
