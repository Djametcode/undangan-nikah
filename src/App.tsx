import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import photo1 from "./assets/photos/photo101.jpg";
import photo2 from "./assets/photos/photo202.jpg";
import photo3 from "./assets/photos/photo303.jpg";
import photo4 from "./assets/photos/photo404.jpg";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   UndanganKu — Soft UI Evolution (premium wedding)
   GSAP ScrollTrigger + parallax + line reveals.
   Design: pink + gold, Great Vibes + Cormorant Infant.
   ============================================================ */

const WEDDING = {
  groom: "Ahmad Fauzi",
  groomDesc: "Putra ke-1 dari Bapak H. Slamet & Ibu Hj. Siti",
  bride: "Annisa Rahma",
  brideDesc: "Putri ke-1 dari Bapak H. Budi & Ibu Hj. Dewi",
  date: "20 Desember 2025",
  day: "Sabtu",
  akad: { time: "09.00 WIB", place: "Masjid Al-Ikhlas, Jakarta" },
  resepsi: { time: "11.00 WIB", place: "Gedung Graha, Jakarta" },
  mapsUrl: "https://maps.google.com/?q=Jakarta",
};

const targetDate = Date.now() + 90 * 24 * 60 * 60 * 1000;

const gallery = [
  { src: photo2, alt: "Momen 1" },
  { src: photo3, alt: "Momen 2" },
  { src: photo4, alt: "Momen 3" },
];

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
    audioRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_5b6e2f0c6c.mp3?filename=romantic-piano-12399.mp3");
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

/* ---------- Scroll setup ---------- */
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

