const LEAD_ENDPOINT = 'https://lead-relay.leestygpt.workers.dev/lead/HD3SLN6F5L';
const TG_LINK = 'https://t.me/Lydmilagoro';
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const safe = fn => { try { fn(); } catch (e) { console.error(e); } };
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const NS = 'http://www.w3.org/2000/svg';
  const sv = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.append(e); return e; };
  const toForm = svc => {
    const s = $('#svc'); if (s && svc) s.value = svc;
    scrollTo({ top: $('#form').getBoundingClientRect().top + scrollY - 56, behavior: reduce ? 'auto' : 'smooth' });
  };

  const bar = $('#bar');
  const fb = () => bar.classList.toggle('show', scrollY > 30);
  addEventListener('scroll', fb, { passive: true }); fb();

  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const h = a.getAttribute('href'); if (h.length < 2) return;
    const t = $(h); if (!t) return;
    e.preventDefault();
    scrollTo({ top: t.getBoundingClientRect().top + scrollY - 56, behavior: reduce ? 'auto' : 'smooth' });
  }));

  // ===== hero: стол на пять мест =====
  safe(() => {
    const g = $('#seats'), cap = $('#seatCap'), fig = $('#table'), svg = $('svg', fig);
    const N = 5, cx = 220, cy = 228, rx = 178, ry = 128;
    for (let i = 0; i < N; i++) {
      const ang = -Math.PI / 2 + (i / N) * Math.PI * 2 + 0.31;
      const x = cx + rx * Math.cos(ang), y = cy + ry * Math.sin(ang);
      const free = i === 2;
      const s = sv('g', { class: 'seat ' + (free ? 'free' : 'taken'), transform: 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')' }, g);
      if (free) { sv('circle', { class: 'pulse', r: 36 }, s); s.setAttribute('tabindex', 0); s.setAttribute('role', 'button'); s.setAttribute('aria-label', 'Занять свободное место'); }
      sv('circle', { class: 'bd', r: 36 }, s);
      if (free) { const t = sv('text', { y: 7 }, s); t.textContent = '+'; }
      else { sv('circle', { class: 'hd', cx: 0, cy: -8, r: 9 }, s); sv('path', { class: 'hd', d: 'M-17 20a17 14 0 0 1 34 0z' }, s); }
    }
    const free = $('.seat.free', g);
    const take = () => {
      if (free.classList.contains('me')) return;
      free.classList.add('me');
      $$('.pulse', free).forEach(p => p.remove());
      sv('circle', { class: 'hd', cx: 0, cy: -8, r: 9 }, free); sv('path', { class: 'hd', d: 'M-17 20a17 14 0 0 1 34 0z' }, free);
      cap.textContent = 'Место занято вами. Осталось записаться';
      setTimeout(() => toForm('Пробное занятие (бесплатно)'), reduce ? 100 : 900);
    };
    free.addEventListener('click', take);
    free.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); take(); } });
    if (!reduce && matchMedia('(pointer:fine)').matches) {
      let tx = 0, ty = 0, cx0 = 0, cy0 = 0, raf = 0;
      const run = () => { cx0 += (tx - cx0) * .08; cy0 += (ty - cy0) * .08; svg.style.transform = 'rotateX(' + (cy0 * -8).toFixed(2) + 'deg) rotateY(' + (cx0 * 10).toFixed(2) + 'deg)'; raf = (Math.abs(tx - cx0) + Math.abs(ty - cy0) > .002) ? requestAnimationFrame(run) : 0; };
      addEventListener('pointermove', e => {
        const r = fig.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
        tx = clamp((e.clientX - (r.left + r.width / 2)) / innerWidth * 2, -1, 1); ty = clamp((e.clientY - (r.top + r.height / 2)) / innerHeight * 2, -1, 1);
        if (!raf) raf = requestAnimationFrame(run);
      }, { passive: true });
    }
  });

  // ===== scroll scene: проверка по критериям =====
  safe(() => {
    const stage = $('#stage'); if (!stage) return;
    const rows = $$('.ans'), steps = $$('#steps li'), scoreN = $('#scoreN');
    let last = -1;
    const apply = p => {
      let score = 0;
      rows.forEach((r, i) => {
        const w = 0.15 + 0.85 * clamp((p - 0.04) / 0.3 - i * 0.06);
        r.style.setProperty('--w', w.toFixed(3));
        const t = clamp((p - 0.42 - i * 0.12) / 0.1);
        r.style.setProperty('--t', t.toFixed(3));
        if (t > 0.98) score++;
      });
      scoreN.textContent = score;
      const st = p < 0.2 ? 0 : p < 0.42 ? 1 : p < 0.86 ? 2 : 3;
      if (st !== last) { last = st; steps.forEach((l, i) => l.classList.toggle('on', i === st)); }
    };
    if (reduce) { stage.classList.add('static'); apply(1); steps.forEach(l => l.classList.add('on')); return; }
    let tick = false;
    const upd = () => { tick = false; const r = stage.getBoundingClientRect(); apply(clamp(-r.top / Math.max(1, r.height - innerHeight))); };
    const on = () => { if (!tick) { tick = true; requestAnimationFrame(upd); } };
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', on); upd();
  });

  // ===== group advantages =====
  safe(() => {
    const D = [
      ['Чёткая программа', 'Занятия строятся по продуманному плану, который охватывает все ключевые темы экзамена. Нет хаотичного повторения, материал осваивается последовательно.'],
      ['Регулярная практика', 'Вы регулярно решаете экзаменационные задания, набиваете руку и привыкаете к формату. Это же тренировка тайм-менеджмента: учитесь распределять время между блоками заданий.'],
      ['Коллективный разбор ошибок', 'Разбор работ в группе помогает увидеть типичные пробелы и понять, почему ответ не засчитывается. Это критически важно для роста результата.'],
      ['Здоровая конкуренция', 'Рядом люди с похожим уровнем подготовки, и это мотивирует работать усерднее. Ещё один плюс: объясняя тему другому, вы усваиваете её глубже.'],
      ['Навык аргументации', 'В дискуссиях и обсуждениях вы учитесь выстраивать логичные, обоснованные ответы. Это напрямую влияет на оценку за вторую часть экзамена.'],
      ['Психологический комфорт', 'В группе из пяти человек легче держать дисциплину и регулярность, а ещё можно обсуждать стратегии преодоления стресса, и тревожность перед экзаменом снижается.']
    ];
    const n = $('#gN'), t = $('#gT'), p = $('#gP'), box = $('.gr__panel');
    $$('[data-g]').forEach(b => b.addEventListener('click', () => {
      $$('[data-g]').forEach(o => o.setAttribute('aria-selected', o === b));
      const i = +b.dataset.g;
      n.textContent = '0' + (i + 1); t.textContent = D[i][0]; p.textContent = D[i][1];
      box.classList.remove('sw'); void box.offsetWidth; box.classList.add('sw');
    }));
  });

  // ===== price =====
  safe(() => {
    const M = {
      one: ['1 500', 'Занятие в мини-группе, 60 минут', 'Группа до пяти человек, онлайн в Zoom.', 1, 'Пробное занятие (бесплатно)'],
      month: ['12 000', 'Абонемент на месяц: 8 занятий', 'Восемь занятий по 60 минут в мини-группе, онлайн в Zoom.', 8, 'Абонемент на месяц (8 занятий)']
    };
    const num = $('#pNum'), t = $('#pTitle'), x = $('#pText'), g = $('#pDots');
    let svc = M.one[4], raf;
    const dots = n => {
      g.textContent = '';
      for (let i = 0; i < 8; i++) sv('circle', { cx: 20 + i * 60, cy: 15, r: 8, fill: i < n ? '#D8372B' : '#F6F2E9', stroke: i < n ? '#D8372B' : 'rgba(28,43,75,.3)', 'stroke-width': 2 }, g);
    };
    const fmt = v => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const set = k => {
      const prev = parseInt(num.textContent.replace(/\D/g, ''), 10), to = parseInt(M[k][0].replace(/\D/g, ''), 10);
      svc = M[k][4]; t.textContent = M[k][1]; x.textContent = M[k][2]; dots(M[k][3]);
      cancelAnimationFrame(raf);
      if (reduce) { num.textContent = fmt(to); return; }
      const t0 = performance.now();
      const f = n => { const p = clamp((n - t0) / 700); num.textContent = fmt(prev + (to - prev) * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(f); };
      raf = requestAnimationFrame(f);
    };
    $$('[data-m]').forEach(b => b.addEventListener('click', () => set(b.dataset.m)));
    $('#pBtn').addEventListener('click', e => { e.preventDefault(); toForm(svc === M.one[4] ? 'Пробное занятие (бесплатно)' : svc); });
    dots(1);
  });

  // ===== form =====
  const form = $('#leadForm');
  form && form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]'), orig = btn.textContent, msg = $('#msg');
    const payload = {}; new FormData(form).forEach((v, k) => { payload[k] = v; });
    if (payload._gotcha) return;
    msg.textContent = '';
    if (!payload.name.trim() || !payload.contact.trim()) { msg.textContent = 'Укажите имя и телефон или Telegram.'; return; }
    if (!form.consent.checked) { msg.textContent = 'Отметьте согласие на обработку персональных данных.'; return; }
    payload.phone = payload.contact;
    payload.comment = 'Услуга: ' + payload.service + (payload.comment ? '. ' + payload.comment : '');
    delete payload.consent;
    const tgText = 'Заявка с сайта. Имя: ' + payload.name + '. Контакт: ' + payload.contact + '. ' + payload.comment;
    const tgLink = TG_LINK + '?text=' + encodeURIComponent(tgText);
    btn.disabled = true; btn.textContent = 'Отправляем...';
    const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const r = await fetch(LEAD_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: ctrl.signal });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      msg.textContent = 'Заявка отправлена. Скоро свяжемся.'; form.reset();
    } catch (err) {
      console.error(err);
      msg.textContent = 'Заявка не ушла автоматически. Отправьте её одним касанием в Telegram: ';
      const a = document.createElement('a'); a.href = tgLink; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'отправить в Telegram';
      msg.append(a, '. Текст уже готов, останется нажать «Отправить».');
    } finally {
      clearTimeout(timer); btn.disabled = false; btn.textContent = orig;
    }
  });
})();
