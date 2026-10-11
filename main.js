// Mobile nav
document.querySelectorAll('.nav-toggle').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var nav = document.querySelector('.nav');
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
});
document.querySelectorAll('.nav a').forEach(function (a) {
  a.addEventListener('click', function () { document.querySelector('.nav').classList.remove('open'); });
});

// Portrait: show initials until a real photo loads
document.querySelectorAll('.portrait img').forEach(function (img) {
  function fail() { img.remove(); }
  if (img.complete && img.naturalWidth === 0) fail();
  img.addEventListener('error', fail);
});

// Screenshot gallery: drop missing images; hide section if none exist
(function () {
  var gallery = document.querySelector('.gallery');
  if (!gallery) return;
  var figs = gallery.querySelectorAll('figure');
  var pending = figs.length;
  function check() {
    pending--;
    if (pending === 0 && gallery.querySelectorAll('figure').length === 0) {
      var sec = document.getElementById('screenshots');
      if (sec) sec.remove();
      var link = document.querySelector('.toc a[href="#screenshots"]');
      if (link) link.parentElement.remove();
    }
  }
  figs.forEach(function (fig) {
    var img = fig.querySelector('img');
    function bad() { fig.remove(); check(); }
    if (img.complete) { img.naturalWidth === 0 ? bad() : check(); return; }
    img.addEventListener('load', check);
    img.addEventListener('error', bad);
  });

  // Lightbox
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<img alt="">';
  document.body.appendChild(lb);
  gallery.addEventListener('click', function (e) {
    if (e.target.tagName === 'IMG') { lb.querySelector('img').src = e.target.src; lb.classList.add('open'); }
  });
  lb.addEventListener('click', function () { lb.classList.remove('open'); });
})();

// Table of contents highlight
(function () {
  var links = document.querySelectorAll('.toc a');
  if (!links.length || !('IntersectionObserver' in window)) return;
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting && map[en.target.id]) {
        links.forEach(function (l) { l.classList.remove('active'); });
        map[en.target.id].classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  document.querySelectorAll('.doc section[id]').forEach(function (s) { obs.observe(s); });
})();

// Year
document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
