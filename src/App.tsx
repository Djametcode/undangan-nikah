import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { QRCodeCanvas } from "qrcode.react";
import photo1 from "./assets/photos/photo101.jpg";
import photo2 from "./assets/photos/photo202.jpg";
import photo3 from "./assets/photos/photo303.jpg";
import photo4 from "./assets/photos/photo404.jpg";
import photo5 from "./assets/photos/photo505.jpg";
import photo6 from "./assets/photos/photo606.jpg";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   ART JAWA COKLAT — replica galeriundanganofficial, React murni.
   Dark brown + gold, Pinyon Script + Playfair Display + Cormorant.
   ============================================================ */

const WEDDING = {
  groom: "Benny",
  groomFull: "Benny Pratama",
  groomDesc: "Putra pertama dari Bapak Bambang & Ibu Sri",
  bride: "Indah",
  brideFull: "Indah Lestari",
  brideDesc: "Putri pertama dari Bapak Joko & Ibu Rina",
  date: "10 Oktober 2025",
  day: "Jumat",
  akad: { time: "08.00 WIB - Selesai", place: "Kediaman mempelai wanita, Jl. Gatot Subroto GG Putri Ayu VI No. 14, KM 5 Bawah" },
  resepsi: { time: "13.00 WIB - 16.00 WIB", place: "Gedung Hotel BBR, Jl. Pantai Impian No. 1 - Tanjungpinang" },
  mapsAkad: "https://maps.google.com/?q=Jl.+Gatot+Subroto+Tanjungpinang",
  mapsResepsi: "https://maps.google.com/?q=Hotel+BBR+Tanjungpinang",
  bank: { name: "Bank Mandiri", number: "123123123", holder: "Elyana Azkiya Nur" },
  kado: { name: "Elyana Azkiya Nur", address: "Jalan Raya Bojongsari No.5, Gunung Putri, Citeureup, Bogor, Jawa Barat" },
  music: "https://web.galeriundanganofficial.com/wp-content/uploads/2025/11/Kabagyan-Sadewok-Official-Music-Video-mp3cut.net-1.mp3",
};

const targetDate = Date.now() + 90 * 24 * 60 * 60 * 1000;

const gallery = [
  { src: photo2, alt: "Momen 1" },
  { src: photo3, alt: "Momen 2" },
  { src: photo4, alt: "Momen 3" },
  { src: photo5, alt: "Momen 4" },
  { src: photo6, alt: "Momen 5" },
];

/* ---------- Guest name from URL (?to=...) ---------- */
function useGuestName(): string {
  const [name, setName] = useState("Yogi dan Ratna");
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const to = p.get("to");
      if (to) setName(to);
    } catch {}
  }, []);
  return name;
}

/* ---------- Hooks ---------- */
function useCountdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, targetDate - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  return t;
}

function useMusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    audioRef.current = new Audio(WEDDING.music);
    audioRef.current.loop = true;
    return () => { audioRef.current?.pause(); };
  }, []);
  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play().catch(() => {}); setPlaying(true); }
  }, [playing]);
  return { playing, toggle };
}

function useScrollSetup(enabled: boolean) {
  const scope = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!enabled) return;
    const t = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => {
      clearTimeout(t);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [enabled]);
  return scope;
}

