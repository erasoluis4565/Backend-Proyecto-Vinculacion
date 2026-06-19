const Noticia = require('./noticia.model');

// Genera un slug limpio a partir del título (minúsculas, sin tildes ni espacios)
const generarSlug = (texto) =>
  texto.toString().toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita tildes
    .replace(/[^a-z0-9\s-]/g, '')                     // quita caracteres raros
    .replace(/\s+/g, '-')                             // espacios -> guiones
    .replace(/-+/g, '-');                             // colapsa guiones

class NoticiaService {

  /**
   * 1. GET /api/noticias
   * Catálogo público: solo noticias PUBLICADAS, proyección ligera (Script 12).
   */
  async obtenerTodas(filtros = {}) {
    const query = { estado: 'PUBLICADO' };

    // Filtro opcional por categoría: ?categoria=Proyecto
    if (filtros.categoria) {
      query.categoria = filtros.categoria;
    }

    const proyeccion = 'slug titulo resumen portada fechaPublicacion categoria';

    return await Noticia.find(query)
      .select(proyeccion)
      .sort({ fechaPublicacion: -1 }); // más recientes primero
  }

  /**
   * 2. GET /api/noticias/:slug
   * Ficha completa de una noticia publicada.
   */
  async obtenerPorSlug(slug) {
    return await Noticia.findOne({ slug, estado: 'PUBLICADO' });
  }

  /**
   * 3. POST /api/admin/noticias
   * Crea una noticia. Si no envían slug, se genera del título.
   */
  async crear(data) {
    if (!data.slug && data.titulo) {
      data.slug = generarSlug(data.titulo);
    }

    const existe = await Noticia.findOne({ slug: data.slug });
    if (existe) {
      const error = new Error('Ya existe una noticia con ese slug');
      error.statusCode = 409; // Conflicto
      throw error;
    }

    const nueva = new Noticia({
      ...data,
      fechaPublicacion: data.fechaPublicacion || new Date(),
      fechaActualizacion: new Date()
    });

    return await nueva.save();

    // NOTA (cruce con módulo Notificaciones - Integrante 6):
    // Según la guía, al publicar una noticia se debe generar una notificación
    // tipo "NUEVA_NOTICIA". Eso lo dispara el módulo de notificaciones cuando
    // exista; aquí no se acopla para no romper la separación de módulos.
  }

  /**
   * 4. PUT /api/admin/noticias/:id
   * Actualiza una noticia existente.
   */
  async actualizar(id, data) {
    data.fechaActualizacion = new Date();

    return await Noticia.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
  }

  /**
   * 5. DELETE /api/admin/noticias/:id
   * Eliminación lógica (pasa a estado INACTIVO).
   */
  async eliminar(id) {
    return await Noticia.findByIdAndUpdate(
      id,
      { estado: 'INACTIVO', fechaActualizacion: new Date() },
      { new: true }
    );
  }
}

// Instancia única (Singleton), igual que el módulo plantas
module.exports = new NoticiaService();
