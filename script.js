/**
 * LYCE BEAUTY — script.js
 * Funcionalidades: Carrinho, Checkout, Filtros, Animações, EmailJS
 */

// ============================================================
// CONFIGURAÇÃO EMAILJS
// ✏️  Substitua com suas credenciais de https://emailjs.com
// ============================================================
const EMAILJS_CONFIG = {
  publicKey:        'SEU_PUBLIC_KEY',       // ← cole aqui
  serviceId:        'SEU_SERVICE_ID',       // ← cole aqui
  templatePedido:   'SEU_TEMPLATE_PEDIDO',  // ← cole aqui
  templateContato:  'SEU_TEMPLATE_CONTATO', // ← cole aqui
};

const WHATSAPP_NUM = '5511994420964';

// ============================================================
// BASE DE DADOS DOS PRODUTOS
// ============================================================
const PRODUCTS = {
  1: { id:1, name:'Base de Alta Cobertura', cat:'Maquiagem', price:69.90, oldPrice:89.90, img:'assets/produtos/base-cobertura.jpg', emoji:'💄', desc:'Acabamento impecável com longa duração e proteção solar FPS 30. Fórmula leve e de alta cobertura, ideal para o dia a dia ou ocasiões especiais.' },
  2: { id:2, name:'Batom Nude Matte', cat:'Maquiagem', price:45.00, oldPrice:null, img:'assets/produtos/batom-nude.jpg', emoji:'💋', desc:'Cor versátil que valoriza qualquer tom de pele com acabamento aveludado. Fórmula hidratante com longa fixação.' },
  3: { id:3, name:'Paleta Sunset', cat:'Maquiagem', price:129.90, oldPrice:null, img:'assets/produtos/paleta-sombras.jpg', emoji:'🎨', desc:'12 sombras pigmentadas em tons quentes e românticos — rosa, cobre, borgonha e roxo — perfeitas para looks únicos do dia à noite.' },
  4: { id:4, name:'Kit Hidratação Profunda', cat:'Skincare', price:149.90, oldPrice:189.90, img:'assets/produtos/kit-skincare.jpg', emoji:'✨', desc:'Rotina completa com hidratante facial + sérum antienvelhecimento para pele radiante, hidratada e nutrida durante todo o dia.' },
  5: { id:5, name:'Sérum Vitamina C', cat:'Skincare', price:98.00, oldPrice:null, img:'', emoji:'🍊', desc:'Ilumina, uniformiza o tom e combate manchas com ácido ascórbico puro a 15%. Resultados visíveis em 2 semanas de uso.' },
  6: { id:6, name:'Esfoliante Facial Rose', cat:'Skincare', price:67.50, oldPrice:null, img:'', emoji:'🌹', desc:'Esfoliação suave com extrato de rosa e micropartículas naturais para pele macia, luminosa e iluminada. Uso 2x por semana.' },
  7: { id:7, name:'Shampoo Premium Nutritivo', cat:'Cabelo', price:79.90, oldPrice:null, img:'', emoji:'💜', desc:'Limpeza profunda com nutrição intensa, enriquecido com queratina e óleo de argan para fios brilhantes e saudáveis.' },
  8: { id:8, name:'Máscara Tratamento Intensivo', cat:'Cabelo', price:95.00, oldPrice:null, img:'', emoji:'✦', desc:'Restaura, hidrata e fortalece fios danificados em apenas 10 minutos de aplicação. Tecnologia de reconstrução celular.' },
  9: { id:9, name:'Óleo Capilar Dourado', cat:'Cabelo', price:85.00, oldPrice:105.00, img:'', emoji:'⭐', desc:'Sérum capilar com extratos dourados e nanoemulsão para fios ultrabrilhantes, sedosos e com efeito laminado duradouro.' },
};

// ============================================================
// ESTADO DO APP
// ============================================================
let cart = JSON.parse(localStorage.getItem('lyce_cart') || '[]');

