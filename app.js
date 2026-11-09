/* BENCH 001: three small things. No tracking, no network, no storage. */
(function () {
  'use strict';

  // 1. thin progress bar across the top as you read
  var bar = document.createElement('div');
  bar.id = 'pbar';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  function paint() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
    bar.style.width = (p * 100).toFixed(2) + '%';
  }
  addEventListener('scroll', paint, { passive: true });
  addEventListener('resize', paint);
  paint();

  // 2. highlight the section you are actually in
  var links = Array.prototype.slice.call(document.querySelectorAll('nav.sections a'));
  var targets = links.map(function (a) {
    var id = a.getAttribute('href').slice(1);
    return document.getElementById(id);
  });
  var ticking = false;

  function spy() {
    ticking = false;
    var line = 90; // just under the sticky bar
    var best = -1;
    for (var i = 0; i < targets.length; i++) {
      var el = targets[i];
      if (el && el.getBoundingClientRect().top <= line) best = i;
    }
    links.forEach(function (a, i) { a.classList.toggle('on', i === best); });
  }
  addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(spy); }
  }, { passive: true });
  spy();

  // 3. a copy button on every netlist, so nobody retypes it
  var pres = document.querySelectorAll('pre');
  Array.prototype.forEach.call(pres, function (pre) {
    var row = document.createElement('div');
    row.className = 'netlist-head';
    pre.parentNode.insertBefore(row, pre);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copybtn';
    btn.textContent = 'copy netlist';
    row.appendChild(btn);

    btn.addEventListener('click', function () {
      var text = pre.textContent;
      var done = function () {
        btn.textContent = 'copied';
        btn.classList.add('ok');
        setTimeout(function () {
          btn.textContent = 'copy netlist';
          btn.classList.remove('ok');
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }

      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { btn.textContent = 'select and copy'; }
        document.body.removeChild(ta);
      }
    });
  });

  // 4. print only the build card, not the whole log
  var pbtn = document.getElementById('printcard');
  if (pbtn) {
    pbtn.addEventListener('click', function () {
      document.body.classList.add('cardmode');
      var clean = function () { document.body.classList.remove('cardmode'); };
      addEventListener('afterprint', clean, { once: true });
      setTimeout(clean, 4000);
      window.print();
    });
  }
})();
