let plataformaActual = "xbox";
let noticiasActuales = [];
let vistaCompacta = false;
let favoritosGuardados = JSON.parse(localStorage.getItem("gamepatch_favs") || "[]");

const juegosSteam = [
    { appid: 1245620, nombre: "Elden Ring" },
    { appid: 730, nombre: "Counter-Strike 2" },
    { appid: 1086940, nombre: "Baldur's Gate 3" },
    { appid: 570, nombre: "Dota 2" },
    { appid: 1172470, nombre: "Apex Legends" }
];

const datosConsolas = {
    xbox: [
        {
            juego: "Halo Infinite",
            version: "Actualización Operación",
            fecha: "Actualizado recientemente",
            resumen: "Nuevos mapas multijugador añadidos a la rotación competitiva y ajustes de balance en armas.",
            detalleCompleto: "• Nuevos mapas incorporados a la lista Arena Clasificatoria.\n• Ajuste de retroceso y cadencia en el Rifle de Batalla BR75.\n• Corrección de desincronización en partidas personalizadas.\n• Mejoras de rendimiento y estabilidad en Xbox Series X|S.",
            url: ["https://www", "halowaypoint", "com"].join(".") + "/news"
        },
        {
            juego: "Forza Horizon 5",
            version: "Nueva Serie Mensual",
            fecha: "Actualizado esta semana",
            resumen: "Nuevos vehículos deportivos en el festival, eventos de temporada y mejoras visuales.",
            detalleCompleto: "• 4 nuevos autos desbloqueables mediante la lista de reproducción del festival.\n• Nuevas rutas de EventLab creadas por la comunidad.\n• Optimización en tiempos de carga rápida (Quick Resume) en consolas Xbox.",
            url: ["https://forza", "net"].join(".") + "/news"
        },
        {
            juego: "Gears 5 / E-Day Intel",
            version: "Parche de Mantenimiento",
            fecha: "Actualizado hace 3 días",
            resumen: "Mejoras en los servidores dedicados de Xbox Live y rotación de eventos Horda.",
            detalleCompleto: "• Estabilización de latencia en servidores de Norteamérica y Latinoamérica.\n• Doble XP activo durante todo el fin de semana en modo Horda y Escape.\n• Corrección de errores menores en tarjetas de habilidad.",
            url: ["https://www", "gears5", "com"].join(".")
        },
        {
            juego: "Starfield",
            version: "Parche v1.14",
            fecha: "Actualizado hace 4 días",
            resumen: "Mejoras en el vehículo terrestre REV-8, ajustes de iluminación y soporte ampliado de creaciones.",
            detalleCompleto: "• Mayor control de suspensión y turbo para el vehículo de exploración REV-8.\n• Nuevas opciones de rendimiento a 60 FPS en Xbox Series X.\n• Corrección de misiones bloqueadas en facciones secundarias.",
            url: ["https://bethesda", "net"].join(".") + "/es/game/starfield"
        }
    ],
    playstation: [
        {
            juego: "Helldivers 2",
            version: "Parche 01.001.202",
            fecha: "Actualizado hoy",
            resumen: "Rebalanceo de estratagemas orbitales, ajustes en enemigos pesados y mejoras de conexión en PS5.",
            detalleCompleto: "• Reducción en el tiempo de enfriamiento del Ataque Orbital de Precisión.\n• Ajuste de blindaje en Cargadores y Titanes de Bilis.\n• Solución a cierres inesperados al unirse a escuadrones mediante juego cruzado (Crossplay).",
            url: ["https://blog", "playstation", "com"].join(".")
        },
        {
            juego: "Astro Bot",
            version: "Parche 1.08",
            fecha: "Actualizado hace 2 días",
            resumen: "Nuevos niveles de velocidad (Speedrun) añadidos gratuitamente y nuevos bots especiales para rescatar.",
            detalleCompleto: "• Nuevos circuitos contrarreloj con tablas de clasificación mundial en PSN.\n• 10 nuevos bots VIP inspirados en clásicos de PlayStation.\n• Mejoras en la vibración háptica y gatillos adaptativos del control DualSense.",
            url: ["https://blog", "playstation", "com"].join(".")
        },
        {
            juego: "God of War Ragnarök",
            version: "Actualización v6.02",
            fecha: "Actualizado hace 5 días",
            resumen: "Ajustes de estabilidad en el modo Valhalla y correcciones de audio 3D.",
            detalleCompleto: "• Optimización de memoria durante combates prolongados en Valhalla.\n• Corrección en diálogos de Mimir que no se activaban al usar ciertos amuletos.\n• Mejoras de compatibilidad con pantallas VRR en PS5.",
            url: ["https://www", "playstation", "com"].join(".")
        },
        {
            juego: "Marvel's Spider-Man 2",
            version: "Parche 1.004",
            fecha: "Actualizado esta semana",
            resumen: "Nuevos trajes disponibles, mejoras en el modo Foto y corrección de errores en Nueva Partida+.",
            detalleCompleto: "• Añadidos nuevos estilos de color para trajes simbiontes.\n• Corrección de texturas en cinemáticas nocturnas de Nueva York.\n• Estabilidad mejorada en el modo fidelidad con Ray Tracing.",
            url: ["https://insomniac", "games"].join(".")
        }
    ]
};

