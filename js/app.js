
document.addEventListener("DOMContentLoaded", () => {

  const anioActual = document.querySelector("#anioActual");
  if (anioActual) {
    anioActual.textContent = new Date().getFullYear();
  }

  
  function formatearMoneda(valor) {
    return `S/ ${valor.toFixed(2)}`;
  }


  function marcarInvalido(input, idMensaje, mensaje) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    const mensajeEl = document.querySelector(`#${idMensaje}`);
    if (mensajeEl) mensajeEl.textContent = mensaje;
  }

  function marcarValido(input, idMensaje) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    const mensajeEl = document.querySelector(`#${idMensaje}`);
    if (mensajeEl) mensajeEl.textContent = "";
  }


  const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const REGEX_SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/;


  const PORCENTAJES_PROPINA = [10, 15, 20];

  function validarMontoConsumo(montoTexto) {
    const montoLimpio = montoTexto.trim();

    if (montoLimpio === "") {
      throw new Error("Ingresa el monto de tu consumo.");
    }

    const monto = Number(montoLimpio);

    if (Number.isNaN(monto)) {
      throw new Error("El monto debe ser un número (usa solo dígitos y punto decimal).");
    }

    if (monto <= 0) {
      throw new Error("El monto debe ser mayor a 0.");
    }

    return monto;
  }

  function calcularPropina(monto, porcentaje) {
    const propina = (monto * porcentaje) / 100;
    const total = monto + propina;
    return { propina: propina, total: total };
  }

  function mensajeSegunMonto(monto) {
    let mensaje;

    if (monto < 20) {
      mensaje = "Gracias por tu visita a Cherry Café ☕";
    } else if (monto <= 50) {
      mensaje = "¡Buena elección! Esperamos verte pronto de nuevo.";
    } else {
      mensaje = "¡Gracias por una compra especial en Cherry Café!";
    }

    return mensaje;
  }

  const formPropina = document.querySelector("#formPropina");
  const resultadoPropina = document.querySelector("#resultadoPropina");
  const mensajePropina = document.querySelector("#mensajePropina");
  const errorPropina = document.querySelector("#errorPropina");

  if (formPropina && resultadoPropina) {
    formPropina.addEventListener("submit", (event) => {
      event.preventDefault();

      const inputMonto = document.querySelector("#propinaMonto");

      try {
        const monto = validarMontoConsumo(inputMonto.value);

        inputMonto.classList.remove("is-invalid");
        inputMonto.classList.add("is-valid");
        errorPropina.textContent = "";

        resultadoPropina.innerHTML = "";

        for (let i = 0; i < PORCENTAJES_PROPINA.length; i++) {
          const porcentaje = PORCENTAJES_PROPINA[i];
          const resultado = calcularPropina(monto, porcentaje);

          const fila = document.createElement("li");
          fila.className = "list-group-item d-flex justify-content-between";
          fila.innerHTML = `
            <span>Propina ${porcentaje}%</span>
            <span class="fw-semibold">S/ ${resultado.propina.toFixed(2)} (Total: S/ ${resultado.total.toFixed(2)})</span>`;
          resultadoPropina.appendChild(fila);

          console.log(`Consumo: S/ ${monto.toFixed(2)} | Propina ${porcentaje}%: S/ ${resultado.propina.toFixed(2)} | Total: S/ ${resultado.total.toFixed(2)}`);
        }

        mensajePropina.textContent = mensajeSegunMonto(monto);
        mensajePropina.classList.remove("text-danger");
        mensajePropina.classList.add("text-success");

      } catch (error) {
        console.error("Error en calculadora de propina:", error.message);
        inputMonto.classList.remove("is-valid");
        inputMonto.classList.add("is-invalid");
        errorPropina.textContent = error.message;
        resultadoPropina.innerHTML = '<li class="list-group-item text-secondary">Corrige el monto para ver las opciones.</li>';
        mensajePropina.textContent = "";
      }
    });
  }


  /* =========================================================
     1) CARRITO DE PEDIDO
     ========================================================= */

  class Carrito {
    constructor(claveGuardado) {
      this.claveGuardado = claveGuardado;
      this.items = this.cargar();
    }

    cargar() {
      try {
        const datosGuardados = localStorage.getItem(this.claveGuardado);
        return datosGuardados ? JSON.parse(datosGuardados) : [];
      } catch (error) {
        console.error("No se pudo leer el pedido guardado:", error.message);
        return [];
      }
    }

    guardar() {
      localStorage.setItem(this.claveGuardado, JSON.stringify(this.items));
    }

    agregar(producto) {
      if (!producto.nombre || Number.isNaN(producto.precio)) {
        throw new Error("Producto inválido: falta nombre o precio.");
      }
      const existente = this.items.find(item => item.nombre === producto.nombre);
      if (existente) {
        existente.cantidad += 1;
      } else {
        this.items.push({ ...producto, cantidad: 1 });
      }
      this.guardar();
    }

    eliminar(nombre) {
      this.items = this.items.filter(item => item.nombre !== nombre);
      this.guardar();
    }

    vaciar() {
      this.items = [];
      this.guardar();
    }

    calcularTotal() {
      return this.items.reduce((acumulado, item) => acumulado + item.precio * item.cantidad, 0);
    }

    contarProductos() {
      return this.items.reduce((acumulado, item) => acumulado + item.cantidad, 0);
    }
  }

  const carrito = new Carrito("cherryCafeCarrito");

  function renderizarCarrito() {
    const contador = document.querySelector("#carritoContador");
    const lista = document.querySelector("#carritoLista");
    const total = document.querySelector("#carritoTotal");
    const vacio = document.querySelector("#carritoVacio");
    if (!contador || !lista || !total) return;

    contador.textContent = carrito.contarProductos();

    lista.innerHTML = "";
    if (carrito.items.length === 0) {
      vacio.classList.remove("d-none");
    } else {
      vacio.classList.add("d-none");
      carrito.items.forEach(item => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
          <div>
            <div class="fw-semibold">${item.nombre}</div>
            <div class="small text-secondary">${item.cantidad} x ${formatearMoneda(item.precio)}</div>
          </div>
          <button type="button" class="btn btn-sm btn-outline-dark btn-quitar" data-nombre="${item.nombre}">
            <i class="bi bi-x-lg"></i>
          </button>`;
        lista.appendChild(li);
      });
    }

    total.textContent = formatearMoneda(carrito.calcularTotal());
  }

  renderizarCarrito();


  document.querySelectorAll(".btn-comprar").forEach(boton => {
    boton.addEventListener("click", () => {
      try {
        const nombre = boton.dataset.nombre;
        const precio = Number(boton.dataset.precio);
        carrito.agregar({ nombre, precio });
        renderizarCarrito();


        const textoOriginal = boton.innerHTML;
        boton.innerHTML = '<i class="bi bi-check2"></i> Agregado';
        boton.disabled = true;
        setTimeout(() => {
          boton.innerHTML = textoOriginal;
          boton.disabled = false;
        }, 900);
      } catch (error) {
        console.error(error);
        alert(`No se pudo agregar el producto: ${error.message}`);
      }
    });
  });


  const listaCarrito = document.querySelector("#carritoLista");
  if (listaCarrito) {
    listaCarrito.addEventListener("click", (event) => {
      const boton = event.target.closest(".btn-quitar");
      if (!boton) return;
      carrito.eliminar(boton.dataset.nombre);
      renderizarCarrito();
    });
  }

  const btnVaciarCarrito = document.querySelector("#btnVaciarCarrito");
  if (btnVaciarCarrito) {
    btnVaciarCarrito.addEventListener("click", () => {
      carrito.vaciar();
      renderizarCarrito();
    });
  }

  const btnFinalizarPedido = document.querySelector("#btnFinalizarPedido");
  if (btnFinalizarPedido) {
    btnFinalizarPedido.addEventListener("click", () => {
      try {
        if (carrito.items.length === 0) {
          throw new Error("Tu pedido está vacío. Agrega algún producto del menú primero.");
        }
        alert(`¡Gracias! Tu pedido por ${formatearMoneda(carrito.calcularTotal())} fue registrado.`);
        carrito.vaciar();
        renderizarCarrito();
      } catch (error) {
        alert(error.message);
      }
    });
  }


  const buscadorMenu = document.querySelector("#buscadorMenu");
  const filtroCategorias = document.querySelector("#filtroCategorias");
  const resultadoBusqueda = document.querySelector("#resultadoBusqueda");

  if (buscadorMenu && filtroCategorias) {
    let categoriaActiva = "todas";

    function aplicarFiltros() {
      const texto = buscadorMenu.value.trim().toLowerCase();
      const tarjetas = Array.from(document.querySelectorAll("[data-categoria] > [data-nombre]"));

      let visibles = 0;
      tarjetas.forEach(tarjeta => {
        const nombre = tarjeta.dataset.nombre.toLowerCase();
        const categoriaTarjeta = tarjeta.closest("[data-categoria]").dataset.categoria;

        const coincideTexto = nombre.includes(texto);
        const coincideCategoria = categoriaActiva === "todas" || categoriaTarjeta === categoriaActiva;
        const visible = coincideTexto && coincideCategoria;

        tarjeta.style.display = visible ? "" : "none";
        if (visible) visibles += 1;
      });


      document.querySelectorAll("[data-categoria]").forEach(fila => {
        const quedanVisibles = Array.from(fila.children).some(hijo => hijo.style.display !== "none");
        fila.style.display = quedanVisibles ? "" : "none";
        const titulo = fila.previousElementSibling;
        if (titulo && titulo.tagName === "H4") {
          titulo.style.display = quedanVisibles ? "" : "none";
        }
      });

      resultadoBusqueda.textContent = texto || categoriaActiva !== "todas"
        ? `${visibles} producto(s) encontrado(s).`
        : "";
    }

    buscadorMenu.addEventListener("input", aplicarFiltros);

    filtroCategorias.querySelectorAll("button").forEach(boton => {
      boton.addEventListener("click", () => {
        filtroCategorias.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        boton.classList.add("active");
        categoriaActiva = boton.dataset.categoria;
        aplicarFiltros();
      });
    });
  }


  /* =========================================================
     4) VALIDACIÓN DE FORMULARIOS
     ========================================================= */


  const formContacto = document.querySelector("#formContacto");
  if (formContacto) {
    formContacto.addEventListener("submit", (event) => {
      event.preventDefault();

      const nombre = document.querySelector("#nombre");
      const correo = document.querySelector("#correo");
      const mensaje = document.querySelector("#mensaje");
      const alerta = document.querySelector("#alertaContacto");

      try {
        if (!REGEX_SOLO_LETRAS.test(nombre.value.trim())) {
          marcarInvalido(nombre, "errorNombre", "Escribe tu nombre (solo letras, mínimo 2 caracteres).");
          throw new Error("Revisa el campo de nombre.");
        }
        marcarValido(nombre, "errorNombre");

        if (!REGEX_CORREO.test(correo.value.trim())) {
          marcarInvalido(correo, "errorCorreo", "Ingresa un correo válido, ej: nombre@correo.com");
          throw new Error("Revisa el campo de correo.");
        }
        marcarValido(correo, "errorCorreo");

        if (mensaje.value.trim().length < 10) {
          marcarInvalido(mensaje, "errorMensaje", "Cuéntanos un poco más (mínimo 10 caracteres).");
          throw new Error("Revisa el campo de mensaje.");
        }
        marcarValido(mensaje, "errorMensaje");


        const datosContacto = {
          nombre: nombre.value.trim(),
          correo: correo.value.trim().toLowerCase(),
          mensaje: mensaje.value.trim(),
          fecha: new Date().toISOString()
        };
        console.log("Mensaje de contacto:", JSON.stringify(datosContacto));

        alerta.textContent = `¡Gracias, ${datosContacto.nombre}! Recibimos tu mensaje y te responderemos pronto.`;
        alerta.classList.remove("d-none", "alert-danger");
        alerta.classList.add("alert", "alert-success");

        formContacto.reset();
        [nombre, correo, mensaje].forEach(campo => campo.classList.remove("is-valid"));
      } catch (error) {
        console.error(error.message);
        alerta.textContent = "Revisa los campos marcados en rojo antes de enviar.";
        alerta.classList.remove("d-none", "alert-success");
        alerta.classList.add("alert", "alert-danger");
      }
    });
  }


  const btnLoginSubmit = document.querySelector("#btnLoginSubmit");
  if (btnLoginSubmit) {
    btnLoginSubmit.addEventListener("click", () => {
      const correo = document.querySelector("#loginCorreo");
      const password = document.querySelector("#loginPassword");
      const mensaje = document.querySelector("#mensajeLogin");

      try {
        if (!REGEX_CORREO.test(correo.value.trim())) {
          marcarInvalido(correo, "errorLoginCorreo", "Ingresa un correo válido.");
          throw new Error("Correo inválido.");
        }
        marcarValido(correo, "errorLoginCorreo");

        if (password.value.length < 6) {
          marcarInvalido(password, "errorLoginPassword", "La contraseña debe tener mínimo 6 caracteres.");
          throw new Error("Contraseña inválida.");
        }
        marcarValido(password, "errorLoginPassword");

        mensaje.textContent = "¡Bienvenido/a de nuevo a Cherry Café!";
        mensaje.classList.remove("text-danger");
        mensaje.classList.add("text-success");

        setTimeout(() => {
          const modalEl = document.querySelector("#modalLogin");
          const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
          modal.hide();
          document.querySelector("#formLogin").reset();
          [correo, password].forEach(campo => campo.classList.remove("is-valid"));
          mensaje.textContent = "";
          window.location.href = 'perfil.html';
        }, 900);
      } catch (error) {
        mensaje.textContent = "Revisa los campos marcados en rojo.";
        mensaje.classList.remove("text-success");
        mensaje.classList.add("text-danger");
      }
    });
  }

  const btnRegistroSubmit = document.querySelector("#btnRegistroSubmit");
  if (btnRegistroSubmit) {
    btnRegistroSubmit.addEventListener("click", () => {
      const nombre = document.querySelector("#registroNombre");
      const correo = document.querySelector("#registroCorreo");
      const password = document.querySelector("#registroPassword");
      const password2 = document.querySelector("#registroPassword2");
      const mensaje = document.querySelector("#mensajeRegistro");

      try {
        if (!REGEX_SOLO_LETRAS.test(nombre.value.trim())) {
          marcarInvalido(nombre, "errorRegistroNombre", "Escribe tu nombre completo (solo letras).");
          throw new Error("Nombre inválido.");
        }
        marcarValido(nombre, "errorRegistroNombre");

        if (!REGEX_CORREO.test(correo.value.trim())) {
          marcarInvalido(correo, "errorRegistroCorreo", "Ingresa un correo válido.");
          throw new Error("Correo inválido.");
        }
        marcarValido(correo, "errorRegistroCorreo");

        if (password.value.length < 6) {
          marcarInvalido(password, "errorRegistroPassword", "Mínimo 6 caracteres.");
          throw new Error("Contraseña inválida.");
        }
        marcarValido(password, "errorRegistroPassword");

        if (password.value !== password2.value || password2.value === "") {
          marcarInvalido(password2, "errorRegistroPassword2", "Las contraseñas no coinciden.");
          throw new Error("Las contraseñas no coinciden.");
        }
        marcarValido(password2, "errorRegistroPassword2");

        mensaje.textContent = `¡Cuenta creada! Te esperamos pronto, ${nombre.value.trim().split(" ")[0]}.`;
        mensaje.classList.remove("text-danger");
        mensaje.classList.add("text-success");

        setTimeout(() => {
          const modalEl = document.querySelector("#modalRegistro");
          const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
          modal.hide();
          document.querySelector("#formRegistro").reset();
          [nombre, correo, password, password2].forEach(campo => campo.classList.remove("is-valid"));
          mensaje.textContent = "";
        }, 900);
      } catch (error) {
        mensaje.textContent = "Revisa los campos marcados en rojo.";
        mensaje.classList.remove("text-success");
        mensaje.classList.add("text-danger");
      }
    });
  }

  const btnConfirmarReserva = document.querySelector("#btnConfirmarReserva");
  if (btnConfirmarReserva) {
    btnConfirmarReserva.addEventListener("click", () => {
      const nombre = document.querySelector("#reservaNombre");
      const fecha = document.querySelector("#reservaFecha");
      const personas = document.querySelector("#reservaPersonas");
      const mensaje = document.querySelector("#mensajeReserva");

      try {
        if (!REGEX_SOLO_LETRAS.test(nombre.value.trim())) {
          marcarInvalido(nombre, "errorReservaNombre", "Escribe tu nombre completo.");
          throw new Error("Nombre inválido.");
        }
        marcarValido(nombre, "errorReservaNombre");

        const hoy = new Date().toISOString().split("T")[0];
        if (!fecha.value || fecha.value < hoy) {
          marcarInvalido(fecha, "errorReservaFecha", "Elige una fecha válida (hoy o después).");
          throw new Error("Fecha inválida.");
        }
        marcarValido(fecha, "errorReservaFecha");

        if (!personas.value) {
          marcarInvalido(personas, "errorReservaPersonas", "Selecciona el número de personas.");
          throw new Error("Faltan personas.");
        }
        marcarValido(personas, "errorReservaPersonas");

        mensaje.textContent = `Reserva confirmada para ${nombre.value.trim()} el ${fecha.value}.`;
        mensaje.classList.remove("text-danger");
        mensaje.classList.add("text-success");

        setTimeout(() => {
          const modalEl = document.querySelector("#modalReserva");
          const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
          modal.hide();
          document.querySelector("#formReserva").reset();
          [nombre, fecha, personas].forEach(campo => campo.classList.remove("is-valid"));
          mensaje.textContent = "";
        }, 1000);
      } catch (error) {
        mensaje.textContent = "Revisa los campos marcados en rojo.";
        mensaje.classList.remove("text-success");
        mensaje.classList.add("text-danger");
      }
    });
  }

});