// ============================================================
// UTILITÁRIOS
// ============================================================
const formatPrice = (v) =>
  'R$ ' + Number(v).toFixed(2).replace('.', ',');

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function saveCart() {
  localStorage.setItem('lyce_cart', JSON.stringify(cart));
}

function showToast(msg, icon = '💜') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  document.body.appendChild(t);
  requestAnimationFrame(() => { requestAnimationFrame(() => t.classList.add('show')); });
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 350);
  }, 2800);
}

// ============================================================
// NAVBAR
// ============================================================
const navbar = $('#navbar');
const hamburger = $('#hamburger');
const navMenu = $('#nav-menu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
}, { passive: true });

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navMenu.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

navMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

function updateActiveNav() {
  const sections = ['home','sobre','produtos','contato'];
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 140) current = id;
  });
  $$('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
  });
}

// ============================================================
// CATEGORY CARDS — filtrar ao clicar
// ============================================================
$$('.category-card').forEach(card => {
  card.addEventListener('click', (e) => {
    const filter = card.dataset.filter;
    document.getElementById('produtos').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => applyFilter(filter), 600);
  });
});

// ============================================================
// FILTRO DE PRODUTOS
// ============================================================
function applyFilter(filter) {
  $$('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
    btn.setAttribute('aria-selected', btn.dataset.filter === filter);
  });
  $$('.produto-card').forEach(card => {
    const show = filter === 'todos' || card.dataset.category === filter;
    card.classList.toggle('hidden', !show);
    if (show) {
      card.style.animation = 'none';
      requestAnimationFrame(() => {
        card.style.animation = '';
        card.style.animationName = 'fadeUp';
        card.style.animationDuration = '0.4s';
      });
    }
  });
}

$$('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
});

// ============================================================
// CARRINHO
// ============================================================
function getCartItem(id) {
  return cart.find(i => i.id === id);
}

function addToCart(id) {
  const product = PRODUCTS[id];
  if (!product) return;
  const existing = getCartItem(id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart();
  renderCart();
  updateBadge();
  showToast(`${product.name} adicionado ao carrinho!`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
  updateBadge();
}

function changeQty(id, delta) {
  const item = getCartItem(id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); renderCart(); updateBadge(); }
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
  updateBadge();
}

function getCartTotal() {
  return cart.reduce((sum, i) => sum + PRODUCTS[i.id].price * i.qty, 0);
}

function updateBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = $('#cart-badge');
  badge.textContent = total;
  badge.classList.toggle('visible', total > 0);
}