function mostrarSkeletons(cantidad = 6) {
    const contenedor = document.getElementById("contenedor-noticias");
    contenedor.innerHTML = "";
    for (let i = 0; i < cantidad; i++) {
        contenedor.innerHTML += `
            <div class="skeleton-card">
                <div class="skel-box" style="height: 140px; width: 100%;"></div>
                <div class="skel-box" style="height: 22px; width: 70%;"></div>
                <div class="skel-box" style="height: 14px; width: 40%;"></div>
                <div class="skel-box" style="height: 45px; width: 100%;"></div>
            </div>
        `;
    }
}

function actualizarContadorFavs() {
    const el = document.getElementById("contador-favs");
    if (el) el.textContent = favoritosGuardados.length;
}

function esFavorito(nombreJuego) {
    return favoritosGuardados.some(f => f.juego === nombreJuego);
}

function toggleFavorito(evento, item) {
    evento.stopPropagation();
    const existe = favoritosGuardados.findIndex(f => f.juego === item.juego);
    if (existe >= 0) {
        favoritosGuardados.splice(existe, 1);
    } else {
        favoritosGuardados.push(item);
    }
    localStorage.setItem("gamepatch_favs", JSON.stringify(favoritosGuardados));
    actualizarContadorFavs();

    if (plataformaActual === "favoritos") {
        noticiasActuales = [...favoritosGuardados];
    }
    renderizarTarjetas(noticiasActuales);
}

function alternarVista() {
    vistaCompacta = !vistaCompacta;
    const grid = document.getElementById("contenedor-noticias");
    const btn = document.getElementById("btn-cambiar-vista");
    if (vistaCompacta) {
        grid.classList.add("vista-compacta");
        btn.textContent = "⊞ Vista Tarjetas";
    } else {
        grid.classList.remove("vista-compacta");
        btn.textContent = "☰ Vista Compacta";
    }
}

async function obtenerNoticiasSteamEnVivo() {
    actualizarEstado("⏳ Descargando parches reales...", "#facc15");
    mostrarSkeletons(5);
    const resultados = [];

    for (const juego of juegosSteam) {
        try {
            const dominioApi = ["https://api", "steampowered", "com"].join(".");
            const ruta = "/ISteamNews/GetNewsForApp/v2/?appid=" + juego.appid + "&count=1&maxlength=600";
            const respuesta = await fetch("/api/proxy?url=" + encodeURIComponent(dominioApi + ruta));
            const dataSteam = await respuesta.json();

            if (dataSteam.appnews && dataSteam.appnews.newsitems && dataSteam.appnews.newsitems.length > 0) {
                const noticia = dataSteam.appnews.newsitems[0];
                const fechaObj = new Date(noticia.date * 1000);
                const fechaFormateada = fechaObj.toLocaleDateString("es-MX", {
                    day: "numeric", month: "short", year: "numeric"
                });

                const textoLimpio = noticia.contents.replace(/<[^>]*>?/gm, "").trim();
                const dominioImg = ["https://cdn", "akamai", "steamstatic", "com"].join(".");

                resultados.push({
                    appid: juego.appid,
                    juego: juego.nombre,
                    imagen: dominioImg + "/steam/apps/" + juego.appid + "/header.jpg",
                    version: noticia.title.slice(0, 26) + (noticia.title.length > 26 ? "..." : ""),
                    fecha: `Publicado: ${fechaFormateada}`,
                    resumen: textoLimpio.slice(0, 140) + "...",
                    detalleCompleto: `${noticia.title}\n\n${textoLimpio}`,
                    url: noticia.url,
                    esBusquedaGlobal: true
                });
            }
        } catch (error) {
            console.error("Error cargando juego:", juego.nombre, error);
        }
    }

    const hora = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
    actualizarEstado(`● En vivo (${hora})`, "#4ade80");
    return resultados;
}

