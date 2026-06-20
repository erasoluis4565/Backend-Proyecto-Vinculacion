const express = require('express');
const router = express.Router();
const Suscriptor = require('../models/Suscriptor');

router.post('/suscriptores', async (req, res) => {
  try {
    const { nombre, email } = req.body;
    if (!nombre || !email) {
      return res.status(400).json({ mensaje: 'Nombre y email obligatorios' });
    }
    const nuevo = new Suscriptor({ nombre, email });
    const guardado = await nuevo.save();
    res.status(201).json({ mensaje: 'Registrado', data: guardado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error', error: error.message });
  }
});

router.get('/admin/suscriptores', async (req, res) => {
  try {
    const suscriptores = await Suscriptor.find();
    res.json({ total: suscriptores.length, data: suscriptores });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error', error: error.message });
  }
});

router.delete('/admin/suscriptores/:id', async (req, res) => {
  try {
    const eliminado = await Suscriptor.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: 'No encontrado' });
    }
    res.json({ mensaje: 'Eliminado', data: eliminado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error', error: error.message });
  }
});

module.exports = router;