function renderCart() {
  const body       = $('#cart-body');
  const itemsEl    = $('#cart-items');
  const emptyEl    = $('#cart-empty');
  const footerEl   = $('#cart-footer');
  const totalEl    = $('#cart-total');
  const freteMsg   = $('#cart-frete-msg');

  itemsEl.innerHTML = '';

  if (cart.length === 0) {
    emptyEl.style.display = 'flex';
    itemsEl.style.display = 'none';
    footerEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  itemsEl.style.display = 'flex';
  footerEl.style.display = 'flex';

  cart.forEach(item => {
    const p = PRODUCTS[item.id];
    const imgHtml = p.img
      ? `<img src="${p.img}" alt="${p.name}" class="cart-item__img" />`
      : `<div class="cart-item__img-placeholder" aria-hidden="true">${p.emoji}</div>`;

    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      ${imgHtml}
      <div class="cart-item__info">
        <p class="cart-item__name">${p.name}</p>
        <p class="cart-item__price">${formatPrice(p.price)}</p>
        <div class="cart-item__qty">
          <button class="qty-btn" data-id="${item.id}" data-delta="-1" aria-label="Diminuir quantidade">−</button>
          <span class="qty-value" aria-label="Quantidade: ${item.qty}">${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-delta="1" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
      <button class="cart-item__remove" data-id="${item.id}" aria-label="Remover ${p.name} do carrinho">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6"/><path d="M14,11v6"/>
        </svg>
      </button>`;
    itemsEl.appendChild(el);
  });

  const total = getCartTotal();
  totalEl.textContent = formatPrice(total);

  if (total >= 150) {
    freteMsg.textContent = '🎉 Você ganhou frete grátis!';
    freteMsg.style.background = '#d4f3e3';
    freteMsg.style.color = '#1a5c35';
  } else {
    const rem = 150 - total;
    freteMsg.textContent = `Falta ${formatPrice(rem)} para frete grátis ✨`;
    freteMsg.style.background = '';
    freteMsg.style.color = '';
  }
}

// Delegação de eventos no carrinho
$('#cart-items').addEventListener('click', (e) => {
  const qtyBtn = e.target.closest('.qty-btn');
  const rmBtn  = e.target.closest('.cart-item__remove');
  if (qtyBtn) changeQty(Number(qtyBtn.dataset.id), Number(qtyBtn.dataset.delta));
  if (rmBtn)  removeFromCart(Number(rmBtn.dataset.id));
});

$('#cart-clear').addEventListener('click', () => {
  if (confirm('Deseja realmente limpar o carrinho?')) clearCart();
});

// ============================================================
// ABRIR/FECHAR CARRINHO
// ============================================================
const cartDrawer  = $('#cart-drawer');
const cartOverlay = $('#cart-overlay');

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('visible');
  cartOverlay.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
  renderCart();
}
function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('visible');
  cartOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

$('#cart-btn').addEventListener('click', openCart);
$('#cart-close').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
$('#cart-ver-produtos').addEventListener('click', closeCart);

// ============================================================
// ADICIONAR AO CARRINHO (botões nos cards)
// ============================================================
$$('.btn--add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = Number(btn.dataset.id);
    addToCart(id);
    btn.textContent = '✓ Adicionado!';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = 'Adicionar ao carrinho';
      btn.classList.remove('added');
    }, 2000);
  });
});

// ============================================================
// CHECKOUT
// ============================================================
const checkoutOverlay = $('#checkout-overlay');
const checkoutModal   = $('#checkout-modal');

function openCheckout() {
  closeCart();
  // Preenche resumo
  const listEl  = $('#checkout-items-list');
  const totalEl = $('#checkout-total-val');
  listEl.innerHTML = '';
  cart.forEach(item => {
    const p = PRODUCTS[item.id];
    const div = document.createElement('div');
    div.className = 'checkout-item';
    div.innerHTML = `
      <span>${p.name} × ${item.qty}</span>
      <span>${formatPrice(p.price * item.qty)}</span>`;
    listEl.appendChild(div);
  });
  totalEl.textContent = formatPrice(getCartTotal());

  checkoutOverlay.classList.add('visible');
  checkoutOverlay.removeAttribute('aria-hidden');
  checkoutModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  checkoutOverlay.classList.remove('visible');
  checkoutOverlay.setAttribute('aria-hidden', 'true');
  checkoutModal.classList.remove('open');
  document.body.style.overflow = '';
}

$('#finalizar-btn').addEventListener('click', () => {
  if (cart.length === 0) {
    showToast('Seu carrinho está vazio!', '🛍️');
    return;
  }
  openCheckout();
});

$('#checkout-close').addEventListener('click', closeCheckout);
checkoutOverlay.addEventListener('click', closeCheckout);

// ============================================================
// FORMULÁRIO CHECKOUT — envio
// ============================================================
$('#checkout-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form   = e.target;
  const submitBtn  = $('#checkout-submit');
  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  const successEl  = $('#checkout-success');
  const errorEl    = $('#checkout-error');

  successEl.style.display = 'none';
  errorEl.style.display   = 'none';

  // Validação básica
  const name    = $('#checkout-name').value.trim();
  const email   = $('#checkout-email').value.trim();
  const tel     = $('#checkout-tel').value.trim();
  const rua     = $('#checkout-rua').value.trim();
  const num     = $('#checkout-num').value.trim();
  const bairro  = $('#checkout-bairro').value.trim();
  const cidade  = $('#checkout-cidade').value.trim();
  const estado  = $('#checkout-estado').value;
  const cep     = $('#checkout-cep').value.trim();
  const payment = form.querySelector('input[name="payment"]:checked');
  const obs     = $('#checkout-obs').value.trim();

  if (!name || !email || !tel || !rua || !num || !bairro || !cidade || !estado || !cep || !payment) {
    showToast('Preencha todos os campos obrigatórios!', '⚠️');
    return;
  }

  // Monta resumo do pedido
  let pedidoTexto = '';
  cart.forEach(item => {
    const p = PRODUCTS[item.id];
    pedidoTexto += `• ${p.name} x${item.qty} = ${formatPrice(p.price * item.qty)}\n`;
  });
  pedidoTexto += `\nTOTAL: ${formatPrice(getCartTotal())}`;

  const enderecoCompleto = `${rua}, ${num}${$('#checkout-comp').value ? ', ' + $('#checkout-comp').value : ''} — ${bairro}, ${cidade} - ${estado} — CEP: ${cep}`;

  btnText.style.display    = 'none';
  btnLoading.style.display = 'inline';
  submitBtn.disabled       = true;

  try {
    if (EMAILJS_CONFIG.publicKey !== 'SEU_PUBLIC_KEY') {
      // EmailJS configurado — envia e-mail real
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templatePedido,
        {
          from_name:  name,
          from_email: email,
          from_tel:   tel,
          pedido:     pedidoTexto,
          total:      formatPrice(getCartTotal()),
          endereco:   enderecoCompleto,
          pagamento:  payment.value,
          obs:        obs || '—',
        },
        EMAILJS_CONFIG.publicKey
      );
    } else {
      // Modo demo — simula envio
      await new Promise(r => setTimeout(r, 1500));
    }

    successEl.style.display = 'block';
    form.reset();
    clearCart();
    showToast('Pedido enviado com sucesso! 🎉', '✅');

    // Também abre WhatsApp com resumo (opcional)
    setTimeout(() => {
      const waMsg = encodeURIComponent(
        `Olá LYCE BEAUTY! Acabei de fazer um pedido pelo site! 💜\n\n` +
        `*Nome:* ${name}\n*E-mail:* ${email}\n*WhatsApp:* ${tel}\n\n` +
        `*Pedido:*\n${pedidoTexto}\n\n` +
        `*Endereço:* ${enderecoCompleto}\n*Pagamento:* ${payment.value}`
      );
      if (confirm('Deseja também enviar seu pedido pelo WhatsApp para confirmação mais rápida?')) {
        window.open(`https://wa.me/${WHATSAPP_NUM}?text=${waMsg}`, '_blank');
      }
    }, 500);

  } catch (err) {
    console.error('EmailJS error:', err);
    errorEl.style.display = 'block';
  } finally {
    btnText.style.display    = 'inline';
    btnLoading.style.display = 'none';
    submitBtn.disabled       = false;
  }
});

