import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Download,
  Edit3,
  Check,
  Share2,
  Image as ImageIcon
} from "lucide-react";

const isPublic =
  new URLSearchParams(window.location.search).get("view") === "public";

export default function App() {
  const [editMode, setEditMode] = useState(!isPublic);
  const [loading, setLoading] = useState(false);

  const [store, setStore] = useState({
    name: "LUXE DIGITAL STORE",
    tagline: "Premium Digital Subscription",
    instagram: "@luxedigital",
    whatsapp: "0812-3456-7890"
  });

  const [products, setProducts] = useState([
    { id: 1, name: "Netflix Premium", plan: "1 Bulan", price: "35.000", image: null },
    { id: 2, name: "Spotify Premium", plan: "Individual", price: "20.000", image: null }
  ]);

  /* Load export libs */
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

  const addProduct = () =>
    setProducts(p => [
      ...p,
      { id: Date.now(), name: "Produk Baru", plan: "Plan", price: "0", image: null }
    ]);

  const updateProduct = (id, key, value) =>
    setProducts(p => p.map(i => (i.id === id ? { ...i, [key]: value } : i)));

  const removeProduct = id =>
    setProducts(p => p.filter(i => i.id !== id));

  const exportPNG = async () => {
    setLoading(true);
    const el = document.getElementById("canvas");
    const canvas = await window.html2canvas(el, { scale: 3, backgroundColor: "#000" });
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "pricelist.png";
    a.click();
    setLoading(false);
  };

  const exportPDF = async () => {
    setLoading(true);
    const el = document.getElementById("canvas");
    const canvas = await window.html2canvas(el, { scale: 3, backgroundColor: "#000" });
    const img = canvas.toDataURL("image/jpeg", 1);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");
    const w = 210;
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, "JPEG", 0, 0, w, h);
    pdf.save("pricelist.pdf");
    setLoading(false);
  };

  return (
    <div className="min-h-screen text-white">
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-black/80 backdrop-blur border-b border-white/10 px-6 py-4 flex justify-between">
        <span className="font-bold">PRICE LIST</span>
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
          <button onClick={exportPDF} className="px-3 py-2 bg-amber-500 text-black rounded-full text-sm font-bold">
            PDF
          </button>
          <a href="?view=public" target="_blank" className="px-3 py-2 bg-neutral-800 rounded-full text-sm">
            <Share2 size={14} />
          </a>
        </div>
      </nav>

      <main className="pt-28 px-4 max-w-6xl mx-auto grid lg:grid-cols-[360px_1fr] gap-10">
        {/* EDITOR */}
        {editMode && !isPublic && (
          <div className="space-y-6">
            <div className="bg-neutral-900 p-4 rounded-xl">
              <input
                value={store.name}
                onChange={e => setStore({ ...store, name: e.target.value })}
                className="w-full bg-black border border-white/10 rounded px-3 py-2 mb-2"
              />
              <input
                value={store.tagline}
                onChange={e => setStore({ ...store, tagline: e.target.value })}
                className="w-full bg-black border border-white/10 rounded px-3 py-2"
              />
            </div>

            <div className="bg-neutral-900 p-4 rounded-xl space-y-3">
              <button onClick={addProduct} className="flex gap-2 text-sm text-amber-500">
                <Plus size={16} /> Tambah Produk
              </button>

              {products.map(p => (
                <div key={p.id} className="bg-black p-3 rounded-lg relative">
                  <button
                    onClick={() => removeProduct(p.id)}
                    className="absolute top-2 right-2 text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                  <input
                    value={p.name}
                    onChange={e => updateProduct(p.id, "name", e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 mb-1"
                  />
                  <input
                    value={p.plan}
                    onChange={e => updateProduct(p.id, "plan", e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 mb-1 text-xs"
                  />
                  <input
                    value={p.price}
                    onChange={e => updateProduct(p.id, "price", e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 text-amber-500 font-bold"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CANVAS */}
        <div className="flex justify-center">
          <div id="canvas" className="w-[420px] bg-black p-8 rounded-[32px] border border-white/10">
            <header className="text-center mb-6">
              <h1 className="text-3xl font-serif uppercase">{store.name}</h1>
              <p className="text-xs text-neutral-400">{store.tagline}</p>
            </header>

            <div className="grid grid-cols-2 gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-neutral-900 p-4 rounded-xl">
                  <h4 className="font-bold text-sm">{p.name}</h4>
                  <p className="text-xs text-neutral-400">{p.plan}</p>
                  <div className="text-right font-bold mt-2">Rp {p.price}</div>
                </div>
              ))}
            </div>

            <footer className="mt-6 pt-4 border-t border-white/10 text-xs flex justify-between">
              <span>{store.instagram}</span>
              <span>{store.whatsapp}</span>
            </footer>
          </div>
        </div>
      </main>

      {loading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center text-white">
          Processing...
        </div>
      )}
    </div>
  );
}
