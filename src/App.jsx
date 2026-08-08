import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  ChevronLeft, ChevronRight, ShoppingBag, X, Star, Plus, Minus, Globe,
  Send, Palette, Trash2, Download, Instagram, Facebook, Phone, Mail,
  MapPin, ShoppingCart, Menu, Image as ImageIcon, Brush,
} from "lucide-react";

/* =========================================================================
   EDITABLE DATA — replace with your real products, images, team & number
   ========================================================================= */

const WHATSAPP_NUMBER = "212613798674"; // TODO: replace with your real WhatsApp number (no +, no spaces)

// image: null -> shows an elegant gradient placeholder. Set to a URL to use a real photo.
const PRODUCTS = [
  { id: 1, category: "bag", image: 'photo/products/1000140605.png', colors: ["#B08A4A", "#8C6A3B"], price: 450, rating: 4.8,
    name: { ar: "حقيبة الغروب", fr: "Sac Couchant", en: "Sunset Bag" },
    desc: { ar: "جلد طبيعي بلمسة ذهبية، مصنوعة يدويًا بعناية فائقة.", fr: "Cuir naturel à touche dorée, façonné à la main avec le plus grand soin.", en: "Natural leather with a golden touch, handcrafted with the utmost care." } },
  { id: 2, category: "bag", image: 'photo/products/IMG-20260728-WA0034.jpg', colors: ["#C9A46C", "#8C6A3B"], price: 520, rating: 4.6,
    name: { ar: "حقيبة الأطلس", fr: "Sac Atlas", en: "Atlas Bag" },
    desc: { ar: "تصميم أنيق مستوحى من التراث، بخياطة يدوية دقيقة.", fr: "Design élégant inspiré du patrimoine, à la couture manuelle précise.", en: "An elegant design inspired by heritage, with precise hand-stitching." } },
  { id: 3, category: "bag", image: 'photo/products/IMG-20260728-WA0038.jpg', colors: ["#8C6A3B", "#5C4527"], price: 390, rating: 4.7,
    name: { ar: "حقيبة الظل", fr: "Sac Ombre", en: "Shadow Bag" },
    desc: { ar: "خطوط بسيطة وجلد فاخر لإطلالة يومية أنيقة.", fr: "Lignes épurées et cuir luxueux pour un look quotidien raffiné.", en: "Clean lines and luxurious leather for an elegant everyday look." } },
  { id: 4, category: "art", image: 'photo/products/1000141182.png', colors: ["#EAD7C2", "#B08A4A"], price: 680, rating: 4.9,
    name: { ar: "لوحة الصحراء", fr: "Toile du Désert", en: "Desert Canvas" },
    desc: { ar: "ألوان دافئة تحاكي كثبان الصحراء عند الغروب.", fr: "Des teintes chaudes évoquant les dunes du désert au coucher du soleil.", en: "Warm tones echoing desert dunes at sunset." } },
  { id: 5, category: "art", image: null, colors: ["#D8C0A0", "#8C6A3B"], price: 590, rating: 4.5,
    name: { ar: "لوحة الأفق", fr: "Toile Horizon", en: "Horizon Canvas" },
    desc: { ar: "تجريد هادئ يعكس التقاء الأرض بالسماء.", fr: "Une abstraction paisible où la terre rencontre le ciel.", en: "A calm abstraction where land meets sky." } },
  { id: 7, category: "art", image: null, colors: ["#C9A46C", "#B08A4A"], price: 610, rating: 4.7,
    name: { ar: "لوحة النبض", fr: "Toile Pulsation", en: "Pulse Canvas" },
    desc: { ar: "حركة فرشاة نابضة بالحياة على قماش فني أصيل.", fr: "Un mouvement de pinceau vibrant sur toile artisanale authentique.", en: "A vibrant brush movement on an authentic artisan canvas." } },
 { id: 8, category: "art", image: null, colors: ["#C9A46C", "#B08A4A"], price: 610, rating: 4.7,
    name: { ar: "لوحة النبض", fr: "Toile Pulsation", en: "Pulse Canvas" },
    desc: { ar: "حركة فرشاة نابضة بالحياة على قماش فني أصيل.", fr: "Un mouvement de pinceau vibrant sur toile artisanale authentique.", en: "A vibrant brush movement on an authentic artisan canvas." } },
 { id: 9, category: "art", image: null, colors: ["#C9A46C", "#B08A4A"], price: 610, rating: 4.7,
    name: { ar: "لوحة النبض", fr: "Toile Pulsation", en: "Pulse Canvas" },
    desc: { ar: "حركة فرشاة نابضة بالحياة على قماش فني أصيل.", fr: "Un mouvement de pinceau vibrant sur toile artisanale authentique.", en: "A vibrant brush movement on an authentic artisan canvas." } },

  ];

// TODO: replace with your five real team members (name & role)
const TEAM = [
 
  {
    id: 3,
    name: "Sanae Amentag",
    role: { en: "Finance Manage", fr: "Gestion financière", ar: "إدارة الشؤون المالية" },
    image: "photo/team/IMG-20251223-WA0112.jpg"
  },
  {
    id: 4,
    name: "Asmae Aben",
    role: { en: "Marketing Manager", fr: "Responsable marketing", ar: "مديرة تسويق" },
    image: "photo/team/IMG-20260729-WA0021.jpg"
  },
   {
    id: 1,
    name: "Samira Amkhaou",
    role: { en: "Team Leader", fr: "Chef d'équipe", ar: "قائد الفريق" },
    image: "photo/team/IMG-20260212-WA0030.jpg"
  },
 {
    id: 5,
    name: "Sana Fhad",
    role: { en: "Co-Finance & Operations", fr: "Co-responsable des finances et des opérations", ar: "التمويل والعمليات المشتركة" },
    image: "photo/team/IMG-20260729-WA0022.jpg"
  },
  {
    id: 6,
    name: "Hiba Ben Thami",
    role: { en: "Social Media Manager", fr: "Responsable des réseaux sociaux", ar: "مديرة وسائل التواصل الاجتماعي" },
    image: "photo/team/IMG-20260731-WA0000.jpg"
  }
];