function useWeddingAnimations(dep: unknown = true) {
  const scopeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!scopeRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<Element>("[data-line-reveal]").forEach((el) => {
        const lineInners = el.querySelectorAll(".line-inner");
        gsap.set(lineInners, { y: 100, x: 40, opacity: 0, rotationX: 25, skewY: 4, transformOrigin: "left bottom" });
        gsap.to(lineInners, {
          y: 0, x: 0, opacity: 1, rotationX: 0, skewY: 0,
          duration: 1, stagger: { amount: 0.7, from: "start" },
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      gsap.utils.toArray<Element>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 18 },
          {
            opacity: 1, y: 0, duration: 0.55, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      gsap.utils.toArray<Element>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-parallax") || "0.15");
        gsap.fromTo(
          el,
          { yPercent: -speed * 20 },
          {
            yPercent: speed * 20,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

      gsap.to("[data-progress]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });
    }, scopeRef);
    return () => ctx.revert();
  }, [dep]);
  return scopeRef;
}

/* ---------- Decorative ---------- */
function Blobs() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
      <div className="blob w-80 h-80 bg-gold/30" style={{ top: "8%", left: "-8%" }} />
      <div className="blob w-96 h-96 bg-gold/20" style={{ top: "45%", right: "-12%", animationDelay: "4s" }} />
      <div className="blob w-72 h-72 bg-gold/25" style={{ bottom: "8%", left: "18%", animationDelay: "8s" }} />
    </div>
  );
}

/* Ornamen sudut khas jawa — batik corner */
function CornerOrnament({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={`text-gold ${className} ${flip ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path d="M0 120V0h8v112h112v8H0z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 120V8h8v104h104v8H8z" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
      <path d="M18 60c14-4 22-12 26-26 4 14 12 22 26 26-14 4-22 12-26 26-4-14-12-22-26-26z" stroke="currentColor" strokeWidth="0.75" opacity="0.8" />
      <path d="M34 34l6 6M80 34l-6 6M34 80l6-6M80 80l-6-6" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
    </svg>
  );
}

/* Ornamen pembatas — sulur + wajik */
function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 24" fill="none" className={`text-gold ${className}`} aria-hidden>
      <path d="M0 12h78M122 12h78" stroke="currentColor" strokeWidth="0.75" opacity="0.7" />
      <path d="M100 2c8 5 8 15 0 20-8-5-8-15 0-20z" fill="currentColor" opacity="0.85" />
      <path d="M92 12h16M96 7h8M96 17h8" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <path d="M86 12c2-6 8-9 14-9M86 12c2 6 8 9 14 9M114 12c-2-6-8-9-14-9M114 12c-2 6-8 9-14 9" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

function Petals() {
  const petals = [
    { left: "5%", delay: "0s", dur: "12s", size: 8, color: "#c9a227" },
    { left: "16%", delay: "3s", dur: "14s", size: 6, color: "#8a6d1d" },
    { left: "30%", delay: "5.5s", dur: "11s", size: 7, color: "#e6c15c" },
    { left: "48%", delay: "1.8s", dur: "13s", size: 6, color: "#a08d6e" },
    { left: "62%", delay: "4.2s", dur: "15s", size: 8, color: "#c9a227" },
    { left: "78%", delay: "2.2s", dur: "12s", size: 5, color: "#8a6d1d" },
    { left: "90%", delay: "6.5s", dur: "14s", size: 7, color: "#e6c15c" },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: p.left, width: p.size, height: p.size,
            background: p.color, animationDuration: p.dur, animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Loading ---------- */
function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const i = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(i); setTimeout(onDone, 400); return 100; }
        return p + 5;
      });
    }, 45);
    return () => clearInterval(i);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 bg-bg flex flex-col items-center justify-center">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full border border-gold/20 border-t-gold ring-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="script-display text-2xl text-gold">B&nbsp;&&nbsp;I</span>
        </div>
      </div>
      <div className="script-display text-4xl text-gold mb-8">The Wedding Of</div>
      <div className="w-56 h-1.5 bg-gold/15 rounded-full overflow-hidden">
        <div className="h-full bg-gold rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <small className="mt-4 text-muted text-xs">{progress}%</small>
    </div>
  );
}

/* ---------- Cover ---------- */
function Cover({ onOpen, guest }: { onOpen: () => void; guest: string }) {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={photo1}
          alt=""
          className="w-full h-[120%] object-cover opacity-60 -mt-[10%] brightness-[0.45] sepia-[0.35]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/40 to-bg" />
      </div>
      <Petals />

      <div className="relative z-10 px-4">
        <p className="kicker fade-up fd-1 mb-6 tracking-[0.5em]">The Wedding Of</p>
        <h1 data-line-reveal className="script-display text-6xl md:text-7xl text-gold-light fade-up fd-2">
          <span className="line"><span className="line-inner">Benny &amp; Indah</span></span>
        </h1>
        <Ornament className="w-40 mx-auto my-6 fade-up fd-3" />

        <p className="text-cream/60 text-xs uppercase tracking-[0.25em] mt-8 fade-up fd-4">Kepada Bapak/Ibu/Saudara/i</p>
        <p className="serif-body text-2xl md:text-3xl text-cream my-2 fade-up fd-4">{guest}</p>
        <p className="text-cream/60 text-xs uppercase tracking-[0.25em] fade-up fd-4">Di Tempat</p>

        <button
          onClick={onOpen}
          className="sheen fade-up fd-5 mt-10 border border-gold text-gold-light hover:bg-gold hover:text-bg px-10 py-4 text-sm font-medium rounded-full transition-all duration-300 soft-shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer"
        >
          Buka Undangan
        </button>
      </div>

      <div className="absolute bottom-8 z-10">
        <div className="flex flex-col items-center gap-1.5 opacity-60">
          <div className="w-5 h-8 border border-gold/50 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-gold rounded-full animate-bounce" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-cream/50">Scroll</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- Couple ---------- */
function Couple() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16" data-reveal>
          <span className="kicker block mb-4">Kedua Mempelai</span>
          <h2 data-line-reveal className="script-display text-5xl md:text-6xl text-gold-light">
            <span className="line"><span className="line-inner">Benny &amp; Indah</span></span>
          </h2>
          <Ornament className="w-40 mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div data-reveal className="text-center group">
            <div className="gold-frame max-w-xs mx-auto mb-6 rounded-sm overflow-hidden">
              <div className="overflow-hidden rounded-[3px]">
                <img src={photo3} alt={WEDDING.groom} className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2">Mempelai Pria</p>
            <h3 className="serif-body text-3xl text-cream">{WEDDING.groomFull}</h3>
            <p className="mt-2 serif-body text-muted leading-relaxed max-w-xs mx-auto">{WEDDING.groomDesc}</p>
          </div>

          <div data-reveal className="text-center group md:mt-20">
            <div className="gold-frame max-w-xs mx-auto mb-6 rounded-sm overflow-hidden">
              <div className="overflow-hidden rounded-[3px]">
                <img src={photo4} alt={WEDDING.bride} className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2">Mempelai Wanita</p>
            <h3 className="serif-body text-3xl text-cream">{WEDDING.brideFull}</h3>
            <p className="mt-2 serif-body text-muted leading-relaxed max-w-xs mx-auto">{WEDDING.brideDesc}</p>
          </div>
        </div>

        <div className="text-center mt-20" data-reveal>
          <p className="script-display text-4xl text-gold mb-6">&amp;</p>
          <p className="serif-body text-lg text-cream/80 italic leading-relaxed max-w-2xl mx-auto">
            "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu
            dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan
            di antaramu rasa kasih dan sayang."
          </p>
          <p className="text-muted text-xs uppercase tracking-[0.3em] mt-4">Ar Rum Ayat 21</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Save The Date / Countdown ---------- */
function SaveTheDate() {
  const t = useCountdown();
  return (
    <section className="py-20 px-4 bg-bg2/60">
      <div className="max-w-3xl mx-auto text-center" data-reveal>
        <span className="kicker block mb-4">Save The Date</span>
        <p className="serif-body text-2xl md:text-3xl text-cream mb-2">{WEDDING.day}, {WEDDING.date}</p>
        <Ornament className="w-36 mx-auto my-6" />
        <div className="flex justify-center gap-3 md:gap-6">
          {[
            { label: "Hari", value: t.d },
            { label: "Jam", value: t.h },
            { label: "Menit", value: t.m },
            { label: "Detik", value: t.s },
          ].map((c) => (
            <div key={c.label} className="flex flex-col items-center soft-card px-4 md:px-7 py-5 soft-shadow min-w-[76px] md:min-w-[104px]">
              <div className="serif-body text-4xl md:text-5xl text-gold-light tabular-nums">{c.value}</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted mt-2">{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Event Info ---------- */
function EventCard({ title, time, place, mapsUrl }: { title: string; time: string; place: string; mapsUrl: string }) {
  return (
    <div data-reveal className="soft-card p-10 text-center soft-shadow hover:soft-shadow-lg transition-shadow duration-300 relative overflow-hidden">
      <CornerOrnament className="absolute top-3 left-3 w-10" />
      <CornerOrnament className="absolute bottom-3 right-3 w-10 flip" />
      <h3 className="serif-body text-3xl text-gold-light mb-3">{title}</h3>
      <div className="hairline w-16 mx-auto mb-6" />
      <div className="serif-body text-2xl text-cream mb-2">{time}</div>
      <div className="serif-body text-muted leading-relaxed max-w-sm mx-auto">{place}</div>
      <a
        href={mapsUrl} target="_blank" rel="noreferrer"
        className="mt-7 inline-flex items-center gap-2 border border-gold text-gold-light hover:bg-gold hover:text-bg px-6 py-2.5 text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 cursor-pointer"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Google Map
      </a>
    </div>
  );
}

function Info() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14" data-reveal>
          <span className="kicker block mb-4">Info Acara</span>
          <h2 data-line-reveal className="script-display text-5xl text-gold-light">
            <span className="line"><span className="line-inner">Rangkaian Acara</span></span>
          </h2>
          <Ornament className="w-36 mx-auto mt-6" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <EventCard title="Akad Nikah" time={WEDDING.akad.time} place={WEDDING.akad.place} mapsUrl={WEDDING.mapsAkad} />
          <EventCard title="Resepsi" time={WEDDING.resepsi.time} place={WEDDING.resepsi.place} mapsUrl={WEDDING.mapsResepsi} />
        </div>
      </div>
    </section>
  );
}

/* ---------- Gallery (carousel) ---------- */
function Gallery() {
  const [idx, setIdx] = useState(0);
  const next = useCallback(() => setIdx((i) => (i + 1) % gallery.length), []);
  const prev = () => setIdx((i) => (i - 1 + gallery.length) % gallery.length);

  useEffect(() => {
    const i = setInterval(next, 4000);
    return () => clearInterval(i);
  }, [next]);

  return (
    <section className="py-24 px-4 bg-bg2/60">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12" data-reveal>
          <span className="kicker block mb-4">Galeri</span>
          <h2 data-line-reveal className="script-display text-5xl text-gold-light">
            <span className="line"><span className="line-inner">Momen Kami</span></span>
          </h2>
          <Ornament className="w-36 mx-auto mt-6" />
        </div>

        <div data-reveal className="relative gold-frame rounded-sm overflow-hidden soft-shadow-lg">
          <div className="overflow-hidden rounded-[3px] aspect-[4/3]">
            <img
              src={gallery[idx].src}
              alt={gallery[idx].alt}
              className="w-full h-full object-cover transition-opacity duration-700"
              key={idx}
              style={{ animation: "fadeUp 0.6s ease" }}
            />
          </div>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-bg/60 hover:bg-gold hover:text-bg border border-gold/40 text-gold-light flex items-center justify-center cursor-pointer transition-colors z-10"
            aria-label="Sebelumnya"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-bg/60 hover:bg-gold hover:text-bg border border-gold/40 text-gold-light flex items-center justify-center cursor-pointer transition-colors z-10"
            aria-label="Berikutnya"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === idx ? "bg-gold w-6" : "bg-cream/40 hover:bg-cream/70"}`}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Gift ---------- */
function Gift() {
  const [copied, setCopied] = useState<string | null>(null);
  const [open, setOpen] = useState<"bank" | "qris" | "kado" | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({ name: "", bank: "", nominal: "", ucapan: "", file: "" });

  const copy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1200);
  };

  return (
    <section className="py-24 px-4">
      <div className="max-w-xl mx-auto text-center">
        <div data-reveal>
          <span className="kicker block mb-4">Tanda Kasih</span>
          <h2 data-line-reveal className="script-display text-5xl text-gold-light mb-5">
            <span className="line"><span className="line-inner">Kirim Hadiah</span></span>
          </h2>
          <Ornament className="w-36 mx-auto mb-6" />
          <p className="serif-body text-muted text-lg leading-relaxed mb-8">
            Tanpa mengurangi rasa hormat, bagi rekan-rekan dan sahabat yang hendak memberikan
            tanda kasih untuk kami, dapat melalui nomor rekening di bawah ini.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3" data-reveal>
          <button
            onClick={() => setOpen(open === "bank" ? null : "bank")}
            className={`py-4 text-sm rounded-xl transition-all duration-300 cursor-pointer ${open === "bank" ? "bg-gold text-bg border-gold soft-shadow" : "border border-gold/40 text-gold-light hover:border-gold"}`}
          >
            Transfer Bank
          </button>
          <button
            onClick={() => setOpen(open === "qris" ? null : "qris")}
            className={`py-4 text-sm rounded-xl transition-all duration-300 cursor-pointer ${open === "qris" ? "bg-gold text-bg border-gold soft-shadow" : "border border-gold/40 text-gold-light hover:border-gold"}`}
          >
            QRIS
          </button>
          <button
            onClick={() => setOpen(open === "kado" ? null : "kado")}
            className={`py-4 text-sm rounded-xl transition-all duration-300 cursor-pointer ${open === "kado" ? "bg-gold text-bg border-gold soft-shadow" : "border border-gold/40 text-gold-light hover:border-gold"}`}
          >
            Kirim Kado
          </button>
        </div>

        {open === "qris" && (
          <div data-reveal className="mt-6 soft-card p-8 soft-shadow">
            <div className="w-44 h-44 mx-auto mb-4 bg-white rounded-xl flex items-center justify-center overflow-hidden p-2">
              <QRCodeCanvas
                value={`https://web.galeriundanganofficial.com/art-jawa-coklat-2/`}
                size={160}
                fgColor="#17100a"
                bgColor="#ffffff"
                level="M"
              />
            </div>
            <p className="text-muted text-xs">Scan QR di atas untuk memberi tanda kasih</p>
          </div>
        )}

        {open === "bank" && (
          <div data-reveal className="mt-6 soft-card p-8 soft-shadow text-left">
            <div className="flex justify-between items-center border-b border-border pb-4">
              <div>
                <p className="text-muted text-sm">{WEDDING.bank.name}</p>
                <p className="serif-body text-2xl text-cream mt-1">{WEDDING.bank.number}</p>
              </div>
              <button
                onClick={() => copy("bank", WEDDING.bank.number)}
                className="border border-gold text-gold-light hover:bg-gold hover:text-bg px-4 py-2 text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer"
              >
                {copied === "bank" ? "Tersalin ✓" : "Copy Rekening"}
              </button>
            </div>
            <p className="text-muted text-sm mt-4">a.n. {WEDDING.bank.holder}</p>
          </div>
        )}

        {open === "kado" && (
          <div data-reveal className="mt-6 soft-card p-8 soft-shadow text-left">
            <div className="flex justify-between items-start gap-4 border-b border-border pb-4">
              <div>
                <p className="text-muted text-sm mb-1">Kirim Kado:</p>
                <p className="serif-body text-lg text-cream">{WEDDING.kado.name}</p>
                <p className="text-muted text-sm mt-1">{WEDDING.kado.address}</p>
              </div>
              <button
                onClick={() => copy("kado", `${WEDDING.kado.name}, ${WEDDING.kado.address}`)}
                className="shrink-0 border border-gold text-gold-light hover:bg-gold hover:text-bg px-4 py-2 text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer"
              >
                {copied === "kado" ? "Tersalin ✓" : "Copy Alamat"}
              </button>
            </div>
            <p className="text-muted text-sm mt-4">Mohon konfirmasi untuk pengiriman gift. Terima kasih.</p>
          </div>
        )}

        <div className="mt-10 text-left" data-reveal>
          <div className="text-center mb-6">
            <span className="kicker block">Konfirmasi Gift</span>
            <Ornament className="w-28 mx-auto mt-4" />
          </div>

          {status === "sent" ? (
            <div className="soft-card p-10 text-center soft-shadow-lg">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/15 flex items-center justify-center">
                <svg className="w-7 h-7 text-gold-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="script-display text-4xl text-gold-light mb-2">Terima kasih!</p>
              <p className="serif-body text-muted">Konfirmasi Anda sudah tercatat.</p>
              <button
                onClick={() => { setStatus("idle"); setForm({ name: "", bank: "", nominal: "", ucapan: "", file: "" }); }}
                className="mt-6 text-gold-light hover:text-gold text-sm font-medium transition-colors cursor-pointer"
              >
                Kirim lagi
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Nama *</label>
                <input
                  required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-border bg-surface px-4 py-3.5 text-fg rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  placeholder="Nama Anda"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted mb-2">Nama Bank</label>
                  <input
                    value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })}
                    className="w-full border border-border bg-surface px-4 py-3.5 text-fg rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    placeholder="BCA / Mandiri / dll"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted mb-2">Nominal</label>
                  <input
                    value={form.nominal} onChange={(e) => setForm({ ...form, nominal: e.target.value })}
                    className="w-full border border-border bg-surface px-4 py-3.5 text-fg rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    placeholder="Rp. 100.000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Ucapan</label>
                <textarea
                  value={form.ucapan} onChange={(e) => setForm({ ...form, ucapan: e.target.value })}
                  rows={3}
                  className="w-full border border-border bg-surface px-4 py-3.5 text-fg rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all resize-none"
                  placeholder="Tulis ucapan..."
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Bukti TF</label>
                <input
                  type="file" accept="image/*"
                  onChange={(e) => setForm({ ...form, file: e.target.files?.[0]?.name || "" })}
                  className="w-full text-sm text-muted file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:bg-gold/15 file:text-gold-light file:text-xs file:uppercase file:tracking-widest file:cursor-pointer hover:file:bg-gold/25 cursor-pointer"
                />
              </div>
              <button
                type="submit" disabled={status === "sending"}
                className="sheen w-full bg-gold hover:bg-gold-light text-bg py-4 text-sm font-medium rounded-full transition-all duration-300 soft-shadow-lg hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
              >
                {status === "sending" ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-bg/40 border-t-bg ring-spin" />
                    Mengirim...
                  </span>
                ) : "Konfirmasi"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- RSVP ---------- */
function Rsvp() {
  const [form, setForm] = useState({ name: "", presence: "Hadir", jumlah: "1 Orang" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1200);
  };

  return (
    <section className="py-24 px-4 bg-bg2/60">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12" data-reveal>
          <span className="kicker block mb-4">RSVP</span>
          <h2 data-line-reveal className="script-display text-5xl text-gold-light">
            <span className="line"><span className="line-inner">Konfirmasi Kehadiran</span></span>
          </h2>
          <Ornament className="w-36 mx-auto mt-6" />
          <p className="serif-body text-muted mt-6 max-w-md mx-auto leading-relaxed">
            Bantu kami mempersiapkan jamuan yang hangat untuk anda semua dengan mengirimkan
            konfirmasi kehadiran melalui form berikut ini.
          </p>
        </div>

        {status === "sent" ? (
          <div data-reveal className="soft-card p-12 text-center soft-shadow-lg">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/15 flex items-center justify-center">
              <svg className="w-7 h-7 text-gold-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="script-display text-4xl text-gold-light mb-2">Terima kasih!</p>
            <p className="serif-body text-muted">Konfirmasi Anda sudah tercatat.</p>
            <button
              onClick={() => { setStatus("idle"); setForm({ name: "", presence: "Hadir", jumlah: "1 Orang" }); }}
              className="mt-6 text-gold-light hover:text-gold text-sm font-medium transition-colors cursor-pointer"
            >
              Kirim lagi
            </button>
          </div>
        ) : (
          <form onSubmit={submit} data-reveal className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Nama *</label>
              <input
                required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-border bg-surface px-4 py-3.5 text-fg rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                placeholder="Nama Anda"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Konfirmasi Kehadiran *</label>
              <div className="grid grid-cols-2 gap-3">
                {["Hadir", "Tidak Hadir"].map((p) => (
                  <button
                    type="button" key={p} onClick={() => setForm({ ...form, presence: p })}
                    className={`py-3.5 border text-sm rounded-xl transition-all duration-300 cursor-pointer ${
                      form.presence === p ? "bg-gold text-bg border-gold soft-shadow" : "border-gold/30 text-muted hover:border-gold"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Jumlah *</label>
              <div className="grid grid-cols-2 gap-3">
                {["1 Orang", "2 Orang"].map((p) => (
                  <button
                    type="button" key={p} onClick={() => setForm({ ...form, jumlah: p })}
                    className={`py-3.5 border text-sm rounded-xl transition-all duration-300 cursor-pointer ${
                      form.jumlah === p ? "bg-gold text-bg border-gold soft-shadow" : "border-gold/30 text-muted hover:border-gold"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit" disabled={status === "sending"}
              className="sheen w-full bg-gold hover:bg-gold-light text-bg py-4 text-sm font-medium rounded-full transition-all duration-300 soft-shadow-lg hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
            >
              {status === "sending" ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-bg/40 border-t-bg ring-spin" />
                  Mengirim...
                </span>
              ) : "Submit"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ---------- Guest Book ---------- */
function GuestBook() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [list, setList] = useState<{ name: string; msg: string }[]>([
    { name: "Yogi dan Ratna", msg: "Selamat menempuh hidup baru, semoga menjadi keluarga yang sakinah mawaddah warahmah. Aamiin." },
    { name: "Sari & Dimas", msg: "Barakallahu lakuma wa baraka 'alaikuma. Bahagia selalu!" },
    { name: "Budi Santoso", msg: "Semoga langgeng sampai maut memisahkan. Doa terbaik untuk kalian berdua." },
  ]);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) return;
    setList((l) => [{ name, msg }, ...l]);
    setName("");
    setMsg("");
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <section className="py-24 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12" data-reveal>
          <span className="kicker block mb-4">Ucapan &amp; Doa</span>
          <h2 data-line-reveal className="script-display text-5xl text-gold-light">
            <span className="line"><span className="line-inner">Berikan Doa Terbaik</span></span>
          </h2>
          <Ornament className="w-36 mx-auto mt-6" />
          <p className="serif-body text-muted mt-6 max-w-md mx-auto leading-relaxed">
            Berikan harapan dan doa tulus anda disini karena kami sangat bersemangat untuk
            memulai perjalanan baru bersama.
          </p>
        </div>

        <form onSubmit={submit} data-reveal className="soft-card p-6 soft-shadow space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">Nama</label>
            <input
              required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full border border-border bg-bg px-4 py-3 text-fg rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
              placeholder="Nama Anda"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">Ucapan</label>
            <textarea
              required value={msg} onChange={(e) => setMsg(e.target.value)}
              rows={3}
              className="w-full border border-border bg-bg px-4 py-3 text-fg rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all resize-none"
              placeholder="Silakan kasih ucapan di bawah ini"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gold hover:bg-gold-light text-bg py-3.5 text-sm font-medium rounded-full transition-all duration-300 soft-shadow cursor-pointer active:scale-[0.98]"
          >
            {sent ? "Terkirim ✓" : "Kirim"}
          </button>
        </form>

        <div className="mt-8 space-y-3" data-reveal>
          {list.map((g, i) => (
            <div key={i} className="soft-card p-5 soft-shadow flex gap-4 items-start">
              <div className="w-11 h-11 shrink-0 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold-light font-medium">
                {g.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-cream text-sm font-medium">{g.name}</p>
                <p className="serif-body text-muted mt-1 leading-relaxed">{g.msg}</p>
                <button className="text-gold/60 hover:text-gold text-xs mt-2 cursor-pointer transition-colors">Reply</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Terima Kasih ---------- */
function Closing() {
  return (
    <section className="py-24 px-4 bg-bg2/60 text-center relative overflow-hidden">
      <div className="max-w-xl mx-auto relative z-10" data-reveal>
        <CornerOrnament className="absolute -top-10 -left-10 w-24" />
        <CornerOrnament className="absolute -bottom-10 -right-10 w-24 flip" />
        <span className="kicker block mb-4">Terima Kasih</span>
        <h2 data-line-reveal className="script-display text-6xl text-gold-light mb-6">
          <span className="line"><span className="line-inner">Merci Beaucoup</span></span>
        </h2>
        <Ornament className="w-40 mx-auto mb-8" />
        <p className="serif-body text-lg text-cream/80 leading-relaxed max-w-md mx-auto">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
          berkenan hadir dan memberikan doa restu.
        </p>
        <p className="serif-body text-3xl text-gold-light mt-12 mb-2">Benny &amp; Indah</p>
        <p className="text-muted text-xs uppercase tracking-[0.3em]">10 Oktober 2025</p>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="py-10 px-4 text-center border-t border-gold/15">
      <p className="text-muted text-xs">© 2025 ART JAWA COKLAT · Dibuat dengan ❤</p>
    </footer>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const guest = useGuestName();
  const { playing, toggle } = useMusicPlayer();
  const scrollScope = useScrollSetup(opened);
  const animScope = useWeddingAnimations(opened);
  const scope = animScope || scrollScope;
  const handleOpen = useCallback(() => {
    setOpening(true);
    setTimeout(() => setOpened(true), 800);
  }, []);

  if (loading) return <LoadingScreen onDone={() => setLoading(false)} />;

  return (
    <div
      ref={scope}
      data-scroll-container
      className="min-h-screen bg-bg text-fg relative overflow-x-hidden"
    >
      <Blobs />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-transparent z-50">
        <div data-progress className="h-full bg-gold origin-left scale-x-0" />
      </div>

      {!opened ? (
        <div className={`relative z-10 ${opening ? "open-fade" : ""}`}>
          <Cover onOpen={handleOpen} guest={guest} />
        </div>
      ) : (
        <div className="relative z-10">
          <main>
            <Couple />
            <SaveTheDate />
            <Info />
            <Gallery />
            <Gift />
            <Rsvp />
            <GuestBook />
            <Closing />
            <Footer />
          </main>
        </div>
      )}

      <button
        onClick={toggle}
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full border border-gold bg-bg/80 backdrop-blur text-gold-light flex items-center justify-center soft-shadow-lg hover:bg-gold hover:text-bg transition-colors cursor-pointer"
        aria-label={playing ? "Matikan musik" : "Putar musik"}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          {playing ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10-3v11M9 9l-1 7m1-7v11M9 20a3 3 0 11-6 0 3 3 0 016 0zM19 17a3 3 0 11-6 0 3 3 0 016 0z" />
          )}
        </svg>
      </button>
    </div>
  );
}