// ============================================================
// FORMULÁRIO DE CONTATO
// ============================================================
$('#contato-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form      = e.target;
  const submitBtn = $('#contato-submit');
  const btnText   = submitBtn.querySelector('.btn-text');
  const btnLoad   = submitBtn.querySelector('.btn-loading');
  const successEl = $('#form-success');
  const errorEl   = $('#form-error');

  successEl.style.display = 'none';
  errorEl.style.display   = 'none';

  btnText.style.display = 'none';
  btnLoad.style.display = 'inline';
  submitBtn.disabled    = true;

  const params = {
    from_name:    $('#contact-name').value.trim(),
    from_email:   $('#contact-email').value.trim(),
    from_phone:   $('#contact-phone').value.trim(),
    subject:      $('#contact-subject').value,
    message:      $('#contact-message').value.trim(),
  };

  try {
    if (EMAILJS_CONFIG.publicKey !== 'SEU_PUBLIC_KEY') {
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateContato,
        params,
        EMAILJS_CONFIG.publicKey
      );
    } else {
      await new Promise(r => setTimeout(r, 1200));
    }
    successEl.style.display = 'block';
    form.reset();
  } catch (err) {
    errorEl.style.display = 'block';
  } finally {
    btnText.style.display = 'inline';
    btnLoad.style.display = 'none';
    submitBtn.disabled    = false;
  }
});

