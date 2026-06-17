const Planta = require('./planta.model');

class PlantaService {

  /**
   * 1. GET /api/plantas
   * Obtiene el catálogo de plantas activas.
   * Basado en el Script 12 de la guía de MongoDB.
   */
  async obtenerTodas(filtros = {}) {
    // Siempre solo mostramos plantas activas al público
    const query = { estado: 'ACTIVO' };

    // Filtros opcionales (ej: ?familia=Lamiaceae)
    if (filtros.familia) {
      query['taxonomia.familia'] = filtros.familia;
    }

    // Proyección exacta solicitada en el Script 12 para optimizar la respuesta
    const proyeccion = 'slug nombreComun nombreCientifico taxonomia.familia multimediaPrincipal.imagenUrl';

    const plantas = await Planta.find(query)
      .select(proyeccion)
      .sort({ nombreComun: 1 }); // Orden alfabético

    return plantas;
  }

  /**
   * 2. GET /api/plantas/:slug
   * Obtiene la ficha completa de una planta específica.
   * Basado en el Script 12 de la guía de MongoDB.
   */
  async obtenerPorSlug(slug) {
    const planta = await Planta.findOne({ 
      slug: slug, 
      estado: 'ACTIVO' 
    });
    
    return planta; // Si no existe, retorna null
  }

  /**
   * 3.  Crea una nueva planta. Incluye validaciones de negocio.
   */
  async crearPlanta(data) {
    // Regla de negocio: El slug y el nombre científico deben ser únicos
    const existe = await Planta.findOne({
      $or: [
        { slug: data.slug },
        { nombreCientifico: data.nombreCientifico }
      ]
    });

    if (existe) {
      const error = new Error('Ya existe una planta con ese slug o nombre científico');
      error.statusCode = 409; // Código HTTP para Conflicto
      throw error;
    }

    // Crear el documento con las fechas de registro
    const nuevaPlanta = new Planta({
      ...data,
      fechaRegistro: new Date(),
      fechaActualizacion: new Date()
    });

    return await nuevaPlanta.save();
  }

  /** 
   * 4 Actualiza una planta existente.
   */
  async actualizarPlanta(id, data) {
    // Regla de negocio: Actualizar la fecha de modificación
    data.fechaActualizacion = new Date();

    const plantaActualizada = await Planta.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true } // new:true devuelve el doc actualizado
    );

    return plantaActualizada;
  }

  /**
   * Eliminación Lógica.
   */
  async eliminarPlanta(id) {
    const planta = await Planta.findByIdAndUpdate(
      id,
      { 
        estado: 'INACTIVO', 
        fechaActualizacion: new Date() 
      },
      { new: true }
    );

    return planta;
  }
}

// Exportamos una instancia única de la clase (Singleton)
module.exports = new PlantaService();