const TESTIMONIALS = [
  { id: 1, name: "Sara M.", rating: 5, text: { ar: "جودة استثنائية ولمسة فنية حقيقية في كل تفصيل.", fr: "Qualité exceptionnelle et une vraie touche artistique dans chaque détail.", en: "Exceptional quality and a real artistic touch in every detail." } },
  { id: 2, name: "Younes K.", rating: 5, text: { ar: "طلبت لوحة مخصصة وفاقت كل توقعاتي.", fr: "J'ai commandé une toile personnalisée, elle a dépassé mes attentes.", en: "I ordered a custom canvas and it exceeded every expectation." } },
  { id: 3, name: "Imane L.", rating: 4, text: { ar: "حقيبة أنيقة جدًا وتشطيب يدوي رائع.", fr: "Un sac très élégant avec une finition manuelle superbe.", en: "A very elegant bag with a beautiful handmade finish." } },
];

/* =========================================================================
   THEME
   ========================================================================= */
const COLORS = {
  primary: "#B08A4A",
  primaryDark: "#8C6A3B",
  primaryLight: "#C9A46C",
  cream: "#EAD7C2",
  white: "#FFFFFF",
  ink: "#3B2E22",
};

/* =========================================================================
   TRANSLATIONS
   ========================================================================= */
const T = {
  ar: {
    dir: "rtl",
    nav: { home: "الرئيسية", products: "المنتجات", customizer: "التخصيص", about: "من نحن", team: "الفريق", testimonials: "آراء العملاء", contact: "تواصل", cart: "السلة" },
    home: { tagline: "حيث تتحول اللمسة إلى قطعة فنية", cta: "اكتشف المجموعة" },
    products: { title: "منتجاتنا", subtitle: "قطع مختارة بعناية، حقائب جلدية ولوحات فنية أصيلة", explore: "اكتشف المزيد", addToCart: "أضف إلى السلة", close: "إغلاق" },
    allProducts: { title: "كل المنتجات", back: "عودة للرئيسية", all: "الكل", bags: "الحقائب", art: "اللوحات" },
    customizer: { title: "خصص طلبك", subtitle: "صف لنا فكرتك أو ارسمها بنفسك", type: "نوع المنتج", bag: "حقيبة يد", painting: "لوحة فنية", descLabel: "وصف الطلب", descPlaceholder: "اكتب تفاصيل التصميم الذي تريده...", nameLabel: "الاسم الكامل", namePlaceholder: "اسمك", phoneLabel: "رقم الهاتف", phonePlaceholder: "رقم للتواصل", drawTitle: "أو ارسم تصميمك", clear: "مسح", download: "تحميل الرسم", color: "اللون", size: "حجم الفرشاة", submit: "إرسال عبر واتساب" },
    about: { title: "من نحن", text: "Lamsano Sym مشروع حرفي يجمع بين لمسة الجلد الأصيل وروح اللوحة الفنية. كل قطعة تُصنع يدويًا بشغف، لتحمل بين طياتها قصة فريدة تليق بذائقتكم." },
    team: { title: "فريقنا", subtitle: "خمسة أفراد يجمعهم شغف الحرفة والفن" },
    testimonials: { title: "ماذا يقول عملاؤنا" },
    contact: { title: "تواصل معنا", subtitle: "يسعدنا استقبال استفساراتكم وطلباتكم", whatsappBtn: "راسلنا على واتساب" },
    cart: { title: "سلة الطلبات", empty: "سلتك فارغة حاليًا", total: "المجموع", checkout: "إرسال الطلب عبر واتساب", remove: "حذف" },
    footer: { rights: "جميع الحقوق محفوظة" },
  },
  fr: {
    dir: "ltr",
    nav: { home: "Accueil", products: "Produits", customizer: "Personnaliser", about: "À propos", team: "Équipe", testimonials: "Avis", contact: "Contact", cart: "Panier" },
    home: { tagline: "Où chaque geste devient une œuvre d'art", cta: "Découvrir la collection" },
    products: { title: "Nos Produits", subtitle: "Des pièces sélectionnées avec soin, sacs en cuir et toiles authentiques", explore: "Voir plus", addToCart: "Ajouter au panier", close: "Fermer" },
    allProducts: { title: "Tous les produits", back: "Retour à l'accueil", all: "Tous", bags: "Sacs", art: "Toiles" },
    customizer: { title: "Personnalisez votre commande", subtitle: "Décrivez votre idée ou dessinez-la vous-même", type: "Type de produit", bag: "Sac à main", painting: "Toile", descLabel: "Description de la commande", descPlaceholder: "Décrivez le design que vous souhaitez...", nameLabel: "Nom complet", namePlaceholder: "Votre nom", phoneLabel: "Téléphone", phonePlaceholder: "Numéro de contact", drawTitle: "Ou dessinez votre design", clear: "Effacer", download: "Télécharger le dessin", color: "Couleur", size: "Taille du pinceau", submit: "Envoyer via WhatsApp" },
    about: { title: "À propos", text: "Lamsano Sym est un projet artisanal qui unit la touche du cuir authentique à l'âme de l'œuvre d'art. Chaque pièce est façonnée à la main avec passion, portant en elle une histoire unique qui vous ressemble." },
    team: { title: "Notre équipe", subtitle: "Cinq personnes réunies par la passion de l'artisanat et de l'art" },
    testimonials: { title: "Ce que disent nos clients" },
    contact: { title: "Contactez-nous", subtitle: "Nous sommes ravis de recevoir vos questions et commandes", whatsappBtn: "Écrivez-nous sur WhatsApp" },
    cart: { title: "Votre panier", empty: "Votre panier est vide", total: "Total", checkout: "Envoyer la commande via WhatsApp", remove: "Retirer" },
    footer: { rights: "Tous droits réservés" },
  },
  en: {
    dir: "ltr",
    nav: { home: "Home", products: "Products", customizer: "Customizer", about: "About Us", team: "Team", testimonials: "Reviews", contact: "Contact", cart: "Cart" },
    home: { tagline: "Where every touch becomes a work of art", cta: "Discover the Collection" },
    products: { title: "Our Products", subtitle: "Carefully curated pieces, leather bags and authentic canvases", explore: "Discover More", addToCart: "Add to Cart", close: "Close" },
    allProducts: { title: "All Products", back: "Back to Home", all: "All", bags: "Bags", art: "Canvases" },
    customizer: { title: "Customize Your Order", subtitle: "Describe your idea, or draw it yourself", type: "Product Type", bag: "Handbag", painting: "Canvas", descLabel: "Order Description", descPlaceholder: "Describe the design you'd like...", nameLabel: "Full Name", namePlaceholder: "Your name", phoneLabel: "Phone Number", phonePlaceholder: "Contact number", drawTitle: "Or sketch your design", clear: "Clear", download: "Download Sketch", color: "Color", size: "Brush size", submit: "Send via WhatsApp" },
    about: { title: "About Us", text: "Lamsano Sym is a handcrafted project uniting the touch of authentic leather with the soul of fine art. Every piece is made by hand with passion, carrying a unique story that suits your taste." },
    team: { title: "Our Team", subtitle: "Five people united by a passion for craft and art" },
    testimonials: { title: "What Our Clients Say" },
    contact: { title: "Get in Touch", subtitle: "We'd love to hear your questions and orders", whatsappBtn: "Message us on WhatsApp" },
    cart: { title: "Your Cart", empty: "Your cart is currently empty", total: "Total", checkout: "Send order via WhatsApp", remove: "Remove" },
    footer: { rights: "All rights reserved" },
  },
};

