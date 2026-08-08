import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  ChevronLeft, ChevronRight, ShoppingBag, X, Star, Plus, Minus, Globe,
  Send, Palette, Trash2, Download, Phone, Mail,
  MapPin, ShoppingCart, Menu, Image as ImageIcon, Brush,
} from "lucide-react";

// lucide-react dropped brand/logo icons (Instagram, Facebook, etc.) from its
// set some versions ago — importing "Instagram" from it resolves to
// `undefined`, and rendering an undefined component crashes the whole React
// tree (blank white screen, no visible error). A small inline SVG avoids
// depending on the icon library for this one brand mark.
function InstagramIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

/* =========================================================================
   EDITABLE DATA — replace with your real products, images, team & number
   ========================================================================= */

const WHATSAPP_NUMBER = "212607141572"; // TODO: replace with your real WhatsApp number (no +, no spaces)
const INSTAGRAM_URL = "https://www.instagram.com/lamsano____sym?igsh=MTJ2Mmd1Z2NvY2Vydw=="; // TODO: replace with your real Instagram profile URL
const EMAIL_ADDRESS = "lamsanosym6@gmail.com"; // TODO: replace with your real email address

// image: null -> shows an elegant gradient placeholder. Set to a URL to use a real photo.
const PRODUCTS = [
  { id: 1, category: "bag", image: '/products/1000140605.png', colors: ["#B08A4A", "#8C6A3B"], price: 150, rating: 4.8,
    name: { ar: "حقيبة الغروب", fr: "Sac Couchant", en: "Sunset Bag" },
    desc: { ar: "جينز طبيعي بلمسة ذهبية، صُنِعَ يدوياً بأعلى درجات العناية.", fr: "Jean naturel à touche dorée, façonné à la main avec le plus grand soin.", en: "Natural denim with a golden touch, handcrafted with the utmost care." } },
  { id: 2, category: "bag", image: '/products/IMG-20260728-WA0034.jpg', colors: ["#C9A46C", "#8C6A3B"], price: 150, rating: 4.6,
    name: { ar: "حقيبة الأطلس", fr: "Sac Atlas", en: "Atlas Bag" },
    desc: { ar: "تصميم أنيق مستوحى من التراث، بخياطة يدوية دقيقة.", fr: "Design élégant inspiré du patrimoine, à la couture manuelle précise.", en: "An elegant design inspired by heritage, with precise hand-stitching." } },
  { id: 3, category: "bag", image: '/products/IMG-20260728-WA0038.jpg', colors: ["#8C6A3B", "#5C4527"], price: 90, rating: 4.7,
    name: { ar: "حقيبة الظل", fr: "Sac Ombre", en: "Shadow Bag" },
    desc: { ar: "خطوط بسيطة وجينز فاخر لإطلالة يومية أنيقة.", fr: "Lignes épurées et jean luxueux pour un look quotidien raffiné.", en: "Clean lines and luxurious demin for an elegant everyday look." } },
  { id: 4, category: "art", image: '/products/1000141182.png', colors: ["#EAD7C2", "#B08A4A"], price: 250, rating: 4.9,
    name: { ar: "لوحة الصحراء", fr: "Toile du Désert", en: "Desert Canvas" },
    desc: { ar: "ألوان دافئة تحاكي كثبان الصحراء عند الغروب.", fr: "Des teintes chaudes évoquant les dunes du désert au coucher du soleil.", en: "Warm tones echoing desert dunes at sunset." } },
  { id: 5, category: "art", image: null, colors: ["#D8C0A0", "#8C6A3B"], price: 230, rating: 4.5,
    name: { ar: "لوحة الأفق", fr: "Toile Horizon", en: "Horizon Canvas" },
    desc: { ar: "تجريد هادئ يعكس التقاء الأرض بالسماء.", fr: "Une abstraction paisible où la terre rencontre le ciel.", en: "A calm abstraction where land meets sky." } },
  { id: 7, category: "art", image: null, colors: ["#C9A46C", "#B08A4A"], price: 300, rating: 4.7,
    name: { ar: "لوحة النبض", fr: "Toile Pulsation", en: "Pulse Canvas" },
    desc: { ar: "حركة فرشاة نابضة بالحياة على قماش فني أصيل.", fr: "Un mouvement de pinceau vibrant sur toile artisanale authentique.", en: "A vibrant brush movement on an authentic artisan canvas." } },
  { id: 8, category: "art", image: null, colors: ["#C9A46C", "#B08A4A"], price: 250, rating: 4,
    name: { ar: "لوحة النبض", fr: "Toile Pulsation", en: "Pulse Canvas" },
    desc: { ar: "حركة فرشاة نابضة بالحياة على قماش فني أصيل.", fr: "Un mouvement de pinceau vibrant sur toile artisanale authentique.", en: "A vibrant brush movement on an authentic artisan canvas." } },
  { id: 9, category: "art", image: null, colors: ["#C9A46C", "#B08A4A"], price: 250, rating: 4,
    name: { ar: "لوحة النبض", fr: "Toile Pulsation", en: "Pulse Canvas" },
    desc: { ar: "حركة فرشاة نابضة بالحياة على قماش فني أصيل.", fr: "Un mouvement de pinceau vibrant sur toile artisanale authentique.", en: "A vibrant brush movement on an authentic artisan canvas." } },
];

