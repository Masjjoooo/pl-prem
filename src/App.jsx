import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Share2,
  Image as ImageIcon
} from "lucide-react";

/* =====================
   PUBLIC VIEW
===================== */
const isPublic =
  new URLSearchParams(window.location.search).get("view") === "public";

/* =====================
   THEMES
===================== */
const THEMES = {
  gold: {
    name: "Gold Noir",
    bg: "#050505",
    card: "#111111",
    accent: "#D4AF37",
    text: "#FFFFFF",
    muted: "#A1A1A1"
  },
  emerald: {
    name: "Emerald Dark",
    bg: "#020806",
    card: "#071512",
    accent: "#2ECC71",
    text: "#EFFFF7",
    muted: "#8FBFB0"
  },
  royal: {
    name: "Royal Blue",
    bg: "#05070F",
    card: "#0B1020",
    accent: "#4F7CFF",
    text: "#FFFFFF",
    muted: "#9CA3AF"
  },
  silver: {
    name: "Silver Minimal",
    bg: "#0A0A0A",
    card: "#151515",
    accent: "#C7C7C7",
    text: "#FFFFFF",
    muted: "#9CA3AF"
  },
  rose: {
    name: "Rose Luxury",
    bg: "#0B0507",
    card: "#180A10",
    accent: "#E88FB3",
    text: "#FFFFFF",
    muted: "#C9A5B4"
  }
};