async function buscarJuegoEnInternet() {
    const termino = document.getElementById("input-juego-global").value.trim();
    if (!termino) return;

    actualizarEstado(`⏳ Buscando "${termino}"...`, "#facc15");
    mostrarSkeletons(6);

    try {
        const dominioStore = ["https://store", "steampowered", "com"].join(".");
        const rutaBusqueda = "/api/storesearch/?term=" + encodeURIComponent(termino) + "&l=spanish&cc=MX";
        const resp = await fetch("/api/proxy?url=" + encodeURIComponent(dominioStore + rutaBusqueda));
        const data = await resp.json();

        if (!data.items || data.items.length === 0) {
            document.getElementById("contenedor-noticias").innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #f87171;">No se encontraron resultados para "${termino}".</p>`;
            actualizarEstado("● Sin resultados", "#f87171");
            return;
        }

        const resultados = data.items.slice(0, 6).map(item => ({
            appid: item.id,
            juego: item.name,
            imagen: item.tiny_image ? item.tiny_image.replace("capsule_sm_120", "header") : "",
            version: item.price ? `$${(item.price.final / 100).toFixed(2)} MXN` : "Gratis / Sin precio",
            fecha: `ID Steam: ${item.id}`,
            resumen: "Haz clic aquí para ver galería de capturas, sinopsis completa y sus últimas noticias.",
            detalleCompleto: "Cargando descripción oficial del juego...",
            url: dominioStore + "/app/" + item.id,
            esBusquedaGlobal: true
        }));

        noticiasActuales = resultados;
        renderizarTarjetas(noticiasActuales);
        actualizarEstado(`● ${resultados.length} juegos encontrados`, "#4ade80");

    } catch (error) {
        console.error(error);
        document.getElementById("contenedor-noticias").innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #f87171;">Error al conectar con el buscador. Intenta de nuevo.</p>`;
        actualizarEstado("● Error de conexión", "#f87171");
    }
}