/* ---------- GSAP animations ---------- */
function useWeddingAnimations(dep: unknown = true) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scopeRef.current) return;
    const ctx = gsap.context(() => {
      // Line reveal
      gsap.utils.toArray<Element>("[data-line-reveal]").forEach((el) => {
        const lineInners = el.querySelectorAll(".line-inner");
        gsap.set(lineInners, {
          y: 100, x: 40, opacity: 0, rotationX: 25, skewY: 4, transformOrigin: "left bottom",
        });
        gsap.to(lineInners, {
          y: 0, x: 0, opacity: 1, rotationX: 0, skewY: 0,
          duration: 1, stagger: { amount: 0.7, from: "start" },
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      // Fade reveal
      gsap.utils.toArray<Element>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 16 },
          {
            opacity: 1, y: 0, duration: 0.5, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      // Parallax on [data-parallax] images
      gsap.utils.toArray<Element>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-parallax") || "0.2");
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

      // Pin on couple section
      gsap.to("[data-pin]", {
        scrollTrigger: {
          trigger: "[data-pin]",
          start: "top top",
          end: "+=80%",
          pin: true,
          scrub: 0.5,
        },
      });

      // Progress bar
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
      <div className="blob w-72 h-72 bg-secondary/40" style={{ top: "10%", left: "-5%" }} />
      <div className="blob w-96 h-96 bg-primary/20" style={{ top: "40%", right: "-10%", animationDelay: "3s" }} />
      <div className="blob w-64 h-64 bg-gold/20" style={{ bottom: "10%", left: "20%", animationDelay: "6s" }} />
    </div>
  );
}

function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 16" fill="none" className={`text-primary/50 ${className}`} aria-hidden>
      <path d="M0 8h40M80 8h40" stroke="currentColor" strokeWidth="0.75" />
      <path d="M60 0c6 4 6 12 0 16-6-4-6-12 0-16z" fill="currentColor" opacity="0.6" />
      <path d="M48 8h24M52 4h16M52 12h16" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

function Petals() {
  const petals = [
    { left: "6%", delay: "0s", dur: "11s", size: 10, color: "#f9a8d4" },
    { left: "18%", delay: "2.5s", dur: "13s", size: 7, color: "#fbcfe8" },
    { left: "32%", delay: "5s", dur: "10s", size: 9, color: "#f472b6" },
    { left: "55%", delay: "1.5s", dur: "12s", size: 8, color: "#f9a8d4" },
    { left: "70%", delay: "4s", dur: "14s", size: 6, color: "#fbcfe8" },
    { left: "85%", delay: "3s", dur: "11s", size: 10, color: "#f472b6" },
    { left: "93%", delay: "6s", dur: "13s", size: 7, color: "#f9a8d4" },
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
        <div className="w-20 h-20 rounded-full border border-primary/20 border-t-primary ring-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="script-display text-2xl text-primary">A&nbsp;&&nbsp;A</span>
        </div>
      </div>
      <div className="script-display text-4xl text-primary mb-8">UndanganKu</div>
      <div className="w-56 h-1.5 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <small className="mt-4 text-muted text-xs">{progress}%</small>
    </div>
  );
}

/* ---------- Cover ---------- */
function Cover({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <img src={photo1} alt="" data-parallax="0.15" className="w-full h-[120%] object-cover opacity-30 -mt-[10%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/20 to-bg" />
      </div>
      <Petals />

      <div className="relative z-10 px-4">
        <Ornament className="w-28 mx-auto mb-5 fade-up fd-1" />
        <p className="kicker fade-up fd-1 mb-4">The Wedding of</p>
        <h1 data-line-reveal className="script-display text-6xl md:text-7xl text-primary fade-up fd-2">
          <span className="line"><span className="line-inner">Ahmad &amp; Annisa</span></span>
        </h1>
        <div className="hairline w-28 mx-auto my-6 fade-up fd-3" />
        <p className="serif-body text-lg text-fg/80 fade-up fd-4">{WEDDING.day}, {WEDDING.date}</p>

        <button
          onClick={onOpen}
          className="sheen fade-up fd-5 mt-9 bg-primary hover:bg-primary-dark text-white px-10 py-4 text-sm font-medium rounded-full transition-all duration-300 soft-shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer"
        >
          Buka Undangan
        </button>
      </div>

      <div className="absolute bottom-8 z-10">
        <div className="flex flex-col items-center gap-1.5 opacity-60">
          <div className="w-5 h-8 border border-fg/50 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-primary rounded-full animate-bounce" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-fg/60">Scroll</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- Salam ---------- */
function Salam() {
  return (
    <section className="py-24 px-4 text-center relative">
      <div data-reveal className="max-w-xl mx-auto">
        <Ornament className="w-24 mx-auto mb-8" />
        <p className="serif-body text-2xl text-primary mb-5">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <p data-line-reveal className="serif-body text-2xl text-fg mb-5">
          <span className="line"><span className="line-inner">Assalamualaikum Warahmatullahi Wabarakatuh</span></span>
        </p>
        <div className="hairline w-16 mx-auto my-6" />
        <p className="serif-body text-lg text-muted leading-relaxed">
          Tanpa mengurangi rasa hormat, kami mengundang Anda untuk berkenan hadir
          di acara pernikahan putra-putri kami:
        </p>
      </div>
    </section>
  );
}

/* ---------- Couple (pinned) ---------- */
function Couple() {
  return (
    <section className="relative" data-pin>
      <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="text-center mb-12" data-reveal>
          <span className="kicker block mb-3">Kedua Mempelai</span>
          <h2 data-line-reveal className="script-display text-5xl text-primary">
            <span className="line"><span className="line-inner">Ahmad &amp; Annisa</span></span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start max-w-4xl w-full">
          <div data-reveal className="text-center group">
            <div className="relative max-w-xs mx-auto mb-6 soft-card p-3 soft-shadow-lg rotate-[-1deg] overflow-hidden">
              <div className="overflow-hidden rounded-xl">
                <img src={photo3} alt={WEDDING.groom} data-parallax="0.1" className="w-full h-[115%] object-cover -mt-[7%] transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="pt-3 pb-1 flex items-center justify-between text-[10px] text-muted uppercase tracking-[0.2em]">
                <span>Mempelai Pria</span>
              </div>
            </div>
            <h3 className="serif-body text-2xl text-fg">{WEDDING.groom}</h3>
            <p className="mt-2 serif-body text-muted leading-relaxed max-w-xs mx-auto">{WEDDING.groomDesc}</p>
          </div>

          <div data-reveal className="text-center group md:mt-16">
            <div className="relative max-w-xs mx-auto mb-6 soft-card p-3 soft-shadow-lg rotate-[1deg] overflow-hidden">
              <div className="overflow-hidden rounded-xl">
                <img src={photo4} alt={WEDDING.bride} data-parallax="0.15" className="w-full h-[115%] object-cover -mt-[7%] transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="pt-3 pb-1 flex items-center justify-between text-[10px] text-muted uppercase tracking-[0.2em]">
                <span>Mempelai Wanita</span>
              </div>
            </div>
            <h3 className="serif-body text-2xl text-fg">{WEDDING.bride}</h3>
            <p className="mt-2 serif-body text-muted leading-relaxed max-w-xs mx-auto">{WEDDING.brideDesc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Countdown ---------- */
function Countdown() {
  const t = useCountdown();
  return (
    <section className="py-20 px-4">
      <div data-reveal className="max-w-3xl mx-auto text-center">
        <Ornament className="w-24 mx-auto mb-4" />
        <span className="kicker block mb-3">Menuju Hari Bahagia</span>
        <div className="flex justify-center gap-3 md:gap-6 mt-10">
          {[
            { label: "Hari", value: t.d },
            { label: "Jam", value: t.h },
            { label: "Menit", value: t.m },
            { label: "Detik", value: t.s },
          ].map((c) => (
            <div key={c.label} className="flex flex-col items-center soft-card px-4 md:px-7 py-5 soft-shadow min-w-[76px] md:min-w-[110px]">
              <div className="serif-body text-4xl md:text-5xl text-primary tabular-nums">{c.value}</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted mt-2">{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Info ---------- */
function Info() {
  return (
    <section className="py-24 px-4 bg-surface/60">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14" data-reveal>
          <Ornament className="w-24 mx-auto mb-4" />
          <span className="kicker block mb-3">Info Acara</span>
          <h2 data-line-reveal className="script-display text-5xl text-primary">
            <span className="line"><span className="line-inner">Akad &amp; Resepsi</span></span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "Akad Nikah", time: WEDDING.akad.time, place: WEDDING.akad.place, icon: "M12 6v6l4 2m6-2a10 10 0 11-18 0 10 10 0 0118 0z" },
            { title: "Resepsi", time: WEDDING.resepsi.time, place: WEDDING.resepsi.place, icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
          ].map((e) => (
            <div key={e.title} data-reveal className="soft-card p-10 text-center soft-shadow hover:soft-shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={e.icon} />
                </svg>
              </div>
              <h3 className="serif-body text-2xl text-primary mb-3">{e.title}</h3>
              <div className="hairline w-12 mx-auto mb-4" />
              <div className="serif-body text-2xl text-fg mb-1">{e.time}</div>
              <div className="serif-body text-muted">{e.place}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10" data-reveal>
          <a
            href={WEDDING.mapsUrl} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium text-sm transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Lihat Lokasi di Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Gallery ---------- */
function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const next = (dir: number) => {
    setActive((a) => (a === null ? a : (a + dir + gallery.length) % gallery.length));
  };
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") next(1);
      if (e.key === "ArrowLeft") next(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14" data-reveal>
          <Ornament className="w-24 mx-auto mb-4" />
          <span className="kicker block mb-3">Galeri</span>
          <h2 data-line-reveal className="script-display text-5xl text-primary">
            <span className="line"><span className="line-inner">Momen Kami</span></span>
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3" data-reveal>
          {gallery.map((g, idx) => (
            <button key={idx} onClick={() => setActive(idx)} className="aspect-square overflow-hidden group cursor-pointer rounded-xl soft-shadow" aria-label={`Foto ${idx + 1}`}>
              <img src={g.src} alt={g.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </button>
          ))}
        </div>

        {active !== null && (
          <div className="fixed inset-0 z-50 bg-fg/90 flex items-center justify-center p-4" onClick={() => setActive(null)}>
            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); next(-1); }} aria-label="Sebelumnya"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <img src={gallery[active].src} alt={gallery[active].alt} className="max-h-[85vh] max-w-full rounded-2xl soft-shadow-lg" />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); next(1); }} aria-label="Berikutnya"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
            <button className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl cursor-pointer transition-colors" onClick={() => setActive(null)} aria-label="Tutup">×</button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- RSVP ---------- */
function Rsvp() {
  const [form, setForm] = useState({ name: "", presence: "hadir", comment: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1200);
  };

  return (
    <section className="py-24 px-4 bg-surface/60">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12" data-reveal>
          <Ornament className="w-24 mx-auto mb-4" />
          <span className="kicker block mb-3">RSVP</span>
          <h2 data-line-reveal className="script-display text-5xl text-primary">
            <span className="line"><span className="line-inner">Konfirmasi Kehadiran</span></span>
          </h2>
        </div>

        {status === "sent" ? (
          <div data-reveal className="soft-card p-12 text-center soft-shadow-lg">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="script-display text-4xl text-primary mb-2">Terima kasih!</p>
            <p className="serif-body text-muted">Konfirmasi Anda sudah tercatat.</p>
            <button
              onClick={() => { setStatus("idle"); setForm({ name: "", presence: "hadir", comment: "" }); }}
              className="mt-6 text-primary hover:text-primary-dark text-sm font-medium transition-colors cursor-pointer"
            >
              Kirim lagi
            </button>
          </div>
        ) : (
          <form onSubmit={submit} data-reveal className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Nama</label>
              <input
                required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-border bg-surface px-4 py-3.5 text-fg rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Nama Anda"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Kehadiran</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: "hadir", label: "Hadir" },
                  { v: "berhalangan", label: "Berhalangan" },
                ].map((p) => (
                  <button type="button" key={p.v} onClick={() => setForm({ ...form, presence: p.v })}
                    className={`py-3.5 border text-sm rounded-xl transition-all duration-300 cursor-pointer ${
                      form.presence === p.v ? "bg-primary text-white border-primary soft-shadow" : "border-border text-muted hover:border-primary"
                    }`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Ucapan &amp; Doa</label>
              <textarea
                value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })}
                rows={4}
                className="w-full border border-border bg-surface px-4 py-3.5 text-fg rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                placeholder="Tulis ucapan..."
              />
            </div>
            <button
              type="submit" disabled={status === "sending"}
              className="sheen w-full bg-primary hover:bg-primary-dark text-white py-4 text-sm font-medium rounded-full transition-all duration-300 soft-shadow-lg hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
            >
              {status === "sending" ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white ring-spin" />
                  Mengirim...
                </span>
              ) : "Kirim Konfirmasi"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ---------- Gift ---------- */
function Gift() {
  const [open, setOpen] = useState<"qris" | "bank" | null>(null);
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText("1234567890").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 px-4">
      <div className="max-w-xl mx-auto text-center">
        <div data-reveal>
          <Ornament className="w-24 mx-auto mb-4" />
          <span className="kicker block mb-3">Tanda Kasih</span>
          <h2 data-line-reveal className="script-display text-5xl text-primary mb-4">
            <span className="line"><span className="line-inner">Amplop Digital</span></span>
          </h2>
          <p className="serif-body text-muted text-lg leading-relaxed mb-8">
            Doa restu Anda adalah hadiah terbaik. Jika ingin memberi tanda kasih, dapat disalurkan melalui:
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4" data-reveal>
          <button onClick={() => setOpen(open === "qris" ? null : "qris")}
            className={`py-4 text-sm rounded-xl transition-all duration-300 cursor-pointer ${open === "qris" ? "bg-primary text-white border-primary soft-shadow" : "border border-border text-fg hover:border-primary"}`}>
            QRIS
          </button>
          <button onClick={() => setOpen(open === "bank" ? null : "bank")}
            className={`py-4 text-sm rounded-xl transition-all duration-300 cursor-pointer ${open === "bank" ? "bg-primary text-white border-primary soft-shadow" : "border border-border text-fg hover:border-primary"}`}>
            Transfer Bank
          </button>
        </div>

        {open === "qris" && (
          <div data-reveal className="mt-6 soft-card p-8 soft-shadow">
            <div className="w-44 h-44 mx-auto border border-border rounded-xl flex items-center justify-center mb-4 bg-surface">
              <span className="text-muted text-xs text-center leading-relaxed">[QRIS<br />Placeholder]</span>
            </div>
            <p className="text-muted text-xs">Scan QR di atas untuk memberi tanda kasih</p>
          </div>
        )}

        {open === "bank" && (
          <div data-reveal className="mt-6 soft-card p-8 soft-shadow space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-muted text-sm">Bank BCA</span>
              <div className="flex items-center gap-2">
                <span className="serif-body text-lg text-fg">1234567890</span>
                <button onClick={copy} className="text-primary hover:text-primary-dark text-xs font-medium cursor-pointer transition-colors" aria-label="Salin nomor rekening">
                  {copied ? "Tersalin ✓" : "Salin"}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted text-sm">a.n. Ahmad Fauzi</span>
              <span className="text-muted text-sm">0857 9710 6049</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="py-16 px-4 text-center bg-primary text-white">
      <div className="max-w-md mx-auto">
        <Ornament className="w-24 mx-auto mb-4 text-white/60" />
        <p className="script-display text-4xl mb-3">Ahmad &amp; Annisa</p>
        <p className="text-white/70 text-xs mb-8">20 Desember 2025</p>
        <p className="text-white/70 serif-body text-lg max-w-sm mx-auto leading-relaxed">
          Merupakan suatu kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir.
        </p>
        <div className="hairline max-w-xs mx-auto my-6 bg-white/30" />
        <p className="text-white/50 text-xs">© 2025 UndanganKu</p>
      </div>
    </footer>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const { playing, toggle } = useMusicPlayer();
  const scrollScope = useScrollSetup(opened);
  const animScope = useWeddingAnimations(opened);
  const scope = animScope || scrollScope;
  const handleOpen = useCallback(() => {
    setOpening(true);
    setTimeout(() => setOpened(true), 700);
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
        <div data-progress className="h-full bg-primary origin-left scale-x-0" />
      </div>

      {!opened ? (
        <div className={`relative z-10 ${opening ? "open-fade" : ""}`}>
          <Cover onOpen={handleOpen} />
        </div>
      ) : (
        <div className="relative z-10">
          <main>
            <Salam />
            <Couple />
            <Countdown />
            <Info />
            <Gallery />
            <Rsvp />
            <Gift />
            <Footer />
          </main>
        </div>
      )}

      <button
        onClick={toggle}
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center soft-shadow-lg hover:bg-primary-dark transition-colors cursor-pointer"
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