// ============================================================
// MODAL DETALHES DO PRODUTO
// ============================================================
const productOverlay = $('#product-overlay');
const productModal   = $('#product-modal');
const productBody    = $('#product-modal-body');

function openProductModal(id) {
  const p = PRODUCTS[id];
  if (!p) return;

  const imgHtml = p.img
    ? `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" />`
    : `<div class="pmodal__img-placeholder">${p.emoji}</div>`;

  productBody.innerHTML = `
    <div class="pmodal__img">${imgHtml}</div>
    <div class="pmodal__info">
      <span class="pmodal__cat">${p.cat}</span>
      <h2 class="pmodal__name" id="product-modal-title">${p.name}</h2>
      <p class="pmodal__desc">${p.desc}</p>
      <div class="pmodal__prices">
        ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ''}
        <span class="price-current">${formatPrice(p.price)}</span>
      </div>
      <button class="btn btn--add-cart pmodal__btn" data-id="${id}" aria-label="Adicionar ${p.name} ao carrinho">
        Adicionar ao carrinho
      </button>
    </div>`;

  // Re-bind add-to-cart inside modal
  productBody.querySelector('.btn--add-cart').addEventListener('click', (e) => {
    const btn = e.currentTarget;
    addToCart(id);
    btn.textContent = '✓ Adicionado!';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = 'Adicionar ao carrinho';
      btn.classList.remove('added');
    }, 2000);
  });

  productOverlay.classList.add('visible');
  productOverlay.removeAttribute('aria-hidden');
  productModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  productOverlay.classList.remove('visible');
  productOverlay.setAttribute('aria-hidden', 'true');
  productModal.classList.remove('open');
  document.body.style.overflow = '';
}

$$('.quick-view-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openProductModal(Number(btn.dataset.id));
  });
});

$('#product-close').addEventListener('click', closeProductModal);
productOverlay.addEventListener('click', closeProductModal);

// ============================================================
// CEP AUTO-FORMAT
// ============================================================
$('#checkout-cep').addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g,'').slice(0,8);
  if (v.length > 5) v = v.slice(0,5) + '-' + v.slice(5);
  e.target.value = v;
});

// ============================================================
// SCROLL REVEAL ANIMATIONS
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function addRevealClasses() {
  const selectors = [
    '.category-card',
    '.produto-card',
    '.entrega__item',
    '.value-item',
    '.sobre__content',
    '.sobre__img-wrap',
    '.contato__info',
    '.contato__form',
    '.section-header',
  ];
  selectors.forEach(sel => {
    $$(sel).forEach((el, i) => {
      el.classList.add('reveal');
      if (i % 3 === 1) el.classList.add('reveal-delay-1');
      if (i % 3 === 2) el.classList.add('reveal-delay-2');
      revealObserver.observe(el);
    });
  });
}

// ============================================================
// TECLADO — fechar modais com ESC
// ============================================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCart();
    closeCheckout();
    closeProductModal();
  }
});

// ============================================================
// EMAILJS — carrega SDK se credenciais estiverem configuradas
// ============================================================
function loadEmailJS() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload = () => {
    if (EMAILJS_CONFIG.publicKey !== 'SEU_PUBLIC_KEY') {
      emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
    }
  };
  document.head.appendChild(script);
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  updateBadge();
  renderCart();
  addRevealClasses();
  updateActiveNav();
  loadEmailJS();

  // Smooth scroll para âncoras internas
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  console.log('%c💜 LYCE BEAUTY — Site carregado com sucesso!', 'color:#C9A055;font-family:serif;font-size:14px;font-weight:bold;');
});
