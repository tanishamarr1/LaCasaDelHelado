/* ==========================================================================
   La Casa del Helado — Main JavaScript
   Extracted & organized from index.html
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ========================================================================
     1. HERO SLIDER
     ======================================================================== */
  let cur = 0;
  const slides = document.querySelectorAll('.h-slide');
  const dots = document.querySelectorAll('.h-dot');

  function goTo(n) {
    slides[cur].classList.remove('on');
    dots[cur].classList.remove('on');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('on');
    dots[cur].classList.add('on');
  }

  dots.forEach(function (d) {
    d.addEventListener('click', function () {
      goTo(+d.dataset.i);
    });
  });

  setInterval(function () {
    goTo(cur + 1);
  }, 5500);

  /* ========================================================================
     2. MOBILE NAVIGATION
     ======================================================================== */
  document.getElementById('hambBtn').addEventListener('click', function () {
    document.getElementById('mobNav').classList.add('open');
  });

  document.getElementById('mobClose').addEventListener('click', function () {
    document.getElementById('mobNav').classList.remove('open');
  });

  document.querySelectorAll('.mob-link').forEach(function (l) {
    l.addEventListener('click', function () {
      document.getElementById('mobNav').classList.remove('open');
    });
  });

  /* ========================================================================
     3. MENU TABS
     ======================================================================== */
  function openTab(cat) {
    var all = cat === 'all';
    var cats = ['tostadas', 'batidas', 'jugos', 'cremitas', 'paletas', 'toppings'];

    document.querySelectorAll('.tab').forEach(function (t) {
      t.classList.toggle('on', t.dataset.cat === cat || (all && t.dataset.cat === 'all'));
    });

    cats.forEach(function (c) {
      var el = document.getElementById('cat-' + c);
      if (el) el.classList.toggle('vis', all || c === cat);
    });
  }

  // Make openTab accessible globally for inline onclick handlers
  window.openTab = openTab;

  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      openTab(t.dataset.cat);
    });
  });

  function openTabAndScroll(cat) {
    openTab(cat);
    document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
  }

  // Make openTabAndScroll accessible globally for inline onclick handlers
  window.openTabAndScroll = openTabAndScroll;

  /* ========================================================================
     4. DROPDOWN NAVIGATION
     ======================================================================== */
  document.querySelectorAll('.drop-item').forEach(function (item) {
    item.addEventListener('click', function (e) {
      var cat = item.dataset.cat;
      if (cat) {
        e.preventDefault();
        openTab(cat);
        document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ========================================================================
     5. SCROLL ANIMATIONS (Intersection Observer)
     ======================================================================== */
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add('in');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade').forEach(function (el) {
    obs.observe(el);
  });

  /* ========================================================================
     6. CART SYSTEM
     ======================================================================== */
  var WHATSAPP_NUMBER = '18296343930';
  var CART_KEY = 'lch_cart_v1';

  function loadCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) { /* silently fail */ }
  }

  var cart = loadCart(); // { "Product Name": { price: Number, qty: Number } }

  function cartCount() {
    return Object.values(cart).reduce(function (s, i) { return s + i.qty; }, 0);
  }

  function cartTotal() {
    return Object.values(cart).reduce(function (s, i) { return s + i.qty * i.price; }, 0);
  }

  function addItem(name, price) {
    if (!cart[name]) cart[name] = { price: Number(price) || 0, qty: 0 };
    cart[name].qty += 1;
    saveCart(cart);
    renderAll();
  }

  function removeOne(name) {
    if (!cart[name]) return;
    cart[name].qty -= 1;
    if (cart[name].qty <= 0) delete cart[name];
    saveCart(cart);
    renderAll();
  }

  function removeAll(name) {
    delete cart[name];
    saveCart(cart);
    renderAll();
  }

  function clearCart() {
    cart = {};
    saveCart(cart);
    renderAll();
  }

  /* --- Render product card controls (add button or stepper) --- */
  function renderCardControls() {
    document.querySelectorAll('.mcard-ctrl').forEach(function (ctrl) {
      var name = ctrl.dataset.name;
      var price = ctrl.dataset.price;
      var inCart = cart[name];

      if (inCart && inCart.qty > 0) {
        ctrl.innerHTML =
          '<div class="mcard-stepper">' +
            '<button type="button" class="mc-minus" aria-label="Quitar uno">&minus;</button>' +
            '<span class="mcard-qty">' + inCart.qty + ' en el pedido</span>' +
            '<button type="button" class="mc-plus" aria-label="Agregar uno">&plus;</button>' +
          '</div>';
        ctrl.querySelector('.mc-minus').addEventListener('click', function () { removeOne(name); });
        ctrl.querySelector('.mc-plus').addEventListener('click', function () { addItem(name, price); });
      } else {
        ctrl.innerHTML =
          '<button type="button" class="mcard-add">' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
            ' Agregar al pedido' +
          '</button>';
        ctrl.querySelector('.mcard-add').addEventListener('click', function () { addItem(name, price); });
      }
    });
  }

  /* --- Render topping tags state --- */
  function renderToppings() {
    document.querySelectorAll('#toppingTags .t-tag').forEach(function (tag) {
      var name = tag.dataset.name;
      var active = !!cart[name];
      tag.style.background = active ? 'var(--coral)' : '';
      tag.style.color = active ? '#fff' : '';
      tag.style.borderColor = active ? 'var(--coral)' : '';
    });
  }

  document.querySelectorAll('#toppingTags .t-tag').forEach(function (tag) {
    tag.addEventListener('click', function () {
      var name = tag.dataset.name;
      var price = tag.dataset.price;
      if (cart[name]) {
        removeAll(name);
      } else {
        addItem(name, price);
      }
    });
  });

  /* --- Render cart drawer content --- */
  function renderDrawer() {
    var wrap = document.getElementById('cartItemsWrap');
    var entries = Object.entries(cart);

    if (entries.length === 0) {
      wrap.innerHTML =
        '<div class="cart-empty" id="cartEmptyMsg">' +
          'Tu carrito esta vacio.<br>' +
          'Ve al <a href="#menu" id="cartGoMenu">menu</a> y agrega lo que quieras pedir.' +
        '</div>';
      var goMenuLink = document.getElementById('cartGoMenu');
      if (goMenuLink) goMenuLink.addEventListener('click', closeCart);
    } else {
      wrap.innerHTML = entries.map(function (entry) {
        var name = entry[0];
        var item = entry[1];
        var priceLabel = item.price > 0 ? 'RD$' + item.price + ' c/u' : 'Sin costo';
        return (
          '<div class="cart-row" data-name="' + name + '">' +
            '<div class="cart-row-info">' +
              '<div class="cart-row-name">' + name + '</div>' +
              '<div class="cart-row-price">' + priceLabel + '</div>' +
            '</div>' +
            '<div class="cart-row-ctrl">' +
              '<button type="button" class="cr-minus" aria-label="Quitar uno">&minus;</button>' +
              '<span class="cart-row-qty">' + item.qty + '</span>' +
              '<button type="button" class="cr-plus" aria-label="Agregar uno">&plus;</button>' +
            '</div>' +
            '<button type="button" class="cart-row-remove">Quitar</button>' +
          '</div>'
        );
      }).join('');

      wrap.querySelectorAll('.cart-row').forEach(function (row) {
        var name = row.dataset.name;
        row.querySelector('.cr-minus').addEventListener('click', function () { removeOne(name); });
        row.querySelector('.cr-plus').addEventListener('click', function () { addItem(name, cart[name].price); });
        row.querySelector('.cart-row-remove').addEventListener('click', function () { removeAll(name); });
      });
    }

    document.getElementById('cartTotalAmt').textContent = 'RD$' + cartTotal();
    document.getElementById('cartSendBtn').disabled = entries.length === 0;
  }

  /* --- Render badges (nav + fab) --- */
  function renderBadges() {
    var count = cartCount();
    var navBadge = document.getElementById('navCartBadge');
    var fabBadge = document.getElementById('cartFabBadge');

    navBadge.textContent = count;
    navBadge.style.display = count > 0 ? 'flex' : 'none';
    fabBadge.textContent = count;
    fabBadge.classList.toggle('zero', count === 0);
  }

  function renderAll() {
    renderCardControls();
    renderToppings();
    renderDrawer();
    renderBadges();
  }

  /* ========================================================================
     7. CART UI — Drawer open/close, WhatsApp send
     ======================================================================== */
  var cartOverlay = document.getElementById('cartOverlay');
  var cartDrawer = document.getElementById('cartDrawer');

  function openCart() {
    cartOverlay.classList.add('open');
    cartDrawer.classList.add('open');
  }

  function closeCart() {
    cartOverlay.classList.remove('open');
    cartDrawer.classList.remove('open');
  }

  document.getElementById('cartFab').addEventListener('click', openCart);
  document.getElementById('navCartBtn').addEventListener('click', openCart);
  document.getElementById('cartCloseBtn').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  document.getElementById('cartClearBtn').addEventListener('click', function () {
    if (confirm('Vaciar todo el carrito?')) clearCart();
  });

  /* --- Send order via WhatsApp --- */
  document.getElementById('cartSendBtn').addEventListener('click', function () {
    var entries = Object.entries(cart);
    if (entries.length === 0) return;

    var lines = ['Hola, quiero hacer este pedido en La Casa del Helado:', ''];

    entries.forEach(function (entry) {
      var name = entry[0];
      var item = entry[1];
      if (item.price > 0) {
        lines.push('- ' + item.qty + 'x ' + name + ' (RD$' + item.price + ' c/u) = RD$' + (item.qty * item.price));
      } else {
        lines.push('- ' + item.qty + 'x ' + name);
      }
    });

    lines.push('');
    lines.push('Total: RD$' + cartTotal());

    var msg = encodeURIComponent(lines.join('\n'));
    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + msg, '_blank');
  });

  /* --- Initial render --- */
  renderAll();

});
