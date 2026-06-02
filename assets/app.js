/* Shared chrome + behavior for the Omnis Academia portfolio (multi-page).
   Injects: top bar, navbar, mobile menu, prev/next pager, footer, back-to-top, PDF modal.
   Wires: mobile menu, reveal-on-scroll, animated counters, navbar shadow, back-to-top, PDF viewer. */
(function () {
  "use strict";

  // Ordered list of division pages (drives the pager and the mobile menu).
  const PAGES = [
    { id: 'introduccion', file: 'introduccion.html', title: 'Introducción' },
    { id: 'empresa',      file: 'empresa.html',      title: 'La Empresa' },
    { id: 'cobit',        file: 'cobit.html',        title: 'Gobierno de TI · COBIT' },
    { id: 'caso',         file: 'caso-negocio.html', title: 'Caso de Negocio' },
    { id: 'cedula',       file: 'cedula.html',       title: 'Cédula de Servicio · ITIL' },
    { id: 'procesos',     file: 'procesos.html',     title: 'Mapeo de Procesos' },
    { id: 'activos',      file: 'activos.html',      title: 'Inventario de Activos' },
    { id: 'riesgos',      file: 'riesgos.html',      title: 'Matriz de Riesgos' },
    { id: 'bia',          file: 'bia.html',          title: 'Análisis de Impacto · BIA' },
    { id: 'continuidad',  file: 'continuidad.html',  title: 'Plan de Continuidad' },
    { id: 'factibilidad', file: 'factibilidad.html', title: 'Factibilidad' },
    { id: 'comercial',    file: 'comercial.html',    title: 'Análisis Comercial' },
    { id: 'equipo',       file: 'equipo.html',       title: 'Equipo' },
  ];

  const current = document.body.dataset.page || 'inicio';

  // Curated desktop nav.
  const NAV = [
    { file: 'index.html', id: 'inicio', label: 'Inicio' },
    { file: 'empresa.html', id: 'empresa', label: 'Empresa' },
    { file: 'cobit.html', id: 'cobit', label: 'COBIT' },
    { file: 'cedula.html', id: 'cedula', label: 'ITIL' },
    { file: 'procesos.html', id: 'procesos', label: 'Procesos' },
    { file: 'riesgos.html', id: 'riesgos', label: 'Riesgos' },
    { file: 'bia.html', id: 'bia', label: 'BIA' },
    { file: 'continuidad.html', id: 'continuidad', label: 'Continuidad' },
    { file: 'factibilidad.html', id: 'factibilidad', label: 'Factibilidad' },
    { file: 'equipo.html', id: 'equipo', label: 'Equipo' },
  ];

  const MOBILE = [{ file: 'index.html', id: 'inicio', label: 'Inicio' }]
    .concat(PAGES.map(function (p) { return { file: p.file, id: p.id, label: p.title }; }));

  const ICON = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"/><path stroke-linecap="round" stroke-linejoin="round" d="M14 3v6h5"/></svg>';

  /* ---------- HEADER ---------- */
  const navDesktop = NAV.map(function (i) {
    return '<a href="' + i.file + '" class="nav-link px-3 py-2 rounded-lg hover:text-guinda-700 transition' + (i.id === current ? ' active' : '') + '">' + i.label + '</a>';
  }).join('');

  const navMobile = MOBILE.map(function (i) {
    const act = i.id === current ? ' bg-guinda-50 text-guinda-700 font-semibold' : '';
    return '<a href="' + i.file + '" class="m-link px-3 py-2 rounded-lg hover:bg-slate-50' + act + '">' + i.label + '</a>';
  }).join('');

  const headerHTML =
    '<div class="bg-guinda-800 text-guinda-50 text-xs">' +
      '<div class="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between gap-3">' +
        '<p class="truncate"><span class="font-semibold">Instituto Politécnico Nacional</span><span class="hidden sm:inline text-guinda-200"> · Escuela Superior de Cómputo · ISC</span></p>' +
        '<p class="shrink-0 text-guinda-200">IT Governance · <span class="text-white font-semibold">7CV4</span></p>' +
      '</div>' +
    '</div>' +
    '<header id="nav" class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-shadow">' +
      '<nav class="max-w-7xl mx-auto px-4 sm:px-6">' +
        '<div class="flex items-center justify-between h-16">' +
          '<a href="index.html" class="flex items-center gap-2.5 shrink-0 group">' +
            '<span class="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-guinda-700 to-brand-600 text-white font-display font-extrabold shadow-sm group-hover:scale-105 transition">O</span>' +
            '<span class="leading-tight">' +
              '<span class="block font-display font-extrabold text-slate-900 tracking-tight">Omnis Academia</span>' +
              '<span class="block text-[10px] uppercase tracking-[.18em] text-slate-400">Portafolio · IT Governance</span>' +
            '</span>' +
          '</a>' +
          '<div class="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">' + navDesktop + '</div>' +
          '<button id="menuBtn" aria-label="Abrir menú" class="lg:hidden grid place-items-center h-10 w-10 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">' +
            '<svg id="menuOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>' +
            '<svg id="menuClose" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>' +
          '</button>' +
        '</div>' +
      '</nav>' +
      '<div id="mobileMenu" class="lg:hidden hidden border-t border-slate-200 bg-white">' +
        '<div class="px-4 py-3 grid grid-cols-2 gap-1 text-sm font-medium text-slate-600">' + navMobile + '</div>' +
      '</div>' +
    '</header>';

  document.body.insertAdjacentHTML('afterbegin', headerHTML);

  /* ---------- PAGER (division pages only) ---------- */
  let pagerHTML = '';
  if (current !== 'inicio') {
    const idx = PAGES.findIndex(function (p) { return p.id === current; });
    const prev = idx > 0 ? PAGES[idx - 1] : { file: 'index.html', title: 'Inicio' };
    const next = (idx >= 0 && idx < PAGES.length - 1) ? PAGES[idx + 1] : { file: 'index.html', title: 'Volver al índice' };
    pagerHTML =
      '<section class="bg-slate-50 border-t border-slate-100">' +
        '<div class="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-2 gap-4">' +
          '<a href="' + prev.file + '" class="group flex items-center gap-3 rounded-2xl ring-1 ring-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:ring-guinda-200 transition">' +
            '<span class="grid place-items-center h-9 w-9 shrink-0 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-guinda-100 group-hover:text-guinda-700 transition">←</span>' +
            '<span class="min-w-0"><span class="block text-xs text-slate-400">Anterior</span><span class="block font-display font-semibold text-slate-800 truncate">' + prev.title + '</span></span>' +
          '</a>' +
          '<a href="' + next.file + '" class="group flex items-center justify-end gap-3 rounded-2xl ring-1 ring-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:ring-guinda-200 transition text-right">' +
            '<span class="min-w-0"><span class="block text-xs text-slate-400">Siguiente</span><span class="block font-display font-semibold text-slate-800 truncate">' + next.title + '</span></span>' +
            '<span class="grid place-items-center h-9 w-9 shrink-0 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-guinda-100 group-hover:text-guinda-700 transition">→</span>' +
          '</a>' +
        '</div>' +
      '</section>';
  }

  /* ---------- FOOTER ---------- */
  const footerHTML =
    '<footer class="bg-slate-900 text-slate-300">' +
      '<div class="max-w-7xl mx-auto px-4 sm:px-6 py-14">' +
        '<div class="grid md:grid-cols-3 gap-10">' +
          '<div>' +
            '<div class="flex items-center gap-2.5">' +
              '<span class="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-guinda-600 to-brand-500 text-white font-display font-extrabold">O</span>' +
              '<span class="font-display font-extrabold text-white text-lg">Omnis Academia</span>' +
            '</div>' +
            '<p class="mt-4 text-sm text-slate-400 leading-relaxed max-w-xs">Plataforma de e-learning basada en rutas de aprendizaje. Portafolio del proyecto final de IT Governance.</p>' +
          '</div>' +
          '<div>' +
            '<h4 class="font-display font-semibold text-white">Navegación</h4>' +
            '<div class="mt-4 grid grid-cols-2 gap-y-2 text-sm">' +
              '<a href="empresa.html" class="hover:text-white transition">Empresa</a>' +
              '<a href="cobit.html" class="hover:text-white transition">COBIT</a>' +
              '<a href="cedula.html" class="hover:text-white transition">Cédula ITIL</a>' +
              '<a href="procesos.html" class="hover:text-white transition">Procesos</a>' +
              '<a href="riesgos.html" class="hover:text-white transition">Riesgos</a>' +
              '<a href="bia.html" class="hover:text-white transition">BIA</a>' +
              '<a href="continuidad.html" class="hover:text-white transition">Continuidad</a>' +
              '<a href="factibilidad.html" class="hover:text-white transition">Factibilidad</a>' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<h4 class="font-display font-semibold text-white">Institución</h4>' +
            '<ul class="mt-4 space-y-2 text-sm text-slate-400">' +
              '<li>Instituto Politécnico Nacional</li>' +
              '<li>Escuela Superior de Cómputo (ESCOM)</li>' +
              '<li>Ingeniería en Sistemas Computacionales</li>' +
              '<li>Grupo 7CV4 · Prof. Rocío Palacios Solano</li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">' +
          '<p>© 2026 Omnis Academia · Proyecto académico IPN · ESCOM.</p>' +
          '<p>IT Governance · COBIT 2019 · ITIL · ISO/IEC 27000</p>' +
        '</div>' +
      '</div>' +
    '</footer>';

  /* ---------- BACK TO TOP + PDF MODAL ---------- */
  const toTopHTML =
    '<button id="toTop" aria-label="Volver arriba" class="fixed bottom-6 right-6 z-50 hidden h-11 w-11 place-items-center rounded-full bg-guinda-700 text-white shadow-lg hover:bg-guinda-800 transition">' +
      '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>' +
    '</button>';

  const modalHTML =
    '<div id="pdfModal" class="fixed inset-0 z-[60] hidden">' +
      '<div id="pdfBackdrop" class="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"></div>' +
      '<div class="absolute inset-0 grid place-items-center p-3 sm:p-6">' +
        '<div class="relative flex w-full max-w-5xl h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">' +
          '<div class="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 sm:px-5 py-3">' +
            '<div class="min-w-0 flex items-center gap-3">' +
              '<span class="grid place-items-center h-9 w-9 shrink-0 rounded-lg bg-guinda-100 text-guinda-700">' +
                '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"/><path stroke-linecap="round" stroke-linejoin="round" d="M14 3v6h5"/></svg>' +
              '</span>' +
              '<div class="min-w-0">' +
                '<p id="pdfTitle" class="font-display font-bold text-slate-900 truncate">Documento</p>' +
                '<p class="text-xs text-slate-500">Visor de documento · PDF</p>' +
              '</div>' +
            '</div>' +
            '<div class="flex items-center gap-1.5 sm:gap-2 shrink-0">' +
              '<a id="pdfOpen" href="#" target="_blank" rel="noopener" class="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition">' +
                '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5h5v5M19 5l-7 7M12 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-5"/></svg>' +
                'Nueva pestaña' +
              '</a>' +
              '<a id="pdfDownload" href="#" download class="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition">' +
                '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>' +
                'Descargar' +
              '</a>' +
              '<button id="pdfClose" aria-label="Cerrar" class="grid place-items-center h-9 w-9 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition">' +
                '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>' +
              '</button>' +
            '</div>' +
          '</div>' +
          '<iframe id="pdfFrame" title="Visor de PDF" class="flex-1 w-full bg-slate-100" src="about:blank"></iframe>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.body.insertAdjacentHTML('beforeend', pagerHTML + footerHTML + toTopHTML + modalHTML);

  /* ---------- BEHAVIOR ---------- */
  // Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuOpen = document.getElementById('menuOpen');
  const menuClose = document.getElementById('menuClose');
  menuBtn.addEventListener('click', function () {
    const hidden = mobileMenu.classList.toggle('hidden');
    menuOpen.classList.toggle('hidden', !hidden);
    menuClose.classList.toggle('hidden', hidden);
  });
  document.querySelectorAll('.m-link').forEach(function (a) {
    a.addEventListener('click', function () {
      mobileMenu.classList.add('hidden'); menuOpen.classList.remove('hidden'); menuClose.classList.add('hidden');
    });
  });

  // Reveal on scroll
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // Animated counters
  const fmt = function (n) { return n.toLocaleString('en-US'); };
  const cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      const el = e.target; const to = +el.dataset.to; const dur = 1400; const t0 = performance.now();
      const tick = function (t) {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick); cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.count').forEach(function (c) { cio.observe(c); });

  // Navbar shadow + back to top
  const nav = document.getElementById('nav');
  const toTop = document.getElementById('toTop');
  const onScroll = function () {
    nav.classList.toggle('shadow-sm', window.scrollY > 8);
    toTop.classList.toggle('hidden', window.scrollY < 600);
    toTop.classList.toggle('grid', window.scrollY >= 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // PDF viewer modal
  const pdfModal = document.getElementById('pdfModal');
  const pdfFrame = document.getElementById('pdfFrame');
  const pdfTitle = document.getElementById('pdfTitle');
  const pdfOpen = document.getElementById('pdfOpen');
  const pdfDownload = document.getElementById('pdfDownload');
  const openPdf = function (url, title) {
    pdfFrame.src = url;
    pdfTitle.textContent = title || 'Documento';
    pdfOpen.href = url; pdfDownload.href = url;
    pdfModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };
  const closePdf = function () {
    pdfModal.classList.add('hidden');
    pdfFrame.src = 'about:blank';
    document.body.style.overflow = '';
  };
  document.querySelectorAll('[data-pdf]').forEach(function (btn) {
    btn.addEventListener('click', function () { openPdf(btn.getAttribute('data-pdf'), btn.getAttribute('data-pdf-title')); });
  });
  document.getElementById('pdfClose').addEventListener('click', closePdf);
  document.getElementById('pdfBackdrop').addEventListener('click', closePdf);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !pdfModal.classList.contains('hidden')) closePdf(); });
})();
