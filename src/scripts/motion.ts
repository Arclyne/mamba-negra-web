// Animaciones al hacer scroll: los títulos se "cortan" con la navaja y los bloques suben
// al entrar en pantalla. Solo afecta lo que está debajo del pliegue al cargar, y se
// desactiva por completo con "reducir movimiento" o sin IntersectionObserver.

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce && 'IntersectionObserver' in window) {
  const vh = window.innerHeight;
  const bajoElPliegue = (el: Element, f: number) => el.getBoundingClientRect().top >= vh * f;

  const cortar = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('cut'); cortar.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -15% 0px', threshold: 0.4 });

  document.querySelectorAll('h2.sec-title').forEach((h) => {
    if (!bajoElPliegue(h, 0.85)) return;
    h.setAttribute('data-cut', '');
    cortar.observe(h);
  });

  const selector = [
    '.strip li', '.section .sec-head', '.rev-top', '.rev', '.about-grid > *', '.stats > div',
    '#nosotros blockquote', '.sub', '.corte', '.gal figure', '.book', '.rules', '.contact-info > *', '.map',
  ].join(',');
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    if (!bajoElPliegue(el, 0.92)) return;
    el.setAttribute('data-reveal', '');
    const i = Array.prototype.indexOf.call(el.parentElement!.children, el);
    el.style.setProperty('--d', `${Math.min(i, 5) * 0.08}s`);
  });

  document.documentElement.classList.add('anim');

  const mostrar = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); mostrar.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach((el) => mostrar.observe(el));
}