// TODO: replace with your five real team members (name & role)
const TEAM = [
  { id: 3, name: "Sanae Amentag", role: { en: "Finance Manage", fr: "Gestion financière", ar: "إدارة الشؤون المالية" }, image: "/team/IMG-20251223-WA0112.jpg" },
  { id: 4, name: "Asmae Aben", role: { en: "Marketing Manager", fr: "Responsable marketing", ar: "مديرة تسويق" }, image: "/team/IMG-20260729-WA0021.jpg" },
  { id: 1, name: "Samira Amkhaou", role: { en: "Team Leader", fr: "Chef d'équipe", ar: "قائد الفريق" }, image: "/team/IMG-20260212-WA0030.jpg" },
  { id: 5, name: "Sana Fhad", role: { en: "Co-Finance & Operations", fr: "Co-responsable des finances et des opérations", ar: "التمويل والعمليات المشتركة" }, image: "/team/IMG-20260729-WA0022.jpg" },
  { id: 6, name: "Hiba Ben Thami", role: { en: "Social Media Manager", fr: "Responsable des réseaux sociaux", ar: "مديرة وسائل التواصل الاجتماعي" }, image: "/team/IMG-20260731-WA0000.jpg" },
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
    products: { title: "منتجاتنا", subtitle: "قطع مختارة بعناية، حقائب جينز ولوحات فنية أصيلة", explore: "اكتشف المزيد", addToCart: "أضف إلى السلة", close: "إغلاق", viewAll: "عرض جميع المنتجات" },
    allProducts: { title: "كل المنتجات", back: "عودة للرئيسية", all: "الكل", bags: "الحقائب", art: "اللوحات" },
    customizer: { title: "خصص طلبك", subtitle: "صف لنا فكرتك أو ارسمها بنفسك", type: "نوع المنتج", bag: "حقيبة يد", painting: "لوحة فنية", descLabel: "وصف الطلب", descPlaceholder: "اكتب تفاصيل التصميم الذي تريده...", nameLabel: "الاسم الكامل", namePlaceholder: "اسمك", phoneLabel: "رقم الهاتف", phonePlaceholder: "رقم للتواصل", drawTitle: "أو ارسم تصميمك", clear: "مسح", download: "تحميل الرسم", color: "اللون", size: "حجم الفرشاة", submit: "إرسال عبر واتساب" },
    about: { title: "من نحن", text: "Lamsano Sym مشروع حرفي يجمع بين لمسة الجينز الأصيل وروح اللوحة الفنية. كل قطعة تُصنع يدويًا بشغف، لتحمل بين طياتها قصة فريدة تليق بذائقتكم." },
    team: { title: "فريقنا", subtitle: "خمسة أفراد يجمعهم شغف الحرفة والفن" },
    testimonials: { title: "ماذا يقول عملاؤنا" },
    contact: { title: "تواصل معنا", subtitle: "يسعدنا استقبال استفساراتكم وطلباتكم", whatsappBtn: "راسلنا على واتساب" },
    cart: { title: "سلة الطلبات", empty: "سلتك فارغة حاليًا", total: "المجموع", checkout: "إرسال الطلب عبر واتساب", remove: "حذف", clearAll: "إفراغ السلة" },
    footer: { rights: "جميع الحقوق محفوظة" },
  },
  fr: {
    dir: "ltr",
    nav: { home: "Accueil", products: "Produits", customizer: "Personnaliser", about: "À propos", team: "Équipe", testimonials: "Avis", contact: "Contact", cart: "Panier" },
    home: { tagline: "Où chaque geste devient une œuvre d'art", cta: "Découvrir la collection" },
    products: { title: "Nos Produits", subtitle: "Des pièces sélectionnées avec soin, sacs en jean et toiles authentiques", explore: "Voir plus", addToCart: "Ajouter au panier", close: "Fermer", viewAll: "Voir tous les produits" },
    allProducts: { title: "Tous les produits", back: "Retour à l'accueil", all: "Tous", bags: "Sacs", art: "Toiles" },
    customizer: { title: "Personnalisez votre commande", subtitle: "Décrivez votre idée ou dessinez-la vous-même", type: "Type de produit", bag: "Sac à main", painting: "Toile", descLabel: "Description de la commande", descPlaceholder: "Décrivez le design que vous souhaitez...", nameLabel: "Nom complet", namePlaceholder: "Votre nom", phoneLabel: "Téléphone", phonePlaceholder: "Numéro de contact", drawTitle: "Ou dessinez votre design", clear: "Effacer", download: "Télécharger le dessin", color: "Couleur", size: "Taille du pinceau", submit: "Envoyer via WhatsApp" },
    about: { title: "À propos", text: "Lamsano Sym est un projet artisanal qui unit la touche du jean authentique à l'âme de l'œuvre d'art. Chaque pièce est façonnée à la main avec passion, portant en elle une histoire unique qui vous ressemble." },
    team: { title: "Notre équipe", subtitle: "Cinq personnes réunies par la passion de l'artisanat et de l'art" },
    testimonials: { title: "Ce que disent nos clients" },
    contact: { title: "Contactez-nous", subtitle: "Nous sommes ravis de recevoir vos questions et commandes", whatsappBtn: "Écrivez-nous sur WhatsApp" },
    cart: { title: "Votre panier", empty: "Votre panier est vide", total: "Total", checkout: "Envoyer la commande via WhatsApp", remove: "Retirer", clearAll: "Vider le panier" },
    footer: { rights: "Tous droits réservés" },
  },
  en: {
    dir: "ltr",
    nav: { home: "Home", products: "Products", customizer: "Customizer", about: "About Us", team: "Team", testimonials: "Reviews", contact: "Contact", cart: "Cart" },
    home: { tagline: "Where every touch becomes a work of art", cta: "Discover the Collection" },
    products: { title: "Our Products", subtitle: "Carefully curated pieces, demin bags and authentic canvases", explore: "Discover More", addToCart: "Add to Cart", close: "Close", viewAll: "View All Products" },
    allProducts: { title: "All Products", back: "Back to Home", all: "All", bags: "Bags", art: "Canvases" },
    customizer: { title: "Customize Your Order", subtitle: "Describe your idea, or draw it yourself", type: "Product Type", bag: "Handbag", painting: "Canvas", descLabel: "Order Description", descPlaceholder: "Describe the design you'd like...", nameLabel: "Full Name", namePlaceholder: "Your name", phoneLabel: "Phone Number", phonePlaceholder: "Contact number", drawTitle: "Or sketch your design", clear: "Clear", download: "Download Sketch", color: "Color", size: "Brush size", submit: "Send via WhatsApp" },
    about: { title: "About Us", text: "Lamsano Sym is a handcrafted project uniting the touch of authentic demin with the soul of fine art. Every piece is made by hand with passion, carrying a unique story that suits your taste." },
    team: { title: "Our Team", subtitle: "Five people united by a passion for craft and art" },
    testimonials: { title: "What Our Clients Say" },
    contact: { title: "Get in Touch", subtitle: "We'd love to hear your questions and orders", whatsappBtn: "Message us on WhatsApp" },
   cart: { title: "Your Cart", empty: "Your cart is currently empty", total: "Total", checkout: "Send order via WhatsApp", remove: "Remove", clearAll: "Clear All" },
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
function Navbar({ t, lang, setLang, page, setPage, cartCount, onOpenCart, activeKey, goToSection }) {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const go = (key) => {
    setOpen(false);
    goToSection(key);
  };

  const links = ["home", "products", "customizer", "about", "team", "testimonials", "contact"];

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 md:px-10 py-3 backdrop-blur-md"
      style={{ background: "rgba(255,255,255,0.82)", borderBottom: `1px solid ${COLORS.cream}` }}
    >
      <button onClick={() => go("home")} className="text-lg md:text-2xl font-bold tracking-wide whitespace-nowrap" style={{ color: COLORS.primaryDark }}>
        LAMSANO <span style={{ color: COLORS.primary }}>SYM</span>
      </button>

      <div className="hidden lg:flex items-center gap-1">
        {links.map((key) => {
          const isActive = page === "home" && activeKey === key;
          return (
            <button
              key={key}
              onClick={() => go(key)}
              className="relative text-sm tracking-wide px-4 py-1.5 rounded-full transition-colors duration-300"
              style={{
                color: isActive ? COLORS.white : COLORS.ink,
                background: isActive ? COLORS.primary : "transparent",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = COLORS.cream; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              {t.nav[key]}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="relative">
          <button
            onClick={() => setLangOpen((v) => !v)}
            className="flex items-center gap-1 text-sm px-2 py-1 rounded-full border"
            style={{ borderColor: COLORS.primary, color: COLORS.primaryDark }}
          >
            <Globe size={15} /> {lang.toUpperCase()}
          </button>
          {langOpen && (
            <div className="absolute mt-2 bg-white shadow-lg rounded-lg overflow-hidden border z-50" style={{ borderColor: COLORS.cream, insetInlineEnd: 0 }}>
              {["ar", "fr", "en"].map((l) => (
                <button
                  key={l}
                  onClick={() => { setLang(l); setLangOpen(false); }}
                  className="block w-full px-4 py-2 text-sm hover:opacity-70 text-start whitespace-nowrap"
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
          {links.map((key) => {
            const isActive = page === "home" && activeKey === key;
            return (
              <button
                key={key}
                onClick={() => go(key)}
                className="text-start px-6 py-3 text-sm border-b flex items-center gap-3"
                style={{ color: isActive ? COLORS.primaryDark : COLORS.ink, borderColor: COLORS.cream, background: isActive ? COLORS.cream : "transparent" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: isActive ? COLORS.primary : "transparent" }}
                />
                {t.nav[key]}
              </button>
            );
          })}
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

  if (!mounted) return null;

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
    );
  };
  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setCart([]);

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
          <div className="p-5 flex flex-col gap-3" style={{ borderTop: `1px solid ${COLORS.cream}` }}>
            <div className="flex justify-between text-sm font-medium">
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
            <button
              onClick={clearCart}
              className="w-full py-2.5 rounded-full text-sm font-medium flex items-center justify-center gap-2 border"
              style={{ borderColor: COLORS.primary, color: COLORS.primaryDark }}
            >
              <Trash2 size={14} /> {t.cart.clearAll}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
/* =========================================================================
   PRODUCT MODAL (split view) — rendered once, at the App root, so it is
   never trapped inside a transformed ancestor (fixes it not showing).
   ========================================================================= */
function ProductModal({ product, onClose, addToCart, t, lang }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl overflow-hidden w-full max-w-3xl flex flex-col md:flex-row shadow-2xl max-h-[90vh]"
      >
        <div className="md:w-1/2 h-56 md:h-auto shrink-0">
          <ProductSwatch product={product} />
        </div>
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col gap-3 md:gap-4 relative overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 end-4"><X size={20} /></button>
          <span className="text-xs uppercase tracking-widest opacity-60">{product.category === "bag" ? t.allProducts.bags : t.allProducts.art}</span>
          <h3 className="text-xl md:text-2xl font-semibold" style={{ color: COLORS.primaryDark, fontFamily: "'Cormorant Garamond', serif" }}>{product.name[lang]}</h3>
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
    }, 4000);
    return () => clearInterval(animInterval);
  }, []);

  // Two words rendered as separate blocks so a word is never split mid-way
  // on narrow screens; they stack on mobile and sit side by side from md up.
  const words = ["LAMSANO", "SYM"];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-black text-white"
    >
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

      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-25 blur-3xl z-20 pointer-events-none"
        style={{ background: COLORS.primaryLight }}
      />
      <div
        className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full opacity-25 blur-3xl z-20 pointer-events-none"
        style={{ background: COLORS.primary }}
      />

      <div className="relative z-30 text-center max-w-4xl px-4 flex flex-col items-center">
        <h1
          key={animKey}
          dir="ltr"
          className="lamsano-logo flex flex-col md:flex-row items-center justify-center gap-y-1 md:gap-x-4 text-5xl md:text-8xl font-black mb-4 tracking-tight drop-shadow-2xl"
        >
          {words.map((word, wi) => (
            <span key={wi} className="flex flex-nowrap">
              {word.split("").map((ch, i) => (
                <span
                  key={i}
                  className="lamsano-letter"
                  style={{ animationDelay: `${(wi * word.length + i) * 50}ms` }}
                >
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p
          className="text-base md:text-2xl mb-8 max-w-2xl font-light leading-relaxed text-gray-200 drop-shadow-md px-2"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {t.home.tagline}
        </p>

        <button
          onClick={goProducts}
          className="group relative px-9 py-3.5 rounded-full text-white text-base font-semibold tracking-wider shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden mb-10 md:mb-12"
          style={{ background: COLORS.primary }}
        >
          <span className="relative z-10">{t.home.cta}</span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
        </button>

        <div className="flex items-center gap-3 md:gap-4 bg-black/30 backdrop-blur-md px-3 md:px-4 py-2 md:py-2.5 rounded-full border border-white/10 shadow-2xl">
          {featured.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setIdx(i)}
              className={`relative overflow-hidden rounded-lg transition-all duration-500 ${
                i === idx
                  ? "w-12 h-12 md:w-14 md:h-14 ring-2 ring-white scale-105 shadow-xl"
                  : "w-9 h-9 md:w-10 md:h-10 opacity-50 hover:opacity-80 scale-95"
              }`}
            >
              <ProductSwatch product={p} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

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
          0% { opacity: 0; transform: translateY(18px) scale(0.95); filter: blur(4px); }
          50% { opacity: 1; transform: translateY(-2px) scale(1.02); filter: blur(0px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
      `}</style>
    </section>
  );
}

/* =========================================================================
   PRODUCTS SECTION (peek carousel) — shows only 6 items + a "view all" link
   ========================================================================= */
function ProductsSection({ sectionRef, t, lang, addToCart, goAllProducts, openProduct }) {
  const HOME_LIMIT = 6;
  const list = useMemo(() => PRODUCTS.slice(0, HOME_LIMIT), []);
  const [idx, setIdx] = useState(0);
  const [showText, setShowText] = useState(true);
  const n = list.length;

  const get = (offset) => list[(idx + offset + n) % n];
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
      className="relative isolate w-full py-10 md:py-24 px-4 md:px-10 flex flex-col items-center justify-center gap-6"
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
        .zoom-anim { animation: zoomIn .8s ease both; }
      `}</style>

      <div
        className="relative w-full max-w-5xl rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl"
        style={{ height: "min(66vh, 520px)" }}
      >
        <div key={"bg-" + current.id} className="absolute inset-0 zoom-anim">
          <ProductSwatch product={current} className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.35) 35%, rgba(0,0,0,.65) 100%)",
            }}
          />
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,.6) 15%, rgba(0,0,0,.15) 55%, rgba(0,0,0,0) 75%)",
            }}
          />
        </div>

        <div className="absolute inset-0 z-10 flex flex-col justify-end md:justify-center px-5 md:px-12 pb-20 md:pb-0 max-w-[90%] md:max-w-md text-white">
          {showText && (
            <>
              <h2
                key={"t-" + current.id}
                className="fsu-1 text-xl md:text-4xl font-semibold mb-2 md:mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {current.name[lang]}
              </h2>
              <p key={"d-" + current.id} className="fsu-2 text-xs md:text-sm opacity-90 mb-4 md:mb-5 leading-relaxed line-clamp-2 md:line-clamp-none">
                {current.desc[lang]}
              </p>
              <div key={"b-" + current.id} className="fsu-3 flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => openProduct(current)}
                  className="px-5 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm tracking-wide bg-white font-medium"
                  style={{ color: COLORS.primaryDark }}
                >
                  {t.products.explore}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="absolute bottom-4 md:bottom-6 start-5 md:start-8 z-20 flex gap-3">
          <button onClick={prev} className="p-2 md:p-2.5 rounded-full shadow-md bg-white" style={{ color: COLORS.primaryDark }}>
            <ChevronLeft size={16} style={{ transform: lang === "ar" ? "rotate(180deg)" : "none" }} />
          </button>
          <button onClick={next} className="p-2 md:p-2.5 rounded-full shadow-md bg-white" style={{ color: COLORS.primaryDark }}>
            <ChevronRight size={16} style={{ transform: lang === "ar" ? "rotate(180deg)" : "none" }} />
          </button>
        </div>

        {/* Stacked next-up previews — desktop/tablet only; on phones they
            crowded out the text, so they're hidden below md. */}
        <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 end-0 translate-x-1/4 z-20 items-center gap-4">
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

      <button
        onClick={goAllProducts}
        className="px-6 py-2.5 rounded-full text-sm font-medium border tracking-wide"
        style={{ borderColor: COLORS.primary, color: COLORS.primaryDark }}
      >
        {t.products.viewAll}
      </button>
    </section>
  );
}

/* =========================================================================
   ALL PRODUCTS PAGE
   ========================================================================= */
function AllProductsPage({ t, lang, addToCart, goHome, openProduct }) {
  const [filter, setFilter] = useState("all");
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
              <div onClick={() => openProduct(p)} className="h-40 md:h-48 cursor-pointer">
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
    e.stopPropagation();
    drawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e) => {
    e.stopPropagation();
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
  const end = (e) => { e.stopPropagation(); drawing.current = false; };

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
    // CHANGED: justify-center -> justify-start md:justify-center, px/py مصغّرة على الجوال
    <section ref={sectionRef} className="min-h-screen flex flex-col items-center justify-start md:justify-center px-3 md:px-10 py-3 md:py-24 overflow-y-auto">
      {/* CHANGED: mb-4 -> mb-2 */}
      <Reveal className="text-center mb-2 md:mb-10 max-w-xl shrink-0">
        {/* CHANGED: text-xl -> text-lg, mb-1 -> mb-0.5 */}
        <h2 className="text-lg md:text-4xl font-semibold mb-0.5 md:mb-2" style={{ color: COLORS.primaryDark, fontFamily: "'Cormorant Garamond', serif" }}>{t.customizer.title}</h2>
        {/* CHANGED: text-xs -> text-[11px] */}
        <p className="text-[11px] md:text-base opacity-70">{t.customizer.subtitle}</p>
      </Reveal>

      {/* CHANGED: gap-4 -> gap-3 */}
      <div className="grid md:grid-cols-2 gap-3 md:gap-8 w-full max-w-4xl">
        {/* CHANGED: p-4 -> p-3, gap-3 -> gap-2 */}
        <Reveal className="bg-white rounded-2xl p-3 md:p-6 shadow-md flex flex-col gap-2 md:gap-4">
          <div>
            {/* CHANGED: text-xs -> text-[11px], mb-2 -> mb-1 */}
            <label className="text-[11px] md:text-sm font-medium block mb-1 md:mb-2" style={{ color: COLORS.ink }}>{t.customizer.type}</label>
            {/* CHANGED: gap-3 -> gap-2 */}
            <div className="flex gap-2 md:gap-3">
              {["bag", "painting"].map((ty) => (
                <button
                  key={ty}
                  onClick={() => setType(ty)}
                  // CHANGED: px-4 py-2 -> px-3 py-1.5, text-xs -> text-[11px]
                  className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[11px] md:text-sm border"
                  style={{ borderColor: COLORS.primary, background: type === ty ? COLORS.primary : "transparent", color: type === ty ? "#fff" : COLORS.primaryDark }}
                >
                  {ty === "bag" ? t.customizer.bag : t.customizer.painting}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] md:text-sm font-medium block mb-1 md:mb-2" style={{ color: COLORS.ink }}>{t.customizer.descLabel}</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={t.customizer.descPlaceholder}
              rows={2}
              // CHANGED: p-3 -> p-2, text-sm -> text-xs
              className="w-full rounded-xl border p-2 md:p-3 text-xs md:text-sm outline-none"
              style={{ borderColor: COLORS.cream }}
            />
          </div>

          {/* CHANGED: gap-3 -> gap-2 */}
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <div>
              <label className="text-[11px] md:text-sm font-medium block mb-1 md:mb-2" style={{ color: COLORS.ink }}>{t.customizer.nameLabel}</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.customizer.namePlaceholder} className="w-full rounded-xl border p-2 md:p-3 text-xs md:text-sm outline-none" style={{ borderColor: COLORS.cream }} />
            </div>
            <div>
              <label className="text-[11px] md:text-sm font-medium block mb-1 md:mb-2" style={{ color: COLORS.ink }}>{t.customizer.phoneLabel}</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.customizer.phonePlaceholder} className="w-full rounded-xl border p-2 md:p-3 text-xs md:text-sm outline-none" style={{ borderColor: COLORS.cream }} />
            </div>
          </div>

          {/* CHANGED: mt-2 -> mt-1, py-3 -> py-2.5, text-sm -> text-xs */}
          <button onClick={submit} className="mt-1 md:mt-2 w-full py-2.5 md:py-3 rounded-full text-white text-xs md:text-sm font-medium flex items-center justify-center gap-2" style={{ background: COLORS.primary }}>
            <Send size={14} /> {t.customizer.submit}
          </button>
        </Reveal>

        {/* CHANGED: p-4 -> p-3, gap-3 -> gap-2 */}
        <Reveal delay={150} className="bg-white rounded-2xl p-3 md:p-6 shadow-md flex flex-col gap-2 md:gap-4">
          <label className="text-[11px] md:text-sm font-medium flex items-center gap-2" style={{ color: COLORS.ink }}>
            <Brush size={14} /> {t.customizer.drawTitle}
          </label>
          <div className="no-swipe">
            <canvas
              ref={canvasRef}
              width={400}
              height={220}
              // CHANGED: أضفنا h-28 (ارتفاع أصغر) للجوال فقط، md:h-auto يعيد النسبة الأصلية على الديسكتوب
              className="w-full h-28 md:h-auto rounded-xl border touch-none"
              style={{ borderColor: COLORS.cream, cursor: "crosshair" }}
              onMouseDown={start}
              onMouseMove={move}
              onMouseUp={end}
              onMouseLeave={end}
              onTouchStart={start}
              onTouchMove={move}
              onTouchEnd={end}
            />
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            {palette.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                // CHANGED: w-6 h-6 -> w-5 h-5
                className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2"
                style={{ background: c, borderColor: color === c ? COLORS.ink : "transparent" }}
              />
            ))}
            <input type="range" min="1" max="12" value={brush} onChange={(e) => setBrush(Number(e.target.value))} className="ms-2 flex-1" />
          </div>
          {/* CHANGED: gap-3 -> gap-2 */}
          <div className="flex gap-2 md:gap-3">
            {/* CHANGED: py-2 -> py-1.5, text-sm -> text-xs */}
            <button onClick={clearCanvas} className="flex-1 py-1.5 md:py-2 rounded-full border text-xs md:text-sm flex items-center justify-center gap-1" style={{ borderColor: COLORS.primary, color: COLORS.primaryDark }}>
              <Trash2 size={13} /> {t.customizer.clear}
            </button>
            <button onClick={downloadSketch} className="flex-1 py-1.5 md:py-2 rounded-full border text-xs md:text-sm flex items-center justify-center gap-1" style={{ borderColor: COLORS.primary, color: COLORS.primaryDark }}>
              <Download size={13} /> {t.customizer.download}
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
        <h2 className="text-2xl md:text-4xl font-semibold mb-4 md:mb-6" style={{ color: COLORS.primaryDark, fontFamily: "'Cormorant Garamond', serif" }}>{t.about.title}</h2>
        <p className="text-sm md:text-lg leading-relaxed md:leading-loose opacity-80" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.about.text}</p>
      </Reveal>
    </section>
  );
}

/* =========================================================================
   TEAM SECTION
   ========================================================================= */
function TeamSection({ sectionRef, t, lang }) {
  // Tap-to-reveal on mobile: CSS :hover never sticks reliably on touch, so
  // color is toggled explicitly with state instead of relying on hover.
  const [revealed, setRevealed] = useState({});
  const toggle = (id) => setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <section
      ref={sectionRef}
      className="h-full flex flex-col items-center justify-center px-3 md:px-6 py-3 md:py-24 overflow-hidden"
      style={{ background: COLORS.cream }}
    >
      <Reveal className="text-center mb-2 md:mb-12 max-w-xl shrink-0">
        <h2 className="text-base md:text-4xl font-semibold mb-0.5 md:mb-2" style={{ color: COLORS.primaryDark, fontFamily: "'Cormorant Garamond', serif" }}>
          {t.team.title}
        </h2>
        <p className="text-[10px] md:text-base opacity-70">{t.team.subtitle}</p>
      </Reveal>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:flex md:flex-wrap justify-center gap-1.5 md:gap-6 max-w-7xl w-full">
        {TEAM.map((m, i) => (
          <Reveal key={m.id} delay={i * 80}>
            <div
              onClick={() => toggle(m.id)}
              onMouseEnter={() => setRevealed((prev) => ({ ...prev, [m.id]: true }))}
              onMouseLeave={() => setRevealed((prev) => ({ ...prev, [m.id]: false }))}
              className="w-full md:w-56 relative group overflow-hidden bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg cursor-pointer rounded-lg md:rounded-none"
            >
              <div className="w-full aspect-[3/4] md:aspect-auto md:h-80 overflow-hidden">
                <img
                  src={m.image}
                  alt={m.name}
                  className={`w-full h-full object-cover object-center transition-all duration-500 grayscale-0 ${
                    revealed[m.id] ? "md:grayscale-0" : "md:grayscale"
                  }`}
                />
              </div>

              <div className="absolute bottom-1 left-1 right-1 md:bottom-3 md:left-3 md:right-3 bg-white p-1 md:p-3 shadow-md rounded md:rounded-none">
                <p className="text-[8px] md:text-sm font-bold truncate" style={{ color: COLORS.ink }}>
                  {m.name}
                </p>
                <p className="text-[7px] md:text-xs text-gray-500 truncate mt-0.5">
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
        <h2 className="text-2xl md:text-4xl font-semibold" style={{ color: COLORS.primaryDark, fontFamily: "'Cormorant Garamond', serif" }}>{t.testimonials.title}</h2>
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
        <h2 className="text-2xl md:text-4xl font-semibold mb-2" style={{ color: COLORS.primaryDark, fontFamily: "'Cormorant Garamond', serif" }}>{t.contact.title}</h2>
        <p className="text-sm md:text-base opacity-70 mb-8">{t.contact.subtitle}</p>

        <div className="flex flex-col gap-4 items-center mb-8">
          <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.ink }}><Phone size={15} /> +{WHATSAPP_NUMBER}</div>
          <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.ink }}><Mail size={15} /> {EMAIL_ADDRESS}</div>
          <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.ink }}><MapPin size={15} /> Morocco</div>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-white text-sm mb-5"
          style={{ background: COLORS.primary }}
        >
          <Send size={15} /> {t.contact.whatsappBtn}
        </a>

        <div className="flex items-center justify-center gap-4">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="w-11 h-11 rounded-full flex items-center justify-center border transition-transform hover:scale-105"
            style={{ borderColor: COLORS.primary, color: COLORS.primaryDark }}
          >
            <InstagramIcon size={18} color={COLORS.primaryDark} />
          </a>
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Email"
            className="w-11 h-11 rounded-full flex items-center justify-center border transition-transform hover:scale-105"
            style={{ borderColor: COLORS.primary, color: COLORS.primaryDark }}
          >
            <Mail size={18} />
          </a>
        </div>
        <div className="fullpage-slide-footer">
            <footer className="h-full flex items-center justify-center text-center py-6 text-xs opacity-60" >
              Lamsano Sym © {new Date().getFullYear()} — {t.footer.rights}
            </footer>
          </div>
      </Reveal>
    </section>
  );
}