/* =========================================================================
   HOOKS
   ========================================================================= */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(28px)",
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* =========================================================================
   SMALL UI PIECES
   ========================================================================= */
function Stars({ rating, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          strokeWidth={1.5}
          color={COLORS.primary}
          fill={n <= Math.round(rating) ? COLORS.primary : "transparent"}
        />
      ))}
    </div>
  );
}

function ProductSwatch({ product, className = "" }) {
  if (product.image) {
    return <img src={product.image} alt={product.name.en} className={`w-full h-full object-cover ${className}`} />;
  }
  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
      style={{ background: `linear-gradient(135deg, ${product.colors[0]}, ${product.colors[1]})` }}
    >
      {product.category === "bag" ? (
        <ShoppingBag size={48} color="rgba(255,255,255,0.85)" strokeWidth={1.2} />
      ) : (
        <ImageIcon size={48} color="rgba(255,255,255,0.85)" strokeWidth={1.2} />
      )}
    </div>
  );
}

function PriceTag({ price }) {
  return <span style={{ color: COLORS.primaryDark }} className="font-semibold">{price} DH</span>;
}

/* =========================================================================
   NAVBAR
   ========================================================================= */
function Navbar({ t, lang, setLang, sectionsRef, page, setPage, cartCount, onOpenCart }) {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const go = (key) => {
    setOpen(false);
    if (page !== "home") {
      setPage("home");
      setTimeout(() => sectionsRef.current[key]?.scrollIntoView({ behavior: "smooth" }), 60);
    } else {
      sectionsRef.current[key]?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const links = ["home", "products", "customizer", "about", "team", "testimonials", "contact"];

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 md:px-10 py-3 backdrop-blur-md"
      style={{ background: "rgba(255,255,255,0.82)", borderBottom: `1px solid ${COLORS.cream}` }}
    >
      <button onClick={() => go("home")} className="text-xl md:text-2xl font-bold tracking-wide" style={{ color: COLORS.primaryDark }}>
        LAMSANO <span style={{ color: COLORS.primary }}>SYM</span>
      </button>

      <div className="hidden lg:flex items-center gap-6">
        {links.map((key) => (
          <button
            key={key}
            onClick={() => go(key)}
            className="text-sm tracking-wide hover:opacity-70 transition-opacity"
            style={{ color: COLORS.ink }}
          >
            {t.nav[key]}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setLangOpen((v) => !v)}
            className="flex items-center gap-1 text-sm px-2 py-1 rounded-full border"
            style={{ borderColor: COLORS.primary, color: COLORS.primaryDark }}
          >
            <Globe size={15} /> {lang.toUpperCase()}
          </button>
          {langOpen && (
            <div className="absolute mt-2 bg-white shadow-lg rounded-lg overflow-hidden border" style={{ borderColor: COLORS.cream, insetInlineEnd: 0 }}>
              {["ar", "fr", "en"].map((l) => (
                <button
                  key={l}
                  onClick={() => { setLang(l); setLangOpen(false); }}
                  className="block w-full px-4 py-2 text-sm hover:opacity-70 text-start"
                  style={{ color: COLORS.ink, background: l === lang ? COLORS.cream : "transparent" }}
                >
                  {l === "ar" ? "العربية" : l === "fr" ? "Français" : "English"}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={onOpenCart} className="relative p-2 rounded-full" style={{ background: COLORS.cream }}>
          <ShoppingCart size={18} color={COLORS.primaryDark} />
          {cartCount > 0 && (
            <span
              className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white"
              style={{ background: COLORS.primary }}
            >
              {cartCount}
            </span>
          )}
        </button>

        <button className="lg:hidden p-2" onClick={() => setOpen((v) => !v)}>
          <Menu size={22} color={COLORS.primaryDark} />
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg flex flex-col lg:hidden" style={{ borderTop: `1px solid ${COLORS.cream}` }}>
          {links.map((key) => (
            <button key={key} onClick={() => go(key)} className="text-start px-6 py-3 text-sm border-b" style={{ color: COLORS.ink, borderColor: COLORS.cream }}>
              {t.nav[key]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   CART PANEL
   ========================================================================= */
function CartPanel({ open, onClose, cart, setCart, t, lang }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { if (open) setMounted(true); }, [open]);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (!mounted) return null; // never rendered until the cart button is clicked at least once

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
    );
  };
  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const sendOrder = () => {
    const lines = cart.map((i) => `• ${i.name[lang]} x${i.qty} — ${i.price * i.qty} DH`).join("\n");
    const msg = `${t.cart.title}:\n${lines}\n\n${t.cart.total}: ${total} DH`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
      />
      <div
        className="fixed top-0 bottom-0 z-50 w-[90%] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300"
        style={{
          left: lang === "ar" ? 0 : "auto",
          right: lang === "ar" ? "auto" : 0,
          transform: open ? "translateX(0)" : lang === "ar" ? "translateX(-105%)" : "translateX(105%)",
        }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${COLORS.cream}` }}>
          <h3 className="font-semibold text-lg" style={{ color: COLORS.primaryDark }}>{t.cart.title}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {cart.length === 0 && <p className="text-sm text-center mt-10 opacity-60">{t.cart.empty}</p>}
          {cart.map((item) => (
            <div key={item.id} className="flex gap-3 items-center">
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                <ProductSwatch product={item} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: COLORS.ink }}>{item.name[lang]}</p>
                <PriceTag price={item.price} />
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-full border flex items-center justify-center" style={{ borderColor: COLORS.primary }}><Minus size={12} /></button>
                  <span className="text-sm w-5 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-full border flex items-center justify-center" style={{ borderColor: COLORS.primary }}><Plus size={12} /></button>
                  <button onClick={() => removeItem(item.id)} className="text-xs opacity-60 hover:opacity-100 ms-2">{t.cart.remove}</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="p-5" style={{ borderTop: `1px solid ${COLORS.cream}` }}>
            <div className="flex justify-between mb-3 text-sm font-medium">
              <span>{t.cart.total}</span>
              <PriceTag price={total} />
            </div>
            <button
              onClick={sendOrder}
              className="w-full py-3 rounded-full text-white text-sm font-medium flex items-center justify-center gap-2"
              style={{ background: COLORS.primary }}
            >
              <Send size={15} /> {t.cart.checkout}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* =========================================================================
   PRODUCT MODAL (split view)
   ========================================================================= */
function ProductModal({ product, onClose, addToCart, t, lang }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl overflow-hidden w-full max-w-3xl flex flex-col md:flex-row shadow-2xl max-h-[90vh]"
      >
        <div className="md:w-1/2 h-56 md:h-auto">
          <ProductSwatch product={product} />
        </div>
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col gap-4 relative overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 end-4"><X size={20} /></button>
          <span className="text-xs uppercase tracking-widest opacity-60">{product.category === "bag" ? t.allProducts.bags : t.allProducts.art}</span>
          <h3 className="text-2xl font-semibold" style={{ color: COLORS.primaryDark, fontFamily: "'Cormorant Garamond', serif" }}>{product.name[lang]}</h3>
          <Stars rating={product.rating} />
          <p className="text-sm leading-relaxed opacity-80">{product.desc[lang]}</p>
          <div className="text-2xl"><PriceTag price={product.price} /></div>
          <button
            onClick={() => { addToCart(product); onClose(); }}
            className="mt-2 w-full py-3 rounded-full text-white text-sm font-medium flex items-center justify-center gap-2"
            style={{ background: COLORS.primary }}
          >
            <ShoppingBag size={16} /> {t.products.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   HOME SECTION
   ========================================================================= */
function HomeSection({ sectionRef, t, lang, goProducts }) {
  const featured = useMemo(() => PRODUCTS.slice(0, 3), []);
  const [idx, setIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0); 

  useEffect(() => {
    const iv = setInterval(() => {
      setIdx((prev) => (prev + 1) % featured.length);
    }, 4000);
    return () => clearInterval(iv);
  }, [featured.length]);

  useEffect(() => {
    const animInterval = setInterval(() => {
      setAnimKey((prev) => prev + 1);
    }, 4000); // يتكرر كل 2 ثانية (2000ms)
    return () => clearInterval(animInterval);
  }, []);

  const brand = "LAMSANO SYM";

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-black text-white"
    >
      {/* 1. خلفية الصور الملساء الناعمة */}
      {featured.map((p, i) => (
        <div
          key={p.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
            i === idx
              ? "opacity-100 scale-100 filter-none"
              : "opacity-0 scale-105 blur-sm"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 z-10" />
          <ProductSwatch product={p} className="w-full h-full object-cover" />
        </div>
      ))}

      {/* 2. الإضاءة الخلفية المحيطية */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-25 blur-3xl z-20 pointer-events-none"
        style={{ background: COLORS.primaryLight }}
      />
      <div
        className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full opacity-25 blur-3xl z-20 pointer-events-none"
        style={{ background: COLORS.primary }}
      />

      {/* 3. المحتوى المركزي */}
      <div className="relative z-30 text-center max-w-4xl px-4 flex flex-col items-center">
        
        {/* اسم العلامة التجارية المتكرر كل ثانيتين */}
        <h1
          key={animKey} /* إجبار إعادة الأنيميشن عند تغير المفتاح */
          dir="ltr"
          className="lamsano-logo flex flex-wrap justify-center gap-x-2 text-5xl md:text-8xl font-black mb-4 tracking-tight drop-shadow-2xl"
        >
          {brand.split("").map((ch, i) => (
            <span
              key={i}
              className="lamsano-letter"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </h1>

        {/* الوصف */}
        <p
          className="text-lg md:text-2xl mb-8 max-w-2xl font-light leading-relaxed text-gray-200 drop-shadow-md"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {t.home.tagline}
        </p>

        {/* زر التفاعل */}
        <button
          onClick={goProducts}
          className="group relative px-9 py-3.5 rounded-full text-white text-base font-semibold tracking-wider shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden mb-12"
          style={{ background: COLORS.primary }}
        >
          <span className="relative z-10">{t.home.cta}</span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
        </button>

        {/* المؤشرات المصغرة للصور الثلاث */}
        <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 shadow-2xl">
          {featured.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setIdx(i)}
              className={`relative overflow-hidden rounded-lg transition-all duration-500 ${
                i === idx
                  ? "w-14 h-14 ring-2 ring-white scale-105 shadow-xl"
                  : "w-10 h-10 opacity-50 hover:opacity-80 scale-95"
              }`}
            >
              <ProductSwatch product={p} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* 4. إعدادات الأنيميشن المكررة */}
      <style>{`
        .lamsano-letter {
          display: inline-block;
          background: linear-gradient(135deg, #ffffff 20%, ${COLORS.primaryLight} 50%, #ffffff 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          opacity: 0;
          transform: translateY(18px);
          animation: lamsanoWave 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes lamsanoWave {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.95);
            filter: blur(4px);
          }
          50% {
            opacity: 1;
            transform: translateY(-2px) scale(1.02);
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
      `}</style>
    </section>
  );
}

/* =========================================================================
   PRODUCTS SECTION (peek carousel)
   ========================================================================= */
function ProductsSection({ sectionRef, t, lang, addToCart, goAllProducts }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showText, setShowText] = useState(true);
  const n = PRODUCTS.length;

  const get = (offset) => PRODUCTS[(idx + offset + n) % n];
  const current = get(0);

  const go = (newIdx) => setIdx(newIdx);
  const prev = () => go((idx - 1 + n) % n);
  const next = () => go((idx + 1) % n);

  useEffect(() => {
    setShowText(false);
    const timer = setTimeout(() => setShowText(true), 700);
    return () => clearTimeout(timer);
  }, [idx]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate w-full py-16 md:py-24 px-4 md:px-10 flex items-center justify-center"
      style={{ background: COLORS.white }}
    >
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoomIn {
          from { transform: scale(1.12); opacity: .6; }
          to   { transform: scale(1); opacity: 1; }
        }
        .fsu-1 { animation: fadeSlideUp .6s ease .05s both; }
        .fsu-2 { animation: fadeSlideUp .6s ease .18s both; }
        .fsu-3 { animation: fadeSlideUp .6s ease .30s both; }
        .fsu-4 { animation: fadeSlideUp .6s ease .42s both; }
        .zoom-anim { animation: zoomIn .8s ease both; }
      `}</style>

      {/* الإطار الكبير: يحتوي الصورة + النص + الأزرار، ولا يأخذ كامل الـ section */}
      <div
        className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl"
        style={{ height: "min(70vh, 560px)" }}
      >
        {/* الصورة الكبيرة داخل الإطار فقط */}
        <div key={"bg-" + current.id} className="absolute inset-0 zoom-anim">
          <img
            src={current.image}
            alt={current.name[lang]}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,.6) 15%, rgba(0,0,0,.15) 55%, rgba(0,0,0,0) 75%)",
            }}
          />
        </div>

        {/* النص فوق الصورة، داخل نفس الإطار */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center px-8 md:px-12 max-w-md text-white">
          {showText && (
            <>
              <h2
                key={"t-" + current.id}
                className="fsu-1 text-2xl md:text-4xl font-semibold mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {current.name[lang]}
              </h2>
              <p key={"d-" + current.id} className="fsu-2 text-sm opacity-85 mb-5 leading-relaxed">
                {current.description ? current.description[lang] : t.products.subtitle}
              </p>
              <div key={"b-" + current.id} className="fsu-3 flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setSelected(current)}
                  className="px-6 py-2.5 rounded-full text-sm tracking-wide bg-white font-medium"
                  style={{ color: COLORS.primaryDark }}
                >
                  {t.products.explore}
                </button>
              </div>
            </>
          )}
        </div>

        {/* أزرار التالي/السابق داخل الإطار */}
        <div className="absolute bottom-6 start-8 z-20 flex gap-3">
          <button onClick={prev} className="p-2.5 rounded-full shadow-md bg-white" style={{ color: COLORS.primaryDark }}>
            <ChevronLeft size={18} style={{ transform: lang === "ar" ? "rotate(180deg)" : "none" }} />
          </button>
          <button onClick={next} className="p-2.5 rounded-full shadow-md bg-white" style={{ color: COLORS.primaryDark }}>
            <ChevronRight size={18} style={{ transform: lang === "ar" ? "rotate(180deg)" : "none" }} />
          </button>
        </div>

        {/* الإطارات الصغيرة للصور القادمة، متراكبة على حافة الإطار الكبير */}
        <div className="absolute top-1/2 -translate-y-1/2 end-0 translate-x-1/3 md:translate-x-1/4 z-20 flex items-center gap-3 md:gap-4">
          {[1, 2, 3].map((offset, i) => {
            if (offset >= n) return null;
            const p = get(offset);
            return (
              <div
                key={offset + "-" + p.id}
                onClick={() => go((idx + offset) % n)}
                className="rounded-2xl overflow-hidden shadow-xl cursor-pointer transition-all duration-500 flex-shrink-0"
                style={{
                  width: "min(16vw, 130px)",
                  height: i === 1 ? "min(38vh, 280px)" : "min(30vh, 220px)",
                  transform: i === 1 ? "translateY(0)" : i === 0 ? "translateY(-10%)" : "translateY(10%)",
                  border: "3px solid white",
                }}
              >
                <ProductSwatch product={p} />
              </div>
            );
          })}
        </div>
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} addToCart={addToCart} t={t} lang={lang} />
    </section>
  );
}

/* =========================================================================
   ALL PRODUCTS PAGE
   ========================================================================= */
function AllProductsPage({ t, lang, addToCart, goHome }) {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const list = PRODUCTS.filter((p) => filter === "all" || p.category === filter);

  return (
    <div className="min-h-screen px-5 md:px-10 pt-28 pb-16" style={{ background: COLORS.white }}>
      <button onClick={goHome} className="text-sm mb-6 opacity-70 hover:opacity-100" style={{ color: COLORS.primaryDark }}>
        {lang === "ar" ? "→" : "←"} {t.allProducts.back}
      </button>
      <h2 className="text-3xl md:text-4xl font-semibold mb-6" style={{ color: COLORS.primaryDark, fontFamily: "'Cormorant Garamond', serif" }}>{t.allProducts.title}</h2>

      <div className="flex gap-3 mb-10">
        {["all", "bag", "art"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-full text-sm border"
            style={{
              borderColor: COLORS.primary,
              background: filter === f ? COLORS.primary : "transparent",
              color: filter === f ? "#fff" : COLORS.primaryDark,
            }}
          >
            {f === "all" ? t.allProducts.all : f === "bag" ? t.allProducts.bags : t.allProducts.art}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {list.map((p) => (
          <Reveal key={p.id}>
            <div className="rounded-2xl overflow-hidden shadow-md bg-white flex flex-col">
              <div onClick={() => setSelected(p)} className="h-40 md:h-48 cursor-pointer">
                <ProductSwatch product={p} />
              </div>
              <div className="p-4 flex flex-col gap-1">
                <p className="text-sm font-medium" style={{ color: COLORS.ink }}>{p.name[lang]}</p>
                <Stars rating={p.rating} size={13} />
                <div className="flex items-center justify-between mt-2">
                  <PriceTag price={p.price} />
                  <button onClick={() => addToCart(p)} className="p-2 rounded-full" style={{ background: COLORS.cream }}>
                    <ShoppingBag size={15} color={COLORS.primaryDark} />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} addToCart={addToCart} t={t} lang={lang} />
    </div>
  );
}

/* =========================================================================
   CUSTOMIZER SECTION
   ========================================================================= */
function CustomizerSection({ sectionRef, t, lang }) {
  const [type, setType] = useState("bag");
  const [desc, setDesc] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [color, setColor] = useState(COLORS.primaryDark);
  const [brush, setBrush] = useState(4);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: ((clientX - rect.left) / rect.width) * canvas.width, y: ((clientY - rect.top) / rect.height) * canvas.height };
  };

  const start = (e) => {
    drawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brush;
    ctx.lineCap = "round";
    ctx.stroke();
  };
  const end = () => { drawing.current = false; };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadSketch = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "lamsano-sym-design.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const submit = () => {
    const msg = `${t.customizer.title}\n${t.customizer.type}: ${type === "bag" ? t.customizer.bag : t.customizer.painting}\n${t.customizer.descLabel}: ${desc || "-"}\n${t.customizer.nameLabel}: ${name || "-"}\n${t.customizer.phoneLabel}: ${phone || "-"}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const palette = [COLORS.ink, COLORS.primaryDark, COLORS.primary, COLORS.primaryLight, "#7A9E7E", "#A65D57"];

  return (
    <section ref={sectionRef} className="min-h-screen flex flex-col items-center justify-center px-5 md:px-10 py-24" style={{ background: COLORS.cream }}>
      <Reveal className="text-center mb-10 max-w-xl">
        <h2 className="text-3xl md:text-4xl font-semibold mb-2" style={{ color: COLORS.primaryDark, fontFamily: "'Cormorant Garamond', serif" }}>{t.customizer.title}</h2>
        <p className="text-sm md:text-base opacity-70">{t.customizer.subtitle}</p>
      </Reveal>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Reveal className="bg-white rounded-2xl p-6 shadow-md flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: COLORS.ink }}>{t.customizer.type}</label>
            <div className="flex gap-3">
              {["bag", "painting"].map((ty) => (
                <button
                  key={ty}
                  onClick={() => setType(ty)}
                  className="px-4 py-2 rounded-full text-sm border"
                  style={{ borderColor: COLORS.primary, background: type === ty ? COLORS.primary : "transparent", color: type === ty ? "#fff" : COLORS.primaryDark }}
                >
                  {ty === "bag" ? t.customizer.bag : t.customizer.painting}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: COLORS.ink }}>{t.customizer.descLabel}</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={t.customizer.descPlaceholder}
              rows={4}
              className="w-full rounded-xl border p-3 text-sm outline-none"
              style={{ borderColor: COLORS.cream }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-2" style={{ color: COLORS.ink }}>{t.customizer.nameLabel}</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.customizer.namePlaceholder} className="w-full rounded-xl border p-3 text-sm outline-none" style={{ borderColor: COLORS.cream }} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2" style={{ color: COLORS.ink }}>{t.customizer.phoneLabel}</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.customizer.phonePlaceholder} className="w-full rounded-xl border p-3 text-sm outline-none" style={{ borderColor: COLORS.cream }} />
            </div>
          </div>

          <button onClick={submit} className="mt-2 w-full py-3 rounded-full text-white text-sm font-medium flex items-center justify-center gap-2" style={{ background: COLORS.primary }}>
            <Send size={15} /> {t.customizer.submit}
          </button>
        </Reveal>

        <Reveal delay={150} className="bg-white rounded-2xl p-6 shadow-md flex flex-col gap-4">
          <label className="text-sm font-medium flex items-center gap-2" style={{ color: COLORS.ink }}>
            <Brush size={15} /> {t.customizer.drawTitle}
          </label>
          <canvas
            ref={canvasRef}
            width={400}
            height={280}
            className="w-full rounded-xl border touch-none"
            style={{ borderColor: COLORS.cream, cursor: "crosshair" }}
            onMouseDown={start}
            onMouseMove={move}
            onMouseUp={end}
            onMouseLeave={end}
            onTouchStart={start}
            onTouchMove={move}
            onTouchEnd={end}
          />
          <div className="flex items-center gap-2">
            {palette.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-6 h-6 rounded-full border-2"
                style={{ background: c, borderColor: color === c ? COLORS.ink : "transparent" }}
              />
            ))}
            <input type="range" min="1" max="12" value={brush} onChange={(e) => setBrush(Number(e.target.value))} className="ms-2 flex-1" />
          </div>
          <div className="flex gap-3">
            <button onClick={clearCanvas} className="flex-1 py-2 rounded-full border text-sm flex items-center justify-center gap-1" style={{ borderColor: COLORS.primary, color: COLORS.primaryDark }}>
              <Trash2 size={14} /> {t.customizer.clear}
            </button>
            <button onClick={downloadSketch} className="flex-1 py-2 rounded-full border text-sm flex items-center justify-center gap-1" style={{ borderColor: COLORS.primary, color: COLORS.primaryDark }}>
              <Download size={14} /> {t.customizer.download}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================================
   ABOUT SECTION
   ========================================================================= */
function AboutSection({ sectionRef, t }) {
  return (
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center px-6 py-24" style={{ background: COLORS.white }}>
      <Reveal className="max-w-2xl text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6" style={{ color: COLORS.primaryDark, fontFamily: "'Cormorant Garamond', serif" }}>{t.about.title}</h2>
        <p className="text-base md:text-lg leading-loose opacity-80" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.about.text}</p>
      </Reveal>
    </section>
  );
}

/* =========================================================================
   TEAM SECTION
   ========================================================================= */
function TeamSection({ sectionRef, t, lang }) {
  return (
    <section
      ref={sectionRef}
      className="h-full flex flex-col items-center justify-center px-4 md:px-6 py-10 md:py-24 overflow-y-auto"
      style={{ background: COLORS.cream }}
    >
      <Reveal className="text-center mb-6 md:mb-12 max-w-xl shrink-0">
        <h2 className="text-2xl md:text-4xl font-semibold mb-2" style={{ color: COLORS.primaryDark, fontFamily: "'Cormorant Garamond', serif" }}>
          {t.team.title}
        </h2>
        <p className="text-xs md:text-base opacity-70">{t.team.subtitle}</p>
      </Reveal>

      {/* شبكة متجاوبة: عمودان على الموبايل، تتوسع تلقائيًا في الشاشات الأكبر */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap justify-center gap-3 md:gap-6 max-w-7xl w-full">
        {TEAM.map((m, i) => (
          <Reveal key={m.id} delay={i * 80}>
            <div className="w-full md:w-56 relative group overflow-hidden bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg">
              <div className="w-full aspect-[3/4] md:h-80 overflow-hidden">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>

              <div className="absolute bottom-2 left-2 right-2 md:bottom-3 md:left-3 md:right-3 bg-white p-2 md:p-3 shadow-md">
                <p className="text-xs md:text-sm font-bold truncate" style={{ color: COLORS.ink }}>
                  {m.name}
                </p>
                <p className="text-[10px] md:text-xs text-gray-500 truncate mt-0.5">
                  {m.role[lang]}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
/* =========================================================================
   TESTIMONIALS SECTION
   ========================================================================= */
function TestimonialsSection({ sectionRef, t, lang }) {
  return (
    <section ref={sectionRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-24" style={{ background: COLORS.white }}>
      <Reveal className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold" style={{ color: COLORS.primaryDark, fontFamily: "'Cormorant Garamond', serif" }}>{t.testimonials.title}</h2>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">
        {TESTIMONIALS.map((r, i) => (
          <Reveal key={r.id} delay={i * 100}>
            <div className="rounded-2xl p-6 h-full flex flex-col gap-3" style={{ background: COLORS.cream }}>
              <Stars rating={r.rating} size={14} />
              <p className="text-sm leading-relaxed opacity-80" style={{ fontFamily: "'Cormorant Garamond', serif" }}>"{r.text[lang]}"</p>
              <p className="text-xs font-medium mt-auto" style={{ color: COLORS.primaryDark }}>{r.name}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   CONTACT SECTION
   ========================================================================= */
function ContactSection({ sectionRef, t }) {
  return (
    <section ref={sectionRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-24" style={{ background: COLORS.cream }}>
      <Reveal className="text-center max-w-lg">
        <h2 className="text-3xl md:text-4xl font-semibold mb-2" style={{ color: COLORS.primaryDark, fontFamily: "'Cormorant Garamond', serif" }}>{t.contact.title}</h2>
        <p className="text-sm md:text-base opacity-70 mb-8">{t.contact.subtitle}</p>

        <div className="flex flex-col gap-4 items-center mb-8">
          <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.ink }}><Phone size={15} /> +{WHATSAPP_NUMBER}</div>
          <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.ink }}><Mail size={15} /> contact@lamsanosym.com</div>
          <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.ink }}><MapPin size={15} /> Morocco</div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <a href="#" className="p-3 rounded-full" style={{ background: COLORS.white }}><Instagram size={18} color={COLORS.primaryDark} /></a>
          <a href="#" className="p-3 rounded-full" style={{ background: COLORS.white }}><Facebook size={18} color={COLORS.primaryDark} /></a>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-white text-sm"
          style={{ background: COLORS.primary }}
        >
          <Send size={15} /> {t.contact.whatsappBtn}
        </a>
      </Reveal>
    </section>
  );
}
function FullPageScroller({ children }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const containerRef = useRef(null);
  const touchStartY = useRef(0);
  const total = React.Children.count(children);

  const goTo = useCallback((index) => {
    if (index < 0 || index >= total || animating) return;
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => setAnimating(false), 900); // يجب أن يطابق مدة transition بالأسفل
  }, [total, animating]);

  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();
      if (animating) return;
      if (e.deltaY > 30) goTo(current + 1);
      else if (e.deltaY < -30) goTo(current - 1);
    };

    const onKeyDown = (e) => {
      if (animating) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") goTo(current + 1);
      if (e.key === "ArrowUp" || e.key === "PageUp") goTo(current - 1);
    };

    const onTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
      if (animating) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (delta > 50) goTo(current + 1);
      else if (delta < -50) goTo(current - 1);
    };

    const el = containerRef.current;
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [current, animating, goTo]);

  // نعرض هذا المكوّن الأداة للتنقل الخارجي (روابط الـ Navbar)
  FullPageScroller.goToIndex = goTo;

  return (
    <div ref={containerRef} className="fullpage-viewport">
      <div
        className="fullpage-track"
        style={{ transform: `translateY(-${current * 100}vh)` }}
      >
        {React.Children.map(children, (child, i) => (
          <div className="fullpage-slide">{child}</div>
        ))}
      </div>
    </div>
  );
}
/* =========================================================================
   APP ROOT
   ========================================================================= */
export default function App() {
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const t = T[lang];
  const dir = t.dir;

  const sectionsRef = useRef({});
  const setRef = (key) => (el) => { sectionsRef.current[key] = el; };

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (found) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const goProducts = () => sectionsRef.current["products"]?.scrollIntoView({ behavior: "smooth" });
  const goAllProducts = () => { setPage("all"); window.scrollTo({ top: 0 }); };
  const goHome = () => { setPage("home"); setTimeout(() => sectionsRef.current["products"]?.scrollIntoView({ behavior: "smooth" }), 60); };

  return (
    <div dir={dir} style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.ink }}>
  <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap');
  ::selection { background: ${COLORS.primaryLight}; color: #fff; }

  .fullpage-viewport {
    height: 100vh;
    overflow: hidden;
    position: relative;
  }
  .fullpage-track {
    transition: transform 0.9s cubic-bezier(0.65, 0, 0.35, 1);
    will-change: transform;
  }
  .fullpage-slide {
    height: 100vh;
    width: 100%;
    overflow: hidden;
    position: relative;
    isolation: isolate;
  }
  .fullpage-slide > section {
    height: 100vh !important;
    min-height: 100vh !important;
  }
`}</style>

      <Navbar
        t={t} lang={lang} setLang={setLang}
        sectionsRef={sectionsRef} page={page} setPage={setPage}
        cartCount={cartCount} onOpenCart={() => setCartOpen(true)}
      />

{page === "home" ? (
  <FullPageScroller>
    <HomeSection sectionRef={setRef("home")} t={t} lang={lang} goProducts={goProducts} />
    <ProductsSection sectionRef={setRef("products")} t={t} lang={lang} addToCart={addToCart} goAllProducts={goAllProducts} />
    <CustomizerSection sectionRef={setRef("customizer")} t={t} lang={lang} />
    <AboutSection sectionRef={setRef("about")} t={t} />
    <TeamSection sectionRef={setRef("team")} t={t} lang={lang} />
    <TestimonialsSection sectionRef={setRef("testimonials")} t={t} lang={lang} />
    <ContactSection sectionRef={setRef("contact")} t={t} />
    <div className="fullpage-slide">
      <footer className="h-full flex items-center justify-center text-center py-6 text-xs opacity-60" style={{ background: COLORS.white }}>
        Lamsano Sym © {new Date().getFullYear()} — {t.footer.rights}
      </footer>
    </div>
  </FullPageScroller>
) : (
  <AllProductsPage t={t} lang={lang} addToCart={addToCart} goHome={goHome} />
)}

      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setCart={setCart} t={t} lang={lang} />
    </div>
  );
}