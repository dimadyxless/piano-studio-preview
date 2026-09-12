/* Интерактив и три анимационные сцены (GSAP + ScrollTrigger). */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const html = document.documentElement, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (!hasGsap || reduce) html.classList.add('no-anim');
  window.__anim = true;
  const page = document.body.dataset.page;

  /* меню */
  const burger = $('.nav__burger'), menu = $('#menu');
  if (burger && menu) {
    const close = () => { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
    burger.addEventListener('click', () => { const o = !menu.classList.contains('is-open'); menu.classList.toggle('is-open', o); burger.setAttribute('aria-expanded', String(o)); document.body.style.overflow = o ? 'hidden' : ''; if (o) $('a', menu).focus(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) { close(); burger.focus(); } });
    $$('a', menu).forEach(a => a.addEventListener('click', close));
  }

  /* лайтбокс галереи */
  const lb = $('#lightbox'); let gallery = null, items = [], idx = 0, lastFocus = null;
  const media = $('.lightbox__media', lb), cap = $('.lightbox__cap', lb);
  const loadGallery = () => gallery ? Promise.resolve(gallery) : fetch('gallery.json').then(r => r.json()).then(g => (gallery = g));
  function render() {
    const it = items[idx], d = gallery[it.id]; media.innerHTML = '';
    if (d.video) { const v = document.createElement('video'); v.src = d.video; v.poster = d.poster; v.controls = true; v.playsInline = true; v.preload = 'none'; v.setAttribute('playsinline', ''); media.appendChild(v); v.play().catch(() => {}); }
    else { const im = new Image(); im.src = d.webp || d.src; im.alt = d.alt || ''; im.width = d.w; im.height = d.h; im.onerror = () => { im.src = d.src; }; media.appendChild(im); }
    cap.textContent = it.cap || d.cap || '';
    if (hasGsap && !reduce) gsap.fromTo(media, { opacity: 0, scale: .96 }, { opacity: 1, scale: 1, duration: .4, ease: 'power2.out' });
  }
  function openLb(list, i) { items = list; idx = i; lastFocus = document.activeElement; loadGallery().then(() => { lb.hidden = false; document.body.style.overflow = 'hidden'; render(); $('.lightbox__close', lb).focus(); }); }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ''; media.innerHTML = ''; if (lastFocus) lastFocus.focus(); }
  const step = d => { idx = (idx + d + items.length) % items.length; render(); };
  if (lb) {
    $('.lightbox__close', lb).addEventListener('click', closeLb); $('.lightbox__nav--prev', lb).addEventListener('click', () => step(-1)); $('.lightbox__nav--next', lb).addEventListener('click', () => step(1));
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb(); else if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'Tab') { const f = $$('button, video', lb), first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
    });
    const posters = $$('[data-lb], [data-video]');
    const list = posters.map(el => ({ id: el.dataset.lb || el.dataset.video, cap: el.dataset.cap || ($('figcaption', el) || {}).textContent }));
    posters.forEach((el, i) => {
      el.tabIndex = 0; el.setAttribute('role', 'button');
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', (el.dataset.video ? 'Смотреть видео: ' : 'Открыть: ') + (list[i].cap || '').trim());
      const go = () => openLb(list, i);
      el.addEventListener('click', go); el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
  }

  /* FAQ */
  $$('.faq').forEach(f => f.addEventListener('toggle', e => { if (e.target.open) $$('details[open]', f).forEach(d => { if (d !== e.target) d.open = false; }); }, true));

  /* контакты: выбранная программа */
  const sel = $('[data-selected]');
  if (sel) { const slug = new URLSearchParams(location.search).get('program'); const names = { mozart: 'Моцарт на подушках', art: 'Воспитание искусством', children: 'Фортепиано для детей', teens: 'Фортепиано для подростков', adults: 'Фортепиано для взрослых', 'free-piano': 'Свободное фортепиано', solfeggio: 'Сольфеджио просто', masterclass: 'Музыкальный мастер-класс', marathon: 'Моя мама — лучший педагог' }; if (slug && names[slug]) { $('b', sel).textContent = names[slug]; sel.hidden = false; } }

  /* СЦЕНА 2: табло программ — фильтры и раскрытие строк */
  const filters = $('.filters');
  if (filters) {
    const marker = $('.filters__marker', filters), btns = $$('.filters__btn', filters), rows = $$('.row'), count = $('[data-count]');
    const moveMarker = b => { marker.style.width = b.offsetWidth + 'px'; marker.style.transform = `translate(${b.offsetLeft - 4}px, ${b.offsetTop - 4}px)`; };
    moveMarker(btns[0]); addEventListener('resize', () => moveMarker(btns.find(b => b.getAttribute('aria-selected') === 'true')));
    function apply(key) {
      btns.forEach(b => b.setAttribute('aria-selected', String(b.dataset.aud === key))); moveMarker(btns.find(b => b.dataset.aud === key));
      const show = rows.filter(r => key === 'all' || r.dataset.aud.split(' ').includes(key)), hide = rows.filter(r => !show.includes(r));
      const done = () => { hide.forEach(r => (r.hidden = true)); show.forEach(r => { r.hidden = false; r.classList.add('is-in'); }); count.textContent = show.length;
        if (hasGsap && !reduce) gsap.fromTo(show, { y: 16, opacity: 0, clipPath: 'inset(0 0 100% 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: .55, stagger: .06, ease: 'power3.out', overwrite: true, clearProps: 'all' });
        else if (hasGsap) gsap.set(show, { clearProps: 'all' }); };
      if (hasGsap && !reduce && hide.length) gsap.to(hide, { opacity: 0, y: -8, duration: .2, ease: 'power1.in', overwrite: true, onComplete: done }); else done();
    }
    btns.forEach(b => b.addEventListener('click', () => apply(b.dataset.aud)));
    filters.addEventListener('keydown', e => { const i = btns.indexOf(document.activeElement); if (i < 0) return; if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const n = btns[(i + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length]; n.focus(); apply(n.dataset.aud); } });
    if (hasGsap && !reduce) ScrollTrigger.batch(rows, { start: 'top 90%', once: true, onEnter: els => { els.forEach(e => e.classList.add('is-in')); gsap.fromTo(els, { clipPath: 'inset(0 0 100% 0)', y: 20 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: .75, stagger: .1, ease: 'power3.out', clearProps: 'all' }); } });
    else rows.forEach(e => e.classList.add('is-in'));
  }

  if (!hasGsap || reduce) return;
  const mm = gsap.matchMedia();

  /* СЦЕНА 1: главная — живая афиша в геометрии референса */
  if (page === 'index.html') {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to('.hero__art', { opacity: 1, x: 0, duration: 1.1 }, 0)
      .to('.hero__title .line > span', { y: 0, duration: .9, stagger: .14 }, .1)
      .to('.hero__sub', { opacity: 1, duration: .5 }, .7)
      .to('.hero__cta', { opacity: 1, duration: .4 }, .8);
    mm.add({ isDesktop: '(min-width: 901px)', isMobile: '(max-width: 900px)' }, ctx => {
      const d = ctx.conditions.isDesktop, st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero__text', { y: d ? -50 : -20, ease: 'none', scrollTrigger: st });
      gsap.to('.hero__art img', { y: d ? 60 : 24, scale: 1.06, ease: 'none', scrollTrigger: st });
    });
    ScrollTrigger.batch('.tile', { start: 'top 85%', once: true, onEnter: els => { els.forEach(e => e.classList.add('is-in')); gsap.fromTo(els, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .75, stagger: .12, ease: 'power3.out', clearProps: 'clipPath' }); } });
    gsap.from('.pricing__head', { y: 20, opacity: 0, duration: .7, scrollTrigger: { trigger: '.pricing', start: 'top 80%', once: true } });
  }
  /* завершающая графическая композиция (карточка записи перед футером) — короткое раскрытие */
  $$('.tune__art').forEach(a => ScrollTrigger.create({ trigger: a, start: 'top 85%', once: true, onEnter: () => { a.classList.add('is-in'); gsap.fromTo(a, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: .9, ease: 'power3.out', clearProps: 'clipPath' }); } }));
  gsap.from('.footer__staff', { scaleX: 0, transformOrigin: 'left', duration: .9, ease: 'power2.out', scrollTrigger: { trigger: '.footer', start: 'top 95%', once: true } });

  /* СЦЕНА 3: стена постеров */
  if (page === 'life.html') {
    mm.add({ isDesktop: '(min-width: 901px)', isMobile: '(max-width: 900px)' }, ctx => {
      const d = ctx.conditions.isDesktop;
      $$('.wall__grid').forEach(grid => {
        const its = $$('.wall__item', grid);
        gsap.set(its, { opacity: 0, x: i => (d ? 50 : 20) * (i % 3 - 1), y: i => (d ? 60 : 26) + (i % 2) * 16, rotate: i => (i % 2 ? 1.5 : -1.5) });
        ScrollTrigger.create({ trigger: grid, start: 'top 85%', once: true, onEnter: () => gsap.to(its, { opacity: 1, x: 0, y: 0, rotate: 0, duration: .9, stagger: .08, ease: 'power3.out', onComplete: () => its.forEach(el => { const depth = +el.dataset.depth || 1; gsap.fromTo(el, { y: (d ? 18 : 7) * depth }, { y: -(d ? 18 : 7) * depth, ease: 'none', scrollTrigger: { trigger: grid, start: 'top bottom', end: 'bottom top', scrub: true } }); }) }) });
      });
    });
  }

  /* мягкие появления секций */
  $$('.why, .courses, .teacher, .pathcard, .quote, .stats, .who, .facts, .how, .next, .channels').forEach(s => gsap.from(s.children, { y: 22, opacity: 0, duration: .7, stagger: .07, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 85%', once: true } }));
  $$('.about__art img, .phero__art img').forEach(im => gsap.fromTo(im, { y: -16 }, { y: 16, ease: 'none', scrollTrigger: { trigger: im.closest('div'), start: 'top bottom', end: 'bottom top', scrub: true } }));
})();