/* =========================================================================
   FULL PAGE SCROLLER
   - higher thresholds so a small/accidental swipe doesn't flip sections
   - ignores gestures that start on a ".no-swipe" element (the sketch canvas)
   - blocks the browser's native pull-to-refresh / rubber-band scroll, which
     was causing a full page reload when swiping up at the top of the page
   ========================================================================= */
function FullPageScroller({ children, current, onChange }) {
  const [animating, setAnimating] = useState(false);
  const containerRef = useRef(null);
  const touchStartY = useRef(null);
  const total = React.Children.count(children);

  const goTo = useCallback((index) => {
    if (index < 0 || index >= total || animating) return;
    setAnimating(true);
    onChange(index);
    setTimeout(() => setAnimating(false), 900);
  }, [total, animating, onChange]);

  useEffect(() => {
    const isNoSwipe = (target) => target && target.closest && target.closest(".no-swipe");

    const onWheel = (e) => {
      if (isNoSwipe(e.target)) return;
      e.preventDefault();
      if (animating) return;
      const WHEEL_THRESHOLD = 65;
      if (e.deltaY > WHEEL_THRESHOLD) goTo(current + 1);
      else if (e.deltaY < -WHEEL_THRESHOLD) goTo(current - 1);
    };

    const onKeyDown = (e) => {
      if (animating) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") goTo(current + 1);
      if (e.key === "ArrowUp" || e.key === "PageUp") goTo(current - 1);
    };

    const onTouchStart = (e) => {
      if (isNoSwipe(e.target)) { touchStartY.current = null; return; }
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      if (touchStartY.current === null) return;
      e.preventDefault();
    };
    const onTouchEnd = (e) => {
      if (animating || touchStartY.current === null) return;
      const TOUCH_THRESHOLD = 90;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (delta > TOUCH_THRESHOLD) goTo(current + 1);
      else if (delta < -TOUCH_THRESHOLD) goTo(current - 1);
      touchStartY.current = null;
    };

    const el = containerRef.current;
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [current, animating, goTo]);

  return (
    <div ref={containerRef} className="fullpage-viewport">
      <div
        className="fullpage-track"
        style={{ transform: `translateY(-${current * 100}vh)` }}
      >
        {React.Children.map(children, (child) => (
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
  const [selectedProduct, setSelectedProduct] = useState(null);

  const SLIDE_KEYS = ["home", "products", "customizer", "about", "team", "testimonials", "contact", "footer"];
  const [slideIndex, setSlideIndex] = useState(0);
  const activeKey = SLIDE_KEYS[slideIndex];

  const t = T[lang];
  const dir = t.dir;

  const goToSection = useCallback((key) => {
    const index = SLIDE_KEYS.indexOf(key);
    if (index === -1) return;
    if (page !== "home") {
      setPage("home");
      setTimeout(() => setSlideIndex(index), 60);
    } else {
      setSlideIndex(index);
    }
  }, [page]);

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (found) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const goProducts = () => goToSection("products");
  const goAllProducts = () => { setPage("all"); window.scrollTo({ top: 0 }); };
  const goHome = () => goToSection("products");

  return (
    <div dir={dir} style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap');
        ::selection { background: ${COLORS.primaryLight}; color: #fff; }

        html, body {
          overscroll-behavior-y: contain;
        }

        .fullpage-viewport {
          height: 100vh;
          overflow: hidden;
          position: relative;
          touch-action: none;
          overscroll-behavior: contain;
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
        .no-swipe {
          touch-action: auto;
        }
      `}</style>

      <Navbar
        t={t} lang={lang} setLang={setLang}
        page={page} setPage={setPage}
        cartCount={cartCount} onOpenCart={() => setCartOpen(true)}
        activeKey={activeKey} goToSection={goToSection}
      />

      {page === "home" ? (
        <FullPageScroller current={slideIndex} onChange={setSlideIndex}>
          <HomeSection t={t} lang={lang} goProducts={goProducts} />
          <ProductsSection t={t} lang={lang} addToCart={addToCart} goAllProducts={goAllProducts} openProduct={setSelectedProduct} />
          <CustomizerSection t={t} lang={lang} />
          <AboutSection t={t} />
          <TeamSection t={t} lang={lang} />
          <TestimonialsSection t={t} lang={lang} />
          <ContactSection t={t} />
          
        </FullPageScroller>
      ) : (
        <AllProductsPage t={t} lang={lang} addToCart={addToCart} goHome={goHome} openProduct={setSelectedProduct} />
      )}

      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setCart={setCart} t={t} lang={lang} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} addToCart={addToCart} t={t} lang={lang} />
    </div>
  );
}