async function cargarFichaCompletaJuego(item) {
    document.getElementById("modal-cuerpo").textContent = "⏳ Descargando sinopsis, capturas de pantalla y últimas noticias...";
    const galeriaEl = document.getElementById("modal-galeria");
    galeriaEl.innerHTML = "";
    galeriaEl.classList.add("oculto");

    try {
        const dominioStore = ["https://store", "steampowered", "com"].join(".");
        const detailsApi = dominioStore + "/api/appdetails?appids=" + item.appid + "&l=spanish";
        const respDetails = await fetch("/api/proxy?url=" + encodeURIComponent(detailsApi));
        const rawDetails = await respDetails.json();
        const appData = rawDetails[item.appid];

        let textoFinal = "";

        if (appData && appData.success) {
            const info = appData.data;
            const generos = info.genres ? info.genres.map(g => g.description).join(", ") : "No especificado";
            const devs = info.developers ? info.developers.join(", ") : "Desconocido";
            const fechaLanzamiento = info.release_date ? info.release_date.date : "Desconocida";

            if (info.screenshots && info.screenshots.length > 0) {
                info.screenshots.slice(0, 5).forEach(cap => {
                    const imgCap = document.createElement("img");
                    imgCap.src = cap.path_thumbnail;
                    imgCap.onclick = () => { document.getElementById("modal-imagen").src = cap.path_full; };
                    galeriaEl.appendChild(imgCap);
                });
                galeriaEl.classList.remove("oculto");
            }

            textoFinal += `📖 DE QUÉ TRATA:\n${info.short_description}\n\n`;
            textoFinal += `🏷️ Géneros: ${generos}\n`;
            textoFinal += `🛠️ Desarrollador: ${devs}\n`;
            textoFinal += `📅 Lanzamiento: ${fechaLanzamiento}\n`;
        } else {
            textoFinal += "No se pudo obtener la descripción detallada en español.\n";
        }

        const dominioApi = ["https://api", "steampowered", "com"].join(".");
        const newsApi = dominioApi + "/ISteamNews/GetNewsForApp/v2/?appid=" + item.appid + "&count=1&maxlength=500";
        const respNews = await fetch("/api/proxy?url=" + encodeURIComponent(newsApi));
        const newsData = await respNews.json();

        if (newsData.appnews && newsData.appnews.newsitems && newsData.appnews.newsitems.length > 0) {
            const ultimaNoticia = newsData.appnews.newsitems[0];
            const limpio = ultimaNoticia.contents.replace(/<[^>]*>?/gm, "").trim();
            textoFinal += `\n────────────────────\n📰 ÚLTIMA ACTUALIZACIÓN / NOTICIA:\n${ultimaNoticia.title}\n\n${limpio}`;
        } else {
            textoFinal += `\n────────────────────\n📰 Este juego no tiene noticias recientes registradas.`;
        }

        document.getElementById("modal-cuerpo").textContent = textoFinal;
        document.getElementById("btn-traducir").classList.remove("oculto");

    } catch (e) {
        document.getElementById("modal-cuerpo").textContent = "Ocurrió un error al descargar los detalles del juego.";
    }
}

async function traducirContenidoModal() {
    const cuerpoEl = document.getElementById("modal-cuerpo");
    const btn = document.getElementById("btn-traducir");
    const textoOriginal = cuerpoEl.textContent;

    btn.textContent = "⏳ Traduciendo...";
    btn.disabled = true;

    try {
        const resp = await fetch("/api/translate?text=" + encodeURIComponent(textoOriginal));
        const data = await resp.json();
        if (data.translated) {
            cuerpoEl.textContent = data.translated;
            btn.textContent = "✅ Traducido al Español";
        }
    } catch (e) {
        btn.textContent = "❌ Error al traducir";
    }
}

function actualizarEstado(texto, color) {
    const el = document.getElementById("estado-actualizacion");
    if (el) {
        el.textContent = texto;
        el.style.color = color;
    }
}

function renderizarTarjetas(lista) {
    const contenedor = document.getElementById("contenedor-noticias");
    contenedor.innerHTML = "";

    if (!lista || lista.length === 0) {
        const msg = plataformaActual === "favoritos"
            ? "Aún no tienes juegos favoritos. Haz clic en la estrella ⭐ de cualquier juego para guardarlo aquí."
            : "No hay elementos para mostrar.";
        contenedor.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #94a3b8;">${msg}</p>`;
        return;
    }

    lista.forEach((item) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = `card ${plataformaActual}`;
        tarjeta.onclick = () => abrirModal(item);

        const imgHtml = item.imagen ? `<img src="${item.imagen}" alt="${item.juego}" class="card-img" onerror="this.style.display='none'">` : "";
        const favActivo = esFavorito(item.juego);

        const btnFav = document.createElement("button");
        btnFav.className = `btn-fav-card ${favActivo ? "activo" : ""}`;
        btnFav.textContent = favActivo ? "★" : "☆";
        btnFav.title = favActivo ? "Quitar de favoritos" : "Guardar en favoritos";
        btnFav.onclick = (e) => toggleFavorito(e, item);

        tarjeta.innerHTML = `
            <div>
                ${imgHtml}
                <div class="card-top">
                    <h2>${item.juego}</h2>
                    <span class="version">${item.version}</span>
                </div>
                <span class="fecha">${item.fecha}</span>
                <p>${item.resumen}</p>
            </div>
            <span class="leer-mas">Clic para ver galería, sinopsis y detalles →</span>
        `;

        tarjeta.appendChild(btnFav);
        contenedor.appendChild(tarjeta);
    });
}

