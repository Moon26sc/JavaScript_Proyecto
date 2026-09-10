class Usuario {
  constructor(idUsuario, nombre, email, telefono, password) {
    this.idUsuario = idUsuario;
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.password = password;
  }

  iniciarSesion() { console.log(`${this.nombre} ha iniciado sesión.`); }
  cerrarSesion() { console.log(`${this.nombre} ha cerrado sesión.`); }
}

class Cliente extends Usuario {
  constructor(idUsuario, nombre, email, telefono, password, direccionEntrega, puntosFidelidad = 0) {
    super(idUsuario, nombre, email, telefono, password);
    this.direccionEntrega = direccionEntrega;
    this.puntosFidelidad = puntosFidelidad;
    this.carritoActivo = null;
  }

  agregarAlCarrito(item) {}
  consultarHistorial() {}
  acumularPuntos(puntos) { this.puntosFidelidad += puntos; }
}

class Admin extends Usuario {
  constructor(idUsuario, nombre, email, telefono, password) {
    super(idUsuario, nombre, email, telefono, password);
  }

  actualizarMenu() {}
  gestionarProductos() {}
  gestionarUsuarios() {}
  consultarReportes() {}
}

class Cajero extends Usuario {
  constructor(idUsuario, nombre, email, telefono, password, turno) {
    super(idUsuario, nombre, email, telefono, password);
    this.turno = turno;
  }

  registrarVenta() {}
  emitirComprobante() {}
  gestionarPedidoMostrador() {}
}

class CategoriaProducto {
  constructor(idCategoria, nombre, descripcion) {
    this.idCategoria = idCategoria;
    this.nombre = nombre;
    this.descripcion = descripcion;
  }
}

class Personalizacion {
  constructor(idPersonalizacion, nombre, costoExtra) {
    this.idPersonalizacion = idPersonalizacion;
    this.nombre = nombre;
    this.costoExtra = costoExtra;
  }
}

class Producto {
  constructor(idProducto, nombre, descripcion, precio, tamanio, disponible, tipo, categoria) {
    this.idProducto = idProducto;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.tamanio = tamanio;
    this.disponible = disponible;
    this.tipo = tipo;
    this.categoria = categoria; 
    this.personalizaciones = [];
  }

  actualizarPrecio(nuevoPrecio) { this.precio = nuevoPrecio; }
  cambiarDisponibilidad(estado) { this.disponible = estado; }
}

class Menu {
  constructor(idMenu, nombre, fechaVigencia, estado) {
    this.idMenu = idMenu;
    this.nombre = nombre;
    this.fechaVigencia = fechaVigencia;
    this.estado = estado;
    this.productos = [];
  }

  publicar() {}
  actualizar() {}
}

class ItemCarrito {
  constructor(producto, cantidad, precioUnitario) {
    this.producto = producto; 
    this.cantidad = cantidad;
    this.precioUnitario = precioUnitario;
    this.subtotal = this.cantidad * this.precioUnitario;
  }
}

class Carrito {
  constructor(idCarrito, fechaCreacion, estado) {
    this.idCarrito = idCarrito;
    this.fechaCreacion = fechaCreacion;
    this.estado = estado;
    this.total = 0.0;
    this.items = []; 
  }

  agregarItem(itemCarrito) { this.items.push(itemCarrito); }
  eliminarItem(idProducto) {}
  calcularTotal() {}
  vaciar() { this.items = []; }
}

class Promocion {
  constructor(idPromocion, nombre, descuento, fechaInicio, fechaFin) {
    this.idPromocion = idPromocion;
    this.nombre = nombre;
    this.descuento = descuento;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
  }

  aplicar(total) { return total - (total * this.descuento); }
}

class ItemPedido {
  constructor(producto, cantidad, precioUnitario) {
    this.producto = producto; 
    this.cantidad = cantidad;
    this.precioUnitario = precioUnitario;
    this.subtotal = this.cantidad * this.precioUnitario;
  }
}

class Pedido {
  constructor(idPedido, fecha, estado, tipoEntrega) {
    this.idPedido = idPedido;
    this.fecha = fecha;
    this.estado = estado;
    this.tipoEntrega = tipoEntrega;
    this.total = 0.0;
    this.items = []; 
    this.pago = null;
  }

  confirmar() {}
  cancelar() {}
  actualizarEstado(nuevoEstado) { this.estado = nuevoEstado; }
}

class Pago {
  constructor(idPago, fecha, monto, metodo, estado) {
    this.idPago = idPago;
    this.fecha = fecha;
    this.monto = monto;
    this.metodo = metodo;
    this.estado = estado;
  }

  procesar() {}
  reembolsar() {}
}

class Comprobante {
  constructor(idComprobante, tipo, serie, numero, fechaEmision, total, pedidoReferencia) {
    this.idComprobante = idComprobante;
    this.tipo = tipo;
    this.serie = serie;
    this.numero = numero;
    this.fechaEmision = fechaEmision;
    this.total = total;
    this.pedido = pedidoReferencia; 
  }

  emitir() {}
  anular() {}
}