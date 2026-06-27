// Envolvemos todo en una IIFE para evitar contaminar el scope global
(function() {
  "use strict";

  const WHATSAPP_NUMBER = '18296343930';
  const CART_KEY = 'lch_cart_v1';
  let cart = loadCart(); 

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.error("Error al cargar el carrito:", e);
      return {};
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Error al guardar el carrito:", e);
    }
  }

  function addItem(name, price) {
    if (!cart[name]) {
      cart[name] = { price: Number(price) || 0, qty: 0 };
    }
    cart[name].qty += 1;
    saveCart();
    renderAll();
  }

  function removeOne(name) {
    if (!cart[name]) return;
    cart[name].qty -= 1;
    if (cart[name].qty <= 0) {
      delete cart[name];
    }
    saveCart();
    renderAll();
  }

  function removeAll(name) {
    delete cart[name];
    saveCart();
    renderAll();
  }

  function clearCart() {
    cart = {};
    saveCart();
    renderAll();
  }

  function getCartCount() {
    return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  }

  function getCartTotal() {
    return Object.values(cart).reduce((sum, item) => sum + item.qty * item.price, 0);
  }

  // --- RENDERIZADO Y DOM (La "Vista") ---
  function renderCardControls() {
    document.querySelectorAll('.mcard-ctrl').forEach(ctrl => {
      const name = ctrl.dataset.name;
      const price = ctrl.dataset.price;
      const inCart = cart[name];

      if (inCart && inCart.qty > 0) {
        ctrl.innerHTML = `
          <div class="mcard-stepper">
            <button type="button" class="mc-minus" aria-label="Quitar uno">&minus;</button>
            <span class="mcard-qty">${inCart.qty} en el pedido</span>
            <button type="button" class="mc-plus" aria-label="Agregar uno">&plus;</button>
          </div>`;
        ctrl.querySelector('.mc-minus').addEventListener('click', () => removeOne(name));
        ctrl.querySelector('.mc-plus').addEventListener('click', () => addItem(name, price));
      } else {
        ctrl.innerHTML = `
          <button type="button" class="mcard-add">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Agregar al pedido
          </button>`;
        ctrl.querySelector('.mcard-add').addEventListener('click', () => addItem(name, price));
      }
    });
  }

  function renderToppings() {
    document.querySelectorAll('#toppingTags .t-tag').forEach(tag => {
      const name = tag.dataset.name;
      const active = !!cart[name];
      tag.style.background = active ? 'var(--coral)' : '';
      tag.style.color = active ? '#fff' : '';
      tag.style.borderColor = active ? 'var(--coral)' : '';
    });
  }

  function renderDrawer() {
    const wrap = document.getElementById('cartItemsWrap');
    const entries = Object.entries(cart);

    if (entries.length === 0) {
      wrap.innerHTML = `<div class="cart-empty" id="cartEmptyMsg">Tu carrito esta vacio.<br>Ve al <a href="#menu" id="cartGoMenu">menu</a> y agrega lo que quieras pedir.</div>`;
      document.getElementById('cartGoMenu')?.addEventListener('click', closeCart);
    } else {
      wrap.innerHTML = entries.map(([name, item]) => {
        const priceLabel = item.price > 0 ? `RD$${item.price} c/u` : 'Sin costo';
        return `
        <div class="cart-row" data-name="${name}">
          <div class="cart-row-info">
            <div class="cart-row-name">${name}</div>
            <div class="cart-row-price">${priceLabel}</div>
          </div>
          <div class="cart-row-ctrl">
            <button type="button" class="cr-minus" aria-label="Quitar uno">&minus;</button>
            <span class="cart-row-qty">${item.qty}</span>
            <button type="button" class="cr-plus" aria-label="Agregar uno">&plus;</button>
          </div>
          <button type="button" class="cart-row-remove">Quitar</button>
        </div>`;
      }).join('');

      wrap.querySelectorAll('.cart-row').forEach(row => {
        const name = row.dataset.name;
        row.querySelector('.cr-minus').addEventListener('click', () => removeOne(name));
        row.querySelector('.cr-plus').addEventListener('click', () => addItem(name, cart[name].price));
        row.querySelector('.cart-row-remove').addEventListener('click', () => removeAll(name));
      });
    }

    document.getElementById('cartTotalAmt').textContent = 'RD$' + getCartTotal();
    document.getElementById('cartSendBtn').disabled = entries.length === 0;
  }

  function renderBadges() {
    const count = getCartCount();
    const navBadge = document.getElementById('navCartBadge');
    const fabBadge = document.getElementById('cartFabBadge');
    
    [navBadge, fabBadge].forEach(badge => {
        if (badge) {
            badge.textContent = count;
        }
    });

    navBadge.style.display = count > 0 ? 'flex' : 'none';
    fabBadge.classList.toggle('zero', count === 0);
  }

  function renderAll() {
    renderCardControls();
    renderToppings();
    renderDrawer();
    renderBadges();
  }

  // --- MANEJADORES DE EVENTOS (El "Controlador") ---
  function setupEventListeners() {
    // Lógica de UI general (no relacionada con el carrito)
    setupHeroSlider();
    setupMobileNav();
    setupMenuTabs();
    setupFadeOnScroll();

    // Carrito
    document.querySelectorAll('#toppingTags .t-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const name = tag.dataset.name;
        const price = tag.dataset.price;
        if (cart[name]) {
          removeAll(name);
        } else {
          addItem(name, price);
        }
      });
    });

    const cartOverlay = document.getElementById('cartOverlay');
    const cartDrawer = document.getElementById('cartDrawer');
    const openCart = () => { cartOverlay.classList.add('open'); cartDrawer.classList.add('open'); };
    const closeCart = () => { cartOverlay.classList.remove('open'); cartDrawer.classList.remove('open'); };

    document.getElementById('cartFab').addEventListener('click', openCart);
    document.getElementById('navCartBtn').addEventListener('click', openCart);
    document.getElementById('cartCloseBtn').addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    document.getElementById('cartClearBtn').addEventListener('click', () => {
      if (confirm('¿Vaciar todo el carrito?')) {
        clearCart();
      }
    });

    document.getElementById('cartSendBtn').addEventListener('click', () => {
      const entries = Object.entries(cart);
      if (entries.length === 0) return;

      let lines = ['Hola, quiero hacer este pedido en La Casa del Helado:', ''];
      entries.forEach(([name, item]) => {
        if (item.price > 0) {
          lines.push(`- ${item.qty}x ${name} (RD$${item.price} c/u) = RD$${item.qty * item.price}`);
        } else {
          lines.push(`- ${item.qty}x ${name}`);
        }
      });
      lines.push('');
      lines.push(`Total: RD$${getCartTotal()}`);

      const msg = encodeURIComponent(lines.join('\n'));
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    });
  }

  // --- LÓGICA DE UI (Funciones de ayuda) ---
  function setupHeroSlider() {
    let cur = 0;
    const slides = document.querySelectorAll('.h-slide');
    const dots = document.querySelectorAll('.h-dot');
    if (slides.length === 0) return;

    function goTo(n) {
      slides[cur].classList.remove('on');
      dots[cur].classList.remove('on');
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add('on');
      dots[cur].classList.add('on');
    }
    dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.i)));
    setInterval(() => goTo(cur + 1), 5500);
  }

  function setupMobileNav() {
    const mobNav = document.getElementById('mobNav');
    const hambBtn = document.getElementById('hambBtn');
    const closeMenu = () => {
      mobNav.classList.remove('open');
      hambBtn.classList.remove('active');
    };
    hambBtn.addEventListener('click', () => { mobNav.classList.toggle('open'); hambBtn.classList.toggle('active'); });
    document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', closeMenu));
  }

  function openTab(cat) {
    const all = cat === 'all';
    const cats = ['tostadas', 'batidas', 'jugos', 'cremitas', 'paletas', 'toppings'];
    document.querySelectorAll('.tab').forEach(t => {
      t.classList.toggle('on', t.dataset.cat === cat);
    });
    cats.forEach(c => {
      const el = document.getElementById('cat-' + c);
      if (el) el.classList.toggle('vis', all || c === cat);
    });
  }

  function setupMenuTabs() {
    document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => openTab(t.dataset.cat)));

    window.openTabAndScroll = function(cat) {
      openTab(cat);
      document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
    }

    document.querySelectorAll('.drop-item').forEach(item => {
      item.addEventListener('click', e => {
        const cat = item.dataset.cat;
        if (cat) {
          e.preventDefault();
          openTab(cat);
          document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  function setupFadeOnScroll() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('in');
      });
    }, { threshold: .12 });
    document.querySelectorAll('.fade').forEach(el => obs.observe(el));
  }

  // --- INICIALIZACIÓN ---
  // Espera a que el DOM esté completamente cargado para ejecutar el script
  document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    renderAll(); // Renderizado inicial
  });

})();

// Exponer funciones necesarias globalmente de forma controlada
// Esto es necesario porque tienes `onclick="openTabAndScroll('cremitas')"` en tu HTML.
// Una mejor práctica a futuro sería mover estos `onclick` a event listeners en el JS.
function openTabAndScroll(cat) {
    window.openTabAndScroll(cat);
}