export default function App() {
  const [editMode, setEditMode] = useState(!isPublic);
  const [themeKey, setThemeKey] = useState("gold");
  const theme = THEMES[themeKey];

  const [store, setStore] = useState({
    name: "LUXE DIGITAL STORE",
    tagline: "Premium Digital Subscription",
    instagram: "@luxedigital",
    whatsapp: "0812-3456-7890",
    titleSize: 34,
    taglineSize: 12,
    priceSize: 18,
    footerSize: 11
  });

  const [products, setProducts] = useState([
    { id: 1, name: "Netflix Premium", plan: "1 Bulan Ultra HD", price: "35.000", image: null },
    { id: 2, name: "Spotify Premium", plan: "Individual", price: "20.000", image: null }
  ]);

  /* =====================
     EXPORT LIBS
  ===================== */
  useEffect(() => {
    ["html2canvas", "jspdf"].forEach((lib, i) => {
      const src =
        i === 0
          ? "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
          : "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      document.body.appendChild(s);
    });
  }, []);

  /* =====================
     HANDLERS
  ===================== */
  const addProduct = () =>
    setProducts(p => [
      ...p,
      { id: Date.now(), name: "Produk Baru", plan: "Plan", price: "0", image: null }
    ]);

  const updateProduct = (id, key, value) =>
    setProducts(p => p.map(i => (i.id === id ? { ...i, [key]: value } : i)));

  const removeProduct = id =>
    setProducts(p => p.filter(i => i.id !== id));

  const uploadImage = (id, file) => {
    const reader = new FileReader();
    reader.onload = () => updateProduct(id, "image", reader.result);
    reader.readAsDataURL(file);
  };

  /* =====================
     EXPORT
  ===================== */
  const exportPNG = async () => {
    const el = document.getElementById("canvas");
    const canvas = await window.html2canvas(el, { scale: 3, backgroundColor: theme.bg });
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "pricelist.png";
    a.click();
  };

  const exportPDF = async () => {
    const el = document.getElementById("canvas");
    const canvas = await window.html2canvas(el, { scale: 3, backgroundColor: theme.bg });
    const img = canvas.toDataURL("image/jpeg", 1);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");
    const w = 210;
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, "JPEG", 0, 0, w, h);
    pdf.save("pricelist.pdf");
  };

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="min-h-screen text-white" style={{ background: theme.bg }}>
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-black/70 backdrop-blur border-b border-white/10 px-6 py-4 flex justify-between">
        <strong>PRICE LIST EDITOR</strong>
        <div className="flex gap-2">
          {!isPublic && (
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-white text-black rounded-full text-sm font-bold"
            >
              {editMode ? "Preview" : "Edit"}
            </button>
          )}
          <button onClick={exportPNG} className="px-3 py-2 bg-neutral-800 rounded-full text-sm">
            PNG
          </button>
          <button onClick={exportPDF} className="px-3 py-2 rounded-full text-sm font-bold"
            style={{ background: theme.accent, color: "#000" }}>
            PDF
          </button>
          <a href="?view=public" target="_blank"
            className="px-3 py-2 bg-neutral-800 rounded-full text-sm">
            <Share2 size={14} />
          </a>
        </div>
      </nav>

      <main className="pt-28 px-4 max-w-7xl mx-auto grid lg:grid-cols-[380px_1fr] gap-10">
        {/* EDITOR */}
        {editMode && !isPublic && (
          <div className="space-y-6">
            {/* THEME */}
            <div className="bg-black/40 p-4 rounded-xl">
              <p className="text-xs mb-2">Theme</p>
              <select
                value={themeKey}
                onChange={e => setThemeKey(e.target.value)}
                className="w-full bg-black border border-white/10 rounded px-3 py-2">
                {Object.entries(THEMES).map(([k, t]) => (
                  <option key={k} value={k}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* STORE */}
            <div className="bg-black/40 p-4 rounded-xl space-y-2">
              <input value={store.name}
                onChange={e => setStore({ ...store, name: e.target.value })}
                className="w-full bg-black border border-white/10 rounded px-3 py-2" />
              <input value={store.tagline}
                onChange={e => setStore({ ...store, tagline: e.target.value })}
                className="w-full bg-black border border-white/10 rounded px-3 py-2" />
            </div>

            {/* PRODUCTS */}
            <div className="bg-black/40 p-4 rounded-xl space-y-3">
              <button onClick={addProduct} className="text-sm" style={{ color: theme.accent }}>
                <Plus size={14} /> Tambah Produk
              </button>

              {products.map(p => (
                <div key={p.id} className="bg-black p-3 rounded-lg relative">
                  <button onClick={() => removeProduct(p.id)}
                    className="absolute top-2 right-2 text-red-500">
                    <Trash2 size={14} />
                  </button>

                  <input value={p.name}
                    onChange={e => updateProduct(p.id, "name", e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 mb-1" />
                  <input value={p.plan}
                    onChange={e => updateProduct(p.id, "plan", e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 mb-1 text-xs" />
                  <input value={p.price}
                    onChange={e => updateProduct(p.id, "price", e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 text-sm font-bold"
                    style={{ color: theme.accent }} />

                  <label className="text-xs mt-2 block cursor-pointer">
                    Upload Foto
                    <input type="file" hidden accept="image/*"
                      onChange={e => uploadImage(p.id, e.target.files[0])} />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CANVAS */}
        <div className="flex justify-center">
          <div id="canvas"
            className="w-[420px] rounded-[32px] p-8"
            style={{ background: theme.bg, color: theme.text }}>
            <header className="text-center mb-6">
              <h1 style={{ fontSize: store.titleSize, color: theme.accent }}
                className="font-serif uppercase">
                {store.name}
              </h1>
              <p style={{ fontSize: store.taglineSize, color: theme.muted }}>
                {store.tagline}
              </p>
            </header>

            <div className="grid grid-cols-2 gap-4">
              {products.map(p => (
                <div key={p.id}
                  className="rounded-2xl p-4"
                  style={{ background: theme.card }}>
                  <div className="w-full aspect-square mb-3 rounded-xl overflow-hidden bg-black flex items-center justify-center">
                    {p.image
                      ? <img src={p.image} className="w-full h-full object-cover" />
                      : <ImageIcon />}
                  </div>
                  <h4 className="text-sm font-bold">{p.name}</h4>
                  <p className="text-xs" style={{ color: theme.muted }}>{p.plan}</p>
                  <div className="text-right mt-2 font-bold"
                    style={{ fontSize: store.priceSize, color: theme.accent }}>
                    Rp {p.price}
                  </div>
                </div>
              ))}
            </div>

            <footer className="mt-8 pt-4 border-t border-white/10 flex justify-between"
              style={{ fontSize: store.footerSize, color: theme.muted }}>
              <span>{store.instagram}</span>
              <span>{store.whatsapp}</span>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