function abrirModal(item) {
    document.getElementById("modal-etiqueta").textContent = plataformaActual === "buscar_global" ? "FICHA DE JUEGO" : plataformaActual.toUpperCase();
    document.getElementById("modal-titulo").textContent = item.juego;
    document.getElementById("modal-fecha").textContent = `${item.version} • ${item.fecha}`;
    document.getElementById("modal-cuerpo").textContent = item.detalleCompleto;
    document.getElementById("modal-link").href = item.url;

    const btnTraducir = document.getElementById("btn-traducir");
    btnTraducir.textContent = "🌐 Traducir notas al Español";
    btnTraducir.disabled = false;
    btnTraducir.classList.remove("oculto");

    document.getElementById("modal-galeria").classList.add("oculto");

    const imgEl = document.getElementById("modal-imagen");
    if (item.imagen) {
        imgEl.src = item.imagen;
        imgEl.classList.remove("oculto");
    } else {
        imgEl.classList.add("oculto");
    }

    document.getElementById("modal-detalle").classList.remove("oculto");

    if (item.esBusquedaGlobal && item.appid) {
        cargarFichaCompletaJuego(item);
    }
}

function cerrarModal(evento) {
    if (evento.target.id === "modal-detalle") {
        cerrarModalDirecto();
    }
}

function cerrarModalDirecto() {
    document.getElementById("modal-detalle").classList.add("oculto");
}

function filtrarNoticias() {
    const texto = document.getElementById("input-busqueda").value.toLowerCase();
    const filtradas = noticiasActuales.filter(item =>
        item.juego.toLowerCase().includes(texto) ||
        item.resumen.toLowerCase().includes(texto) ||
        item.detalleCompleto.toLowerCase().includes(texto)
    );
    renderizarTarjetas(filtradas);
}

async function cambiarPlataforma(plataforma, botonSeleccionado) {
    plataformaActual = plataforma;
    document.getElementById("input-busqueda").value = "";

    const botones = document.querySelectorAll(".tab-btn");
    botones.forEach(btn => btn.classList.remove("active"));
    if (botonSeleccionado) botonSeleccionado.classList.add("active");

    const cajaLocal = document.getElementById("caja-filtro-local");
    const cajaGlobal = document.getElementById("caja-busqueda-global");

    if (plataforma === "buscar_global") {
        cajaLocal.classList.add("oculto");
        cajaGlobal.classList.remove("oculto");
        document.getElementById("contenedor-noticias").innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #94a3b8;">Escribe el nombre de cualquier videojuego arriba y presiona <b>Enter</b> o <b>Buscar</b>.</p>`;
        actualizarEstado("● Buscador Global Listo", "#a855f7");
        return;
    } else {
        cajaGlobal.classList.add("oculto");
        cajaLocal.classList.remove("oculto");
    }

    if (plataforma === "favoritos") {
        noticiasActuales = [...favoritosGuardados];
        actualizarEstado(`● ${noticiasActuales.length} guardados`, "#f59e0b");
    } else if (plataforma === "steam") {
        noticiasActuales = await obtenerNoticiasSteamEnVivo();
    } else {
        noticiasActuales = datosConsolas[plataforma];
        const hora = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
        actualizarEstado(`● Actualizado (${hora})`, "#4ade80");
    }

    renderizarTarjetas(noticiasActuales);
}

function forzarActualizacion() {
    if (plataformaActual === "buscar_global") {
        buscarJuegoEnInternet();
    } else if (plataformaActual !== "favoritos") {
        const botonActivo = document.querySelector(".tab-btn.active");
        cambiarPlataforma(plataformaActual, botonActivo);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorFavs();
    const primerBoton = document.querySelector(".tab-btn.active");
    cambiarPlataforma("xbox", primerBoton);
    setInterval(() => {
        if (plataformaActual !== "buscar_global" && plataformaActual !== "favoritos") {
            forzarActualizacion();
        }
    }, 300000);
});

