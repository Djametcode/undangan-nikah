import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { QRCodeCanvas } from "qrcode.react";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   Undangan Studio - dynamic template
   Semua data (nama, foto, video, musik, teks) dari /api/config.
   Admin edit config → invitation live update.
   ============================================================ */

interface Cfg {
  brand: { kicker: string; title: string; logoText: string };
  couple: {
    groom: string; groomFull: string; groomDesc: string;
    bride: string; brideFull: string; brideDesc: string; ampersand: string;
  };
  event: {
    date: string; day: string; countdownDate: string;
    akad: { title: string; time: string; place: string; mapsUrl: string };
    resepsi: { title: string; time: string; place: string; mapsUrl: string };
  };
  quote: { text: string; source: string };
  salam: { arabic: string; text: string; body: string };
  gallery: { heading: string; images: string[] };
  timeline: { enabled: boolean; heading: string; items: { title: string; desc: string; date: string }[] };
  initial: { enabled: boolean; text: string };
  liveStream: { enabled: boolean; heading: string; subheading: string; text: string; buttonLabel: string; buttonUrl: string };
  exclusive: { enabled: boolean; heading: string; text: string; logoUrl: string; instagramUrl: string; whatsappUrl: string };
  gift: {
    heading: string; intro: string;
    bank: { name: string; number: string; holder: string };
    qrisEnabled: boolean; qrisValue: string;
    kado: { name: string; address: string; note: string };
  };
  rsvp: { heading: string; intro: string };
  guestbook: { heading: string; intro: string };
  closing: { heading: string; text: string };
  media: { video: string; videoEnabled: boolean; music: string; musicEnabled: boolean };
  sectionVideos: {
    couple: { video: string; enabled: boolean };
    savedate: { video: string; enabled: boolean };
    initial: { video: string; enabled: boolean };
    timeline: { video: string; enabled: boolean };
    info: { video: string; enabled: boolean };
    gallery: { video: string; enabled: boolean };
    gift: { video: string; enabled: boolean };
    rsvp: { video: string; enabled: boolean };
    guestbook: { video: string; enabled: boolean };
    closing: { video: string; enabled: boolean };
  };
  footer: { credit: string };
  photos: { cover: string; groom: string; bride: string; gallery: string[] };
  theme: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    accent: string;
    bg: string;
    surface: string;
    fg: string;
    muted: string;
    border: string;
    sand: string;
    radiusCard: string;
    radiusBtn: string;
    fontScript: string;
    fontSerif: string;
    fontSans: string;
    revealAnim: string;
    revealBaseDelay: string;
    revealStagger: string;
    petalsEnabled: boolean;
    blobsEnabled: boolean;
    videoCover: boolean;
    sheenEnabled: boolean;
    glassEnabled: boolean;
    galleryLayout: string;
    scriptSize: string;
    serifSize: string;
    headingSize: string;
    motion: {
      parallaxLevel: string;
      sectionReveal: string;
      textEffect: string;
      videoCoverMode: string;
      heroZoom: boolean;
      floatElements: boolean;
    };
    videoOpacity: string;
    bgOpacity: string;
  };
  layout: {
    name: string;
    sections: string[];
  };
  labels: {
    guestPrefix: string;
    guestSuffix: string;
    openInvite: string;
    scroll: string;
    coupleSection: string;
    groomLabel: string;
    brideLabel: string;
    saveTheDate: string;
    dayLabel: string;
    hourLabel: string;
    minuteLabel: string;
    secondLabel: string;
    eventSection: string;
    googleMap: string;
    gallerySection: string;
    giftSection: string;
    transferBank: string;
    qris: string;
    sendGift: string;
    scanQr: string;
    copyRekening: string;
    copyAlamat: string;
    copied: string;
    sendGiftLabel: string;
    giftConfirmNote: string;
    giftFormTitle: string;
    nameRequired: string;
    bankName: string;
    nominal: string;
    ucapan: string;
    buktiTf: string;
    confirmBtn: string;
    sending: string;
    thanksTitle: string;
    thanksBody: string;
    sendAgain: string;
    namePlaceholder: string;
    rsvpSection: string;
    rsvpPresence: string;
    rsvpHadir: string;
    rsvpTidak: string;
    rsvpJumlah: string;
    rsvp1Orang: string;
    rsvp2Orang: string;
    rsvpSubmit: string;
    guestbookSection: string;
    guestbookName: string;
    guestbookMsg: string;
    guestbookPlaceholder: string;
    guestbookSend: string;
    guestbookSent: string;
    closingTitle: string;
    loading: string;
  };
}

const DEFAULT_CFG: Cfg = {
  brand: { kicker: "The Wedding Of", title: "Undangan", logoText: "A&I" },
  couple: {
    groom: "Benny", groomFull: "Benny Pratama", groomDesc: "Putra pertama dari Bapak Bambang & Ibu Sri",
    bride: "Indah", brideFull: "Indah Lestari", brideDesc: "Putri pertama dari Bapak Joko & Ibu Rina",
    ampersand: "&",
  },
  event: {
    date: "10 Oktober 2025", day: "Jumat", countdownDate: "2025-10-10T09:00:00+07:00",
    akad: { title: "Akad Nikah", time: "08.00 WIB - Selesai", place: "Kediaman mempelai wanita", mapsUrl: "https://maps.google.com" },
    resepsi: { title: "Resepsi", time: "13.00 WIB - 16.00 WIB", place: "Gedung Hotel BBR", mapsUrl: "https://maps.google.com" },
  },
  quote: { text: "\"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri.\"", source: "Ar Rum Ayat 21" },
  salam: { arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ", text: "Assalamualaikum Warahmatullahi Wabarakatuh", body: "Tanpa mengurangi rasa hormat, kami mengundang Anda untuk berkenan hadir di acara pernikahan kami." },
  gallery: { heading: "Momen Kami", images: [] },
  timeline: {
    enabled: true,
    heading: "Perjalanan Cinta",
    items: [
      { title: "Awal Bertemu", desc: "Kami pertama kali bertemu dan berkenalan.", date: "2019" },
      { title: "Lamaran", desc: "Momen sakral meminta restu kedua keluarga.", date: "2024" },
      { title: "Menikah", desc: "Mengikat janji suci sehidup sesurga.", date: "2025" },
    ],
  },
  initial: { enabled: true, text: "F & H" },
  liveStream: {
    enabled: false,
    heading: "Live Streaming",
    subheading: "LIVE STREAMING",
    text: "Pernikahan kami dapat disaksikan secara langsung melalui live streaming di bawah ini.",
    buttonLabel: "Tonton Live",
    buttonUrl: "https://www.instagram.com/",
  },
  exclusive: {
    enabled: true,
    heading: "Exclusive Web Invitation",
    text: "Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.",
    logoUrl: "",
    instagramUrl: "https://www.instagram.com/",
    whatsappUrl: "https://wa.me/6282176971754",
  },
  gift: {
    heading: "Kirim Hadiah", intro: "Tanpa mengurangi rasa hormat, bagi rekan-rekan dan sahabat yang hendak memberikan tanda kasih untuk kami, dapat melalui nomor rekening di bawah ini.",
    bank: { name: "Bank Mandiri", number: "123123123", holder: "Nama Pemilik" },
    qrisEnabled: true, qrisValue: "https://example.com",
    kado: { name: "Nama Penerima", address: "Alamat lengkap", note: "Mohon konfirmasi untuk pengiriman gift. Terima kasih." },
  },
  rsvp: { heading: "Konfirmasi Kehadiran", intro: "Bantu kami mempersiapkan jamuan yang hangat untuk anda semua." },
  guestbook: { heading: "Berikan Doa Terbaik", intro: "Berikan harapan dan doa tulus anda disini." },
  closing: { heading: "Merci Beaucoup", text: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu." },
  media: { video: "", videoEnabled: false, music: "", musicEnabled: false },
  sectionVideos: {
    couple: { video: "", enabled: false },
    savedate: { video: "", enabled: false },
    initial: { video: "", enabled: false },
    timeline: { video: "", enabled: false },
    info: { video: "", enabled: false },
    gallery: { video: "", enabled: false },
    gift: { video: "", enabled: false },
    rsvp: { video: "", enabled: false },
    guestbook: { video: "", enabled: false },
    closing: { video: "", enabled: false },
  },
  footer: { credit: "© 2025 Undangan Studio" },
  photos: { cover: "", groom: "", bride: "", gallery: [] },
  theme: {
    primary: "#9a3412",
    primaryDark: "#7c2d12",
    primaryLight: "#c2410c",
    accent: "#059669",
    bg: "#fffbeb",
    surface: "#ffffff",
    fg: "#0f172a",
    muted: "#6b7280",
    border: "#e7d8d3",
    sand: "#f7f0e3",
    radiusCard: "16px",
    radiusBtn: "999px",
    fontScript: "Great Vibes, cursive",
    fontSerif: "Cormorant Infant, Georgia, serif",
    fontSans: "Outfit, system-ui, sans-serif",
    revealAnim: "fadeUp",
    revealBaseDelay: "3000",
    revealStagger: "120",
    petalsEnabled: true,
    blobsEnabled: true,
    videoCover: false,
    sheenEnabled: true,
    glassEnabled: false,
    galleryLayout: "carousel",
    scriptSize: "text-6xl md:text-7xl",
    serifSize: "text-2xl md:text-3xl",
    headingSize: "text-5xl",
    motion: {
      parallaxLevel: "medium",
      sectionReveal: "fade-up",
      textEffect: "fadeInUp",
      videoCoverMode: "cover",
      heroZoom: true,
      floatElements: true,
    },
    videoOpacity: "70",
    bgOpacity: "100",
  },
  layout: {
    name: "klasik",
    sections: ["couple", "initial", "savedate", "timeline", "info", "liveStream", "gallery", "gift", "rsvp", "guestbook", "exclusive", "closing"],
  },
  labels: {
    guestPrefix: "Kepada Bapak/Ibu/Saudara/i",
    guestSuffix: "Di Tempat",
    openInvite: "Buka Undangan",
    scroll: "Scroll",
    coupleSection: "Kedua Mempelai",
    groomLabel: "Mempelai Pria",
    brideLabel: "Mempelai Wanita",
    saveTheDate: "Save The Date",
    dayLabel: "Hari",
    hourLabel: "Jam",
    minuteLabel: "Menit",
    secondLabel: "Detik",
    eventSection: "Rangkaian Acara",
    googleMap: "Google Map",
    gallerySection: "Galeri",
    giftSection: "Tanda Kasih",
    transferBank: "Transfer Bank",
    qris: "QRIS",
    sendGift: "Kirim Kado",
    scanQr: "Scan QR di atas untuk memberi tanda kasih",
    copyRekening: "Copy Rekening",
    copyAlamat: "Copy Alamat",
    copied: "Tersalin ✓",
    sendGiftLabel: "Kirim Kado:",
    giftConfirmNote: "Mohon konfirmasi untuk pengiriman gift. Terima kasih.",
    giftFormTitle: "Konfirmasi Gift",
    nameRequired: "Nama *",
    bankName: "Nama Bank",
    nominal: "Nominal",
    ucapan: "Ucapan",
    buktiTf: "Bukti TF",
    confirmBtn: "Konfirmasi",
    sending: "Mengirim...",
    thanksTitle: "Terima kasih!",
    thanksBody: "Konfirmasi Anda sudah tercatat.",
    sendAgain: "Kirim lagi",
    namePlaceholder: "Nama Anda",
    rsvpSection: "RSVP",
    rsvpPresence: "Konfirmasi Kehadiran *",
    rsvpHadir: "Hadir",
    rsvpTidak: "Tidak Hadir",
    rsvpJumlah: "Jumlah *",
    rsvp1Orang: "1 Orang",
    rsvp2Orang: "2 Orang",
    rsvpSubmit: "Submit",
    guestbookSection: "Ucapan & Doa",
    guestbookName: "Nama",
    guestbookMsg: "Ucapan",
    guestbookPlaceholder: "Silakan kasih ucapan di bawah ini",
    guestbookSend: "Kirim",
    guestbookSent: "Terkirim ✓",
    closingTitle: "Terima Kasih",
    loading: "Loading",
  },
};

function deepMerge(base: Cfg, incoming: Partial<Cfg>): Cfg {
  const out: any = JSON.parse(JSON.stringify(base));
  const merge = (t: any, s: any) => {
    if (!s || typeof s !== "object") return;
    for (const k of Object.keys(s)) {
      if (s[k] && typeof s[k] === "object" && !Array.isArray(s[k]) && t[k] && typeof t[k] === "object") {
        merge(t[k], s[k]);
      } else {
        t[k] = s[k];
      }
    }
  };
  merge(out, incoming);
  return out;
}

function useConfig() {
  const [cfg, setCfg] = useState<Cfg | null>(null);
  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((c) => setCfg(deepMerge(DEFAULT_CFG, c)))
      .catch(() => setCfg(DEFAULT_CFG));
  }, []);
  return cfg;
}

/* Apply theme config to CSS variables */
function useApplyTheme(cfg: Cfg | null) {
  useEffect(() => {
    if (!cfg?.theme) return;
    const t = cfg.theme;
    const r = document.documentElement.style;
    r.setProperty("--clr-primary", t.primary);
    r.setProperty("--clr-primary-dark", t.primaryDark);
    r.setProperty("--clr-primary-light", t.primaryLight);
    r.setProperty("--clr-accent", t.accent);
    r.setProperty("--clr-bg", t.bg);
    r.setProperty("--clr-surface", t.surface);
    r.setProperty("--clr-fg", t.fg);
    r.setProperty("--clr-muted", t.muted);
    r.setProperty("--clr-border", t.border);
    r.setProperty("--clr-sand", t.sand);
    r.setProperty("--radius-card", t.radiusCard);
    r.setProperty("--radius-btn", t.radiusBtn);
    r.setProperty("--font-script", t.fontScript);
    r.setProperty("--font-serif", t.fontSerif);
    r.setProperty("--font-sans", t.fontSans);
    // dynamic Google Fonts loader
    const families = [t.fontScript, t.fontSerif, t.fontSans]
      .map((f) => f.split(",")[0].trim().replace(/\s+/g, "+"))
      .filter((f) => f && f !== "Brush+Script+MT");
    if (families.length) {
      let link = document.querySelector('link[data-font-loader]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.dataset.fontLoader = "1";
        document.head.appendChild(link);
      }
      link.href = `https://fonts.googleapis.com/css2?family=${families.join("&family=")}&display=swap`;
    }
    r.setProperty("--reveal-anim", t.revealAnim);
    r.setProperty("--reveal-base-delay", (parseInt(t.revealBaseDelay) || 0) + "ms");
    r.setProperty("--reveal-stagger", (parseInt(t.revealStagger) || 0) + "ms");
    // body classes for toggles
    document.body.classList.toggle("no-petals", t.petalsEnabled === false);
    document.body.classList.toggle("no-blobs", t.blobsEnabled === false);
    document.body.classList.toggle("no-sheen", t.sheenEnabled === false);
    document.body.classList.toggle("glass-mode", t.glassEnabled === true);
    document.body.classList.toggle("gallery-justified", t.galleryLayout === "justified");
  }, [cfg]);
}

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
function useCountdown(targetISO: string) {
  const target = new Date(targetISO).getTime();
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
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
  }, [target]);
  return t;
}

function useMusicPlayer(enabled: boolean, src: string) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (!enabled || !src) return;
    audioRef.current = new Audio(src);
    audioRef.current.loop = true;
    return () => { audioRef.current?.pause(); };
  }, [enabled, src]);
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

function useWeddingAnimations(dep: unknown = true, motion?: Cfg["theme"]["motion"]) {
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

      // Parallax level: low / medium / high (boosted from Elementor patterns)
      const pLevel = motion?.parallaxLevel || "medium";
      const pSpeed = pLevel === "low" ? 0.12 : pLevel === "high" ? 0.45 : 0.25;
      gsap.utils.toArray<Element>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-parallax") || String(pSpeed));
        gsap.fromTo(
          el,
          { yPercent: -speed * 25 },
          {
            yPercent: speed * 25,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

      // Section-level entrance animations (Elementor-style: fadeInUp / zoomIn / fadeInLeft / fadeInRight / bounceIn)
      const entrance = motion?.textEffect || "fadeInUp";
      gsap.utils.toArray<Element>("section[data-section]").forEach((el) => {
        const targets = el.querySelectorAll("[data-entrance]");
        if (!targets.length) return;
        const anims: Record<string, { from: gsap.TweenVars }> = {
          fadeInUp: { from: { opacity: 0, y: 40 } },
          fadeInDown: { from: { opacity: 0, y: -40 } },
          fadeInLeft: { from: { opacity: 0, x: -60 } },
          fadeInRight: { from: { opacity: 0, x: 60 } },
          zoomIn: { from: { opacity: 0, scale: 0.6 } },
          bounceIn: { from: { opacity: 0, scale: 0.4, y: 20 } },
        };
        const cfgAnim = anims[entrance] || anims.fadeInUp;
        gsap.fromTo(
          targets,
          cfgAnim.from,
          {
            opacity: 1, x: 0, y: 0, scale: 1,
            duration: 1, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%", once: true },
          }
        );
      });

      // Card pop-in stagger (soft-card inside sections)
      gsap.utils.toArray<Element>("section[data-section] .soft-card").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.7, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });

      // Video background parallax (videoCoverMode: parallax) — video scale 1.2 + gerak scrub
      gsap.utils.toArray<Element>(".video-parallax-el").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.25, yPercent: -8 },
          {
            scale: 1, yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: el.closest("section"), start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

      // Section depth — konten section bergerak lebih lambat dari bg (parallax layer)
      if (pLevel !== "low") {
        gsap.utils.toArray<Element>("section[data-section] > div[class*='max-w-']").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: 6 },
            {
              yPercent: -6,
              ease: "none",
              scrollTrigger: { trigger: el.closest("section"), start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });
      }

      // Hero zoom effect (cover image/video slow zoom)
      if (motion?.heroZoom && document.querySelector("[data-hero-zoom]")) {
        gsap.fromTo("[data-hero-zoom]", {
          scale: 1.15,
        }, {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-hero-zoom]", start: "top top", end: "bottom top", scrub: true },
        });
      }

      // Floating elements (petals/ornaments gentle bob)
      if (motion?.floatElements) {
        gsap.utils.toArray<Element>("[data-float]").forEach((el, i) => {
          gsap.to(el, {
            y: i % 2 === 0 ? -12 : 12,
            duration: 3 + (i % 3),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.3,
          });
        });
      }

      gsap.to("[data-progress]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });
    }, scopeRef);
    return () => ctx.revert();
  }, [dep, motion?.parallaxLevel, motion?.heroZoom, motion?.floatElements]);
  return scopeRef;
}

/* ---------- Decorative ---------- */
function Blobs() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
      <div className="blob w-80 h-80 bg-primary/30" style={{ top: "8%", left: "-8%" }} />
      <div className="blob w-96 h-96 bg-primary/20" style={{ top: "45%", right: "-12%", animationDelay: "4s" }} />
      <div className="blob w-72 h-72 bg-primary/25" style={{ bottom: "8%", left: "18%", animationDelay: "8s" }} />
    </div>
  );
}

function CornerOrnament({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={`text-primary ${className} ${flip ? "rotate-180" : ""}`} aria-hidden>
      <path d="M0 120V0h8v112h112v8H0z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 120V8h8v104h104v8H8z" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
      <path d="M18 60c14-4 22-12 26-26 4 14 12 22 26 26-14 4-22 12-26 26-4-14-12-22-26-26z" stroke="currentColor" strokeWidth="0.75" opacity="0.8" />
      <path d="M34 34l6 6M80 34l-6 6M34 80l6-6M80 80l-6-6" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
    </svg>
  );
}

function Ornament({ className = "", float = false }: { className?: string; float?: boolean }) {
  return (
    <svg viewBox="0 0 200 24" fill="none" className={`text-primary ${className} ${float ? "inline-block" : ""}`} data-float={float || undefined} aria-hidden>
      <path d="M0 12h78M122 12h78" stroke="currentColor" strokeWidth="0.75" opacity="0.7" />
      <path d="M100 2c8 5 8 15 0 20-8-5-8-15 0-20z" fill="currentColor" opacity="0.85" />
      <path d="M92 12h16M96 7h8M96 17h8" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
    </svg>
  );
}

function Petals() {
  const petals = [
    { left: "5%", delay: "0s", dur: "12s", size: 8, color: "#c2410c" },
    { left: "16%", delay: "3s", dur: "14s", size: 6, color: "#b45309" },
    { left: "30%", delay: "5.5s", dur: "11s", size: 7, color: "#9a3412" },
    { left: "48%", delay: "1.8s", dur: "13s", size: 6, color: "#d97706" },
    { left: "62%", delay: "4.2s", dur: "15s", size: 8, color: "#c2410c" },
    { left: "78%", delay: "2.2s", dur: "12s", size: 5, color: "#b45309" },
    { left: "90%", delay: "6.5s", dur: "14s", size: 7, color: "#9a3412" },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {petals.map((p, i) => (
        <span key={i} className="petal" style={{ left: p.left, width: p.size, height: p.size, background: p.color, animationDuration: p.dur, animationDelay: p.delay }} />
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
        <div className="w-20 h-20 rounded-full border border-primary/20 border-t-gold ring-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="script-display text-2xl text-primary">A&nbsp;&amp;&nbsp;A</span>
        </div>
      </div>
      <div className="script-display text-4xl text-primary mb-8">Loading</div>
      <div className="w-56 h-1.5 bg-primary/15 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <small className="mt-4 text-muted text-xs">{progress}%</small>
    </div>
  );
}

/* ---------- Cover ---------- */
function Cover({ onOpen, guest, cfg }: { onOpen: () => void; guest: string; cfg: Cfg }) {
  const { couple, brand, photos, media, theme, labels } = cfg;
  const hasVideo = (media.videoEnabled || theme.videoCover) && media.video;
  const vidMode = theme.motion?.videoCoverMode || "cover";
  const vidOp = (parseInt(theme.videoOpacity) || 70) / 100;
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden bg-bg">
        {hasVideo ? (
          <video
            src={media.video}
            autoPlay muted playsInline loop
            preload="auto"
            data-hero-zoom
            className={`w-full h-full ${vidMode === "contain" ? "object-contain" : "object-cover"} brightness-[0.85]`}
            style={{ opacity: vidOp }}
          />
        ) : photos.cover ? (
          <img src={photos.cover} alt="" data-hero-zoom className="w-full h-full object-cover opacity-80" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/20 to-bg" />
      </div>
      {theme.petalsEnabled && <Petals />}

      <div className="relative z-10 px-4">
        <p className="kicker fade-up fd-1 mb-6 tracking-[0.5em]">{brand.kicker}</p>
        <h1 data-line-reveal className={`script-display text-primary fade-up fd-2 ${theme.scriptSize}`}>
          <span className="line"><span className="line-inner">{couple.groom} {couple.ampersand} {couple.bride}</span></span>
        </h1>
        <Ornament className="w-40 mx-auto my-6 fade-up fd-3" float />

        <p className="text-muted/60 text-xs uppercase tracking-[0.25em] mt-8 fade-up fd-4">{labels.guestPrefix}</p>
        <p className={`serif-body text-fg my-2 fade-up fd-4 ${theme.serifSize}`}>{guest}</p>
        <p className="text-muted/60 text-xs uppercase tracking-[0.25em] fade-up fd-4">{labels.guestSuffix}</p>

        <button
          onClick={onOpen}
          className={`${theme.sheenEnabled ? "sheen " : ""}fade-up fd-5 mt-10 border border-primary text-primary hover:bg-primary hover:text-bg px-10 py-4 text-sm font-medium rounded-btn transition-all duration-300 soft-shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer`}
        >
          {labels.openInvite}
        </button>
      </div>

      <div className="absolute bottom-8 z-10">
        <div className="flex flex-col items-center gap-1.5 opacity-60">
          <div className="w-5 h-8 border border-primary/50 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-primary rounded-full animate-bounce" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted/60">{labels.scroll}</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- Couple ---------- */
function Couple({ cfg }: { cfg: Cfg }) {
  const { couple, photos, quote, salam, labels } = cfg;
  return (
    <section data-section className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <SectionVideo cfg={cfg} name="couple" />
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Salam pembuka */}
        <div className="text-center mb-14" data-reveal data-entrance>
          <p className="salam-arabic text-4xl md:text-5xl text-primary mb-6 leading-relaxed" style={{ fontFamily: "Amiri, 'Times New Roman', serif" }}>{salam.arabic}</p>
          <p className="serif-body text-xl md:text-2xl text-fg font-medium">{salam.text}</p>
          <p className="mt-3 serif-body text-muted leading-relaxed max-w-2xl mx-auto">{salam.body}</p>
          <Ornament className="w-32 mx-auto mt-6" />
        </div>

        <div className="text-center mb-16" data-reveal data-entrance>
          <span className="kicker block mb-4">{labels.coupleSection}</span>
          <h2 data-line-reveal className={`script-display text-primary-light fade-up ${cfg.theme.headingSize}`}>
            <span className="line"><span className="line-inner">{couple.groom} {couple.ampersand} {couple.bride}</span></span>
          </h2>
          <Ornament className="w-40 mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div data-reveal data-entrance className="text-center group">
            <div className="gold-frame max-w-xs mx-auto mb-6 rounded-sm overflow-hidden">
              <div className="overflow-hidden rounded-[3px] bg-surface">
                {photos.groom ? (
                  <img src={photos.groom} alt={couple.groomFull} data-parallax="0.12" className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full aspect-[3/4] flex items-center justify-center"><span className="script-display text-4xl text-primary/50">{couple.groom.charAt(0)}</span></div>
                )}
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">{labels.groomLabel}</p>
            <h3 className="serif-body text-3xl text-fg">{couple.groomFull}</h3>
            <p className="mt-2 serif-body text-muted leading-relaxed max-w-xs mx-auto">{couple.groomDesc}</p>
          </div>

          <div data-reveal data-entrance className="text-center group md:mt-20">
            <div className="gold-frame max-w-xs mx-auto mb-6 rounded-sm overflow-hidden">
              <div className="overflow-hidden rounded-[3px] bg-surface">
                {photos.bride ? (
                  <img src={photos.bride} alt={couple.brideFull} data-parallax="0.15" className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full aspect-[3/4] flex items-center justify-center"><span className="script-display text-4xl text-primary/50">{couple.bride.charAt(0)}</span></div>
                )}
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">{labels.brideLabel}</p>
            <h3 className="serif-body text-3xl text-fg">{couple.brideFull}</h3>
            <p className="mt-2 serif-body text-muted leading-relaxed max-w-xs mx-auto">{couple.brideDesc}</p>
          </div>
        </div>

        <div className="text-center mt-20" data-reveal data-entrance>
          <p className="script-display text-4xl text-primary mb-6">{couple.ampersand}</p>
          <p className="serif-body text-lg text-muted/80 italic leading-relaxed max-w-2xl mx-auto">{quote.text}</p>
          <p className="text-muted text-xs uppercase tracking-[0.3em] mt-4">{quote.source}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Save The Date / Countdown ---------- */
function SaveTheDate({ cfg }: { cfg: Cfg }) {
  const t = useCountdown(cfg.event.countdownDate);
  const L = cfg.labels;
  return (
    <section data-section className="min-h-screen flex items-center justify-center px-4 py-12 bg-sand/60 relative overflow-hidden">
      <SectionVideo cfg={cfg} name="savedate" />
      <div className="max-w-3xl mx-auto text-center relative z-10" data-reveal data-entrance>
        <span className="kicker block mb-4">{L.saveTheDate}</span>
        <p className="serif-body text-2xl md:text-3xl text-fg mb-2">{cfg.event.day}, {cfg.event.date}</p>
        <Ornament className="w-36 mx-auto my-6" />
        <div className="flex justify-center gap-3 md:gap-6">
          {[
            { label: L.dayLabel, value: t.d },
            { label: L.hourLabel, value: t.h },
            { label: L.minuteLabel, value: t.m },
            { label: L.secondLabel, value: t.s },
          ].map((c) => (
            <div key={c.label} className="flex flex-col items-center soft-card px-4 md:px-7 py-5 soft-shadow min-w-[76px] md:min-w-[104px]">
              <div className="serif-body text-4xl md:text-5xl text-primary-light tabular-nums">{c.value}</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted mt-2">{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Event Info ---------- */
function EventCard({ title, time, place, mapsUrl, mapLabel }: { title: string; time: string; place: string; mapsUrl: string; mapLabel?: string }) {
  return (
    <div data-reveal data-entrance className="group relative overflow-hidden rounded-card border border-primary/15 bg-surface/80 backdrop-blur-sm soft-shadow hover:soft-shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* accent top bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary-light to-accent" />
      <div className="p-6 text-center">
        {/* icon */}
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light group-hover:scale-110 transition-transform duration-300">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="serif-body text-2xl text-fg font-semibold mb-3">{title}</h3>
        <div className="hairline w-12 mx-auto mb-4" />
        {/* time */}
        <div className="inline-flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
          </svg>
          <span className="serif-body text-lg text-primary-light font-medium">{time}</span>
        </div>
        {/* place */}
        <div className="flex items-start justify-center gap-2 text-muted">
          <svg className="w-4 h-4 mt-0.5 shrink-0 text-primary-light/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="serif-body text-sm leading-relaxed">{place}</span>
        </div>
        {/* map CTA */}
        <a
          href={mapsUrl} target="_blank" rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 bg-primary/10 hover:bg-primary text-primary-light hover:text-bg border border-primary/30 px-5 py-2 text-[11px] uppercase tracking-[0.2em] rounded-full transition-all duration-300 cursor-pointer group-hover:shadow-lg"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {mapLabel || "Google Map"}
        </a>
      </div>
    </div>
  );
}

function Info({ cfg }: { cfg: Cfg }) {
  const L = cfg.labels;
  return (
    <section data-section className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <SectionVideo cfg={cfg} name="info" />
      <div className="max-w-3xl mx-auto w-full relative z-10">
        <div className="text-center mb-10" data-reveal data-entrance>
          <h2 data-line-reveal className="section-heading text-2xl md:text-3xl fade-up">
            <span className="line"><span className="line-inner"><span className="heading-accent">{L.eventSection}</span></span></span>
            <span className="section-heading-line" />
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <EventCard title={cfg.event.akad.title} time={cfg.event.akad.time} place={cfg.event.akad.place} mapsUrl={cfg.event.akad.mapsUrl} mapLabel={L.googleMap} />
          {/* divider dengan tanggal (mobile) */}
          <div className="md:hidden flex items-center gap-4 my-1">
            <div className="flex-1 h-px bg-primary/20" />
            <span className="serif-body text-primary-light italic text-sm">{cfg.event.day}, {cfg.event.date}</span>
            <div className="flex-1 h-px bg-primary/20" />
          </div>
          <EventCard title={cfg.event.resepsi.title} time={cfg.event.resepsi.time} place={cfg.event.resepsi.place} mapsUrl={cfg.event.resepsi.mapsUrl} mapLabel={L.googleMap} />
        </div>
        {/* tanggal di bawah */}
        <div className="text-center mt-8" data-reveal data-entrance>
          <p className="script-display text-3xl md:text-4xl text-primary-light">{cfg.event.day}</p>
          <p className="serif-body text-xl text-fg mt-1">{cfg.event.date}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Gallery (carousel / justified) ---------- */
function Gallery({ cfg }: { cfg: Cfg }) {
  const images = cfg.gallery.images?.length ? cfg.gallery.images : cfg.photos.gallery;
  const layout = cfg.theme.galleryLayout;
  const [idx, setIdx] = useState(0);
  const next = useCallback(() => setIdx((i) => (i + 1) % Math.max(1, images.length)), [images.length]);
  const prev = () => setIdx((i) => (i - 1 + Math.max(1, images.length)) % Math.max(1, images.length));

  useEffect(() => {
    if (images.length < 2) return;
    const i = setInterval(next, 4000);
    return () => clearInterval(i);
  }, [next, images.length]);

  if (!images.length) return null;

  return (
    <section data-section className="min-h-screen flex items-center justify-center px-4 py-12 bg-sand/60 relative overflow-hidden">
      <SectionVideo cfg={cfg} name="gallery" />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12" data-reveal data-entrance>
          <span className="kicker block mb-4">Galeri</span>
          <h2 data-line-reveal className="section-heading text-3xl md:text-4xl fade-up">
            <span className="line"><span className="line-inner"><span className="heading-accent">{cfg.gallery.heading}</span></span></span>
            <span className="section-heading-line" />
          </h2>
          <Ornament className="w-36 mx-auto mt-6" />
        </div>

        {layout === "justified" ? (
          /* Justified masonry — rata kiri-kanan seperti ART MELODY */
          <div data-reveal data-entrance className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {images.map((src, i) => (
              <a
                key={i}
                href={src}
                target="_blank"
                rel="noreferrer"
                className={`group overflow-hidden rounded-card relative ${i % 3 === 2 ? "row-span-2" : ""} ${i % 4 === 0 ? "md:col-span-2" : ""}`}
              >
                <img src={src} alt="" loading="lazy" className="w-full h-full object-cover min-h-[180px] transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
              </a>
            ))}
          </div>
        ) : (
          /* Carousel — auto-play seperti asli */
          <div data-reveal data-entrance className="relative gold-frame rounded-sm overflow-hidden soft-shadow-lg">
            <div className="overflow-hidden rounded-[3px] aspect-[4/3]">
              <img
                src={images[idx % images.length]}
                alt=""
                className="w-full h-full object-cover transition-opacity duration-700"
                style={{ animation: "fadeUp 0.6s ease" }}
              />
            </div>
            {images.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-bg/60 hover:bg-primary hover:text-bg border border-primary/40 text-primary-light flex items-center justify-center cursor-pointer transition-colors z-10" aria-label="Sebelumnya">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-bg/60 hover:bg-primary hover:text-bg border border-primary/40 text-primary-light flex items-center justify-center cursor-pointer transition-colors z-10" aria-label="Berikutnya">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === idx % images.length ? "bg-primary w-6" : "bg-muted/40 hover:bg-muted/70"}`} aria-label={`Foto ${i + 1}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- Section Video Background wrapper ---------- */
function SectionVideo({ cfg, name }: { cfg: Cfg; name: keyof Cfg["sectionVideos"] }) {
  const sv = cfg.sectionVideos?.[name];
  if (!sv?.enabled || !sv.video) return null;
  const vidMode = cfg.theme.motion?.videoCoverMode || "cover";
  const vidOp = (parseInt(cfg.theme.videoOpacity) || 70) / 100;
  const bgOp = (parseInt(cfg.theme.bgOpacity) || 100) / 100;
  const isParallax = vidMode === "parallax";
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${isParallax ? "section-video-parallax" : ""}`} aria-hidden>
      <video
        src={sv.video}
        autoPlay muted playsInline loop
        preload="auto"
        className={`w-full h-full ${vidMode === "contain" ? "object-contain" : "object-cover"} ${isParallax ? "video-parallax-el" : ""}`}
        style={{ opacity: vidOp }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/50 to-bg/80" style={{ opacity: bgOp }} />
    </div>
  );
}

/* ---------- Initial (inisial pasangan besar) ---------- */
function InitialSection({ cfg }: { cfg: Cfg }) {
  const { initial } = cfg;
  if (!initial.enabled) return null;
  return (
    <section data-section className="py-16 px-4 text-center relative overflow-hidden" data-reveal data-entrance>
      <SectionVideo cfg={cfg} name="initial" />
      <div className="max-w-xl mx-auto relative z-10">
        <span className="kicker block mb-5">Dengan mengharap ridho Allah SWT</span>
        <p className={`script-display text-primary-light leading-tight ${cfg.theme.headingSize}`}>{initial.text}</p>
        <div className="flex items-center justify-center gap-4 my-6">
          <div className="h-px w-16 bg-primary/30" />
          <Ornament className="w-24" />
          <div className="h-px w-16 bg-primary/30" />
        </div>
        <p className="serif-body text-muted italic">Merupakan suatu kehormatan bagi kami mengundang Bapak/Ibu/Saudara/i</p>
      </div>
    </section>
  );
}

/* ---------- Timeline (perjalanan cinta) ---------- */
function TimelineSection({ cfg }: { cfg: Cfg }) {
  const { timeline } = cfg;
  if (!timeline.enabled || !timeline.items?.length) return null;
  return (
    <section data-section className="min-h-screen flex items-center justify-center px-4 py-16 bg-sand/60 relative overflow-hidden">
      <SectionVideo cfg={cfg} name="timeline" />
      <div className="max-w-4xl mx-auto w-full relative z-10">
        <div className="text-center mb-16" data-reveal data-entrance>
          <span className="kicker block mb-4">{timeline.heading}</span>
          <h2 data-line-reveal className="section-heading text-4xl md:text-5xl fade-up">
            <span className="line"><span className="line-inner"><span className="heading-accent">{timeline.heading}</span></span></span>
            <span className="section-heading-line" />
          </h2>
          <Ornament className="w-40 mx-auto mt-6" />
        </div>
        <div className="relative" data-reveal data-entrance>
          {/* garis tengah desktop / kiri mobile */}
          <div className="absolute md:left-1/2 left-5 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/10 via-primary/40 to-primary/10" />
          {timeline.items.map((item, i) => (
            <div key={i} className={`relative flex flex-col md:flex-row md:items-start mb-14 md:mb-16 pl-14 md:pl-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
              {/* dot */}
              <div className="absolute left-5 -translate-x-1/2 top-2 md:top-6 w-5 h-5 rounded-full bg-primary border-4 border-bg shadow-lg shadow-primary/40 z-10" />
              {/* nomor urut */}
              <div className="hidden md:block md:w-1/2" />
              <div className={`md:w-1/2 w-full md:px-10 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                <div className={`group relative overflow-hidden rounded-card border border-primary/25 bg-gradient-to-br from-primary/10 via-surface/95 to-primary/5 backdrop-blur-sm soft-shadow-lg hover:soft-shadow-xl transition-all duration-300 hover:-translate-y-1 p-7 md:p-8 w-full min-h-[240px] md:min-h-[240px] flex flex-col justify-center ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  {/* aksen garis atas */}
                  <div className={`absolute top-0 ${i % 2 === 0 ? "left-0 right-1/2" : "right-0 left-1/2"} h-1 bg-gradient-to-r ${i % 2 === 0 ? "from-primary to-transparent" : "from-transparent to-primary"}`} />
                  {/* glow pojok */}
                  <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-colors duration-500" />
                  {/* date badge */}
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm font-semibold tracking-widest`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {item.date}
                  </div>
                  <h3 className="section-heading text-2xl md:text-3xl mb-3">{item.title}</h3>
                  <div className={`hairline w-14 mb-4 ${i % 2 === 0 ? "md:ml-auto" : ""}`} />
                  <p className="serif-body text-muted text-base leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Live Streaming ---------- */
function LiveStreamSection({ cfg }: { cfg: Cfg }) {
  const { liveStream } = cfg;
  if (!liveStream.enabled) return null;
  return (
    <section data-section className="min-h-screen flex items-center justify-center px-4 py-12 text-center">
      <div className="max-w-xl mx-auto" data-reveal data-entrance>
        <span className="kicker block mb-4">{liveStream.subheading}</span>
        <h2 data-line-reveal className="section-heading text-3xl md:text-4xl fade-up">
          <span className="line"><span className="line-inner"><span className="heading-accent">{liveStream.heading}</span></span></span>
          <span className="section-heading-line" />
        </h2>
        <Ornament className="w-36 mx-auto my-6" />
        <p className="serif-body text-muted text-lg leading-relaxed mb-8">{liveStream.text}</p>
        <a
          href={liveStream.buttonUrl} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-bg px-8 py-3.5 text-sm font-medium rounded-btn transition-all duration-300 soft-shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-2 6l6 4-6 4V8z" />
          </svg>
          {liveStream.buttonLabel}
        </a>
      </div>
    </section>
  );
}

/* ---------- Exclusive Web Invitation ---------- */
function ExclusiveSection({ cfg }: { cfg: Cfg }) {
  const { exclusive } = cfg;
  if (!exclusive.enabled) return null;
  return (
    <section data-section className="min-h-screen flex items-center justify-center px-4 py-12 bg-sand/60 text-center relative overflow-hidden">
      <div className="max-w-xl mx-auto relative z-10" data-reveal data-entrance>
        <CornerOrnament className="absolute -top-10 -left-10 w-24" />
        <CornerOrnament className="absolute -bottom-10 -right-10 w-24 flip" />
        <span className="kicker block mb-4">Invitation</span>
        <h2 data-line-reveal className="section-heading text-3xl md:text-4xl mb-6 fade-up">
          <span className="line"><span className="line-inner"><span className="heading-accent">{exclusive.heading}</span></span></span>
          <span className="section-heading-line" />
        </h2>
        <Ornament className="w-40 mx-auto mb-8" />
        {exclusive.logoUrl && (
          <img src={exclusive.logoUrl} alt="logo" className="w-20 h-20 object-contain mx-auto mb-6" />
        )}
        <p className="serif-body text-lg text-muted/80 leading-relaxed max-w-md mx-auto mb-8">{exclusive.text}</p>
        <div className="flex justify-center gap-3">
          {exclusive.instagramUrl && (
            <a href={exclusive.instagramUrl} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full border border-primary/40 text-primary-light flex items-center justify-center hover:bg-primary hover:text-bg transition-colors cursor-pointer" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 3.6a6.2 6.2 0 100 12.4 6.2 6.2 0 000-12.4zm0 10.2a4 4 0 110-8 4 4 0 010 8zm6.4-11.8a1.4 1.4 0 100 2.9 1.4 1.4 0 000-2.9z" />
              </svg>
            </a>
          )}
          {exclusive.whatsappUrl && (
            <a href={exclusive.whatsappUrl} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full border border-primary/40 text-primary-light flex items-center justify-center hover:bg-primary hover:text-bg transition-colors cursor-pointer" aria-label="WhatsApp">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 00-8.7 15L2 22l5.1-1.3A10 10 0 1012 2z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- Gift ---------- */
function Gift({ cfg }: { cfg: Cfg }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [open, setOpen] = useState<"bank" | "qris" | "kado" | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({ name: "", bank: "", nominal: "", ucapan: "", file: "" });
  const { gift, labels: L } = cfg;

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
    <section data-section className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <SectionVideo cfg={cfg} name="gift" />
      <div className="max-w-xl mx-auto text-center relative z-10">
        <div data-reveal data-entrance>
          <span className="kicker block mb-4">{L.giftSection}</span>
          <h2 data-line-reveal className="section-heading text-3xl md:text-4xl mb-5 fade-up">
            <span className="line"><span className="line-inner"><span className="heading-accent">{gift.heading}</span></span></span>
            <span className="section-heading-line" />
          </h2>
          <Ornament className="w-36 mx-auto mb-6" />
          <p className="serif-body text-muted text-lg leading-relaxed mb-8">{gift.intro}</p>
        </div>

        <div className={`grid gap-3 ${gift.qrisEnabled ? "grid-cols-3" : "grid-cols-2"}`} data-reveal data-entrance>
          <button
            onClick={() => setOpen(open === "bank" ? null : "bank")}
            className={`group flex flex-col items-center gap-2 py-4 px-2 rounded-2xl text-sm transition-all duration-300 cursor-pointer border ${
              open === "bank" ? "bg-primary text-bg border-primary soft-shadow scale-[1.02]" : "border-primary/40 text-primary-light hover:border-primary hover:bg-primary/5"
            }`}
          >
            <svg className={`w-6 h-6 ${open === "bank" ? "text-bg" : "text-primary-light"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h2m6 0h2M5 6h14a1 1 0 011 1v3H4V7a1 1 0 011-1zM4 10v8a1 1 0 001 1h14a1 1 0 001-1v-8" />
            </svg>
            {L.transferBank}
          </button>
          {gift.qrisEnabled && (
            <button
              onClick={() => setOpen(open === "qris" ? null : "qris")}
              className={`group flex flex-col items-center gap-2 py-4 px-2 rounded-2xl text-sm transition-all duration-300 cursor-pointer border ${
                open === "qris" ? "bg-primary text-bg border-primary soft-shadow scale-[1.02]" : "border-primary/40 text-primary-light hover:border-primary hover:bg-primary/5"
              }`}
            >
              <svg className={`w-6 h-6 ${open === "qris" ? "text-bg" : "text-primary-light"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5h4v4H5zM15 5h4v4h-4zM5 15h4v4H5zM15 15h4v4h-4zM3 5a2 2 0 012-2m14 0a2 2 0 012 2m0 14a2 2 0 01-2 2m-14 0a2 2 0 01-2-2" />
              </svg>
              {L.qris}
            </button>
          )}
          <button
            onClick={() => setOpen(open === "kado" ? null : "kado")}
            className={`group flex flex-col items-center gap-2 py-4 px-2 rounded-2xl text-sm transition-all duration-300 cursor-pointer border ${
              open === "kado" ? "bg-primary text-bg border-primary soft-shadow scale-[1.02]" : "border-primary/40 text-primary-light hover:border-primary hover:bg-primary/5"
            }`}
          >
            <svg className={`w-6 h-6 ${open === "kado" ? "text-bg" : "text-primary-light"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8M3 8h18v4H3zM12 8v13M12 8s-1-4-4-4c-2 0-3 2-3 3.5S9 8 12 8zm0 0s1-4 4-4c2 0 3 2 3 3.5S15 8 12 8z" />
            </svg>
            {L.sendGift}
          </button>
        </div>

        {open === "qris" && (
          <div data-reveal data-entrance className="mt-6 soft-card p-8 soft-shadow">
            <div className="w-44 h-44 mx-auto mb-4 bg-white rounded-xl flex items-center justify-center overflow-hidden p-2">
              <QRCodeCanvas value={gift.qrisValue} size={160} fgColor="#0f172a" bgColor="#ffffff" level="M" />
            </div>
            <p className="text-muted text-xs">{L.scanQr}</p>
          </div>
        )}

        {open === "bank" && (
          <div data-reveal data-entrance className="mt-6 soft-card p-8 soft-shadow text-left">
            <div className="flex justify-between items-center border-b border-border pb-4">
              <div>
                <p className="text-muted text-sm">{gift.bank.name}</p>
                <p className="serif-body text-2xl text-fg mt-1">{gift.bank.number}</p>
              </div>
              <button
                onClick={() => copy("bank", gift.bank.number)}
                className="border border-primary text-primary-light hover:bg-primary hover:text-bg px-4 py-2 text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer"
              >
                {copied === "bank" ? L.copied : L.copyRekening}
              </button>
            </div>
            <p className="text-muted text-sm mt-4">a.n. {gift.bank.holder}</p>
          </div>
        )}

        {open === "kado" && (
          <div data-reveal data-entrance className="mt-6 soft-card p-8 soft-shadow text-left">
            <div className="flex justify-between items-start gap-4 border-b border-border pb-4">
              <div>
                <p className="text-muted text-sm mb-1">{L.sendGiftLabel}</p>
                <p className="serif-body text-lg text-fg">{gift.kado.name}</p>
                <p className="text-muted text-sm mt-1">{gift.kado.address}</p>
              </div>
              <button
                onClick={() => copy("kado", `${gift.kado.name}, ${gift.kado.address}`)}
                className="shrink-0 border border-primary text-primary-light hover:bg-primary hover:text-bg px-4 py-2 text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer"
              >
                {copied === "kado" ? L.copied : L.copyAlamat || "Copy Alamat"}
              </button>
            </div>
            <p className="text-muted text-sm mt-4">{gift.kado.note}</p>
          </div>
        )}

        <div className="mt-10 text-left" data-reveal data-entrance>
          <div className="text-center mb-6">
            <span className="kicker block">{L.giftFormTitle}</span>
            <Ornament className="w-28 mx-auto mt-4" />
          </div>

          {status === "sent" ? (
            <div className="soft-card p-10 text-center soft-shadow-lg">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/15 flex items-center justify-center">
                <svg className="w-7 h-7 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="script-display text-4xl text-primary-light mb-2">{L.thanksTitle}</p>
              <p className="serif-body text-muted">{L.thanksBody}</p>
              <button onClick={() => { setStatus("idle"); setForm({ name: "", bank: "", nominal: "", ucapan: "", file: "" }); }} className="mt-6 text-primary-light hover:text-primary text-sm font-medium transition-colors cursor-pointer">
                {L.sendAgain}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">{L.nameRequired}</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-border bg-surface px-4 py-3.5 text-fg rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder={L.namePlaceholder} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted mb-2">{L.bankName}</label>
                  <input value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })} className="w-full border border-border bg-surface px-4 py-3.5 text-fg rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="BCA / Mandiri / dll" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted mb-2">{L.nominal}</label>
                  <input value={form.nominal} onChange={(e) => setForm({ ...form, nominal: e.target.value })} className="w-full border border-border bg-surface px-4 py-3.5 text-fg rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Rp. 100.000" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">{L.ucapan}</label>
                <textarea value={form.ucapan} onChange={(e) => setForm({ ...form, ucapan: e.target.value })} rows={3} className="w-full border border-border bg-surface px-4 py-3.5 text-fg rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" placeholder="Tulis ucapan..." />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">{L.buktiTf}</label>
                <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, file: e.target.files?.[0]?.name || "" })} className="w-full text-sm text-muted file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:bg-primary/15 file:text-primary-light file:text-xs file:uppercase file:tracking-widest file:cursor-pointer hover:file:bg-primary/25 cursor-pointer" />
              </div>
              <button type="submit" disabled={status === "sending"} className="sheen w-full bg-primary hover:bg-primary-light text-bg py-4 text-sm font-medium rounded-full transition-all duration-300 soft-shadow-lg hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer">
                {status === "sending" ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-bg/40 border-t-bg ring-spin" />
                    {L.sending}
                  </span>
                ) : L.confirmBtn}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- RSVP ---------- */
function Rsvp({ cfg }: { cfg: Cfg }) {
  const [form, setForm] = useState({ name: "", presence: "Hadir", jumlah: "1 Orang" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const L = cfg.labels;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1200);
  };

  return (
    <section data-section className="min-h-screen flex items-center justify-center px-4 py-12 bg-sand/60 relative overflow-hidden">
      <SectionVideo cfg={cfg} name="rsvp" />
      <div className="max-w-xl mx-auto relative z-10">
        <div className="text-center mb-12" data-reveal data-entrance>
          <span className="kicker block mb-4">{L.rsvpSection}</span>
          <h2 data-line-reveal className="section-heading text-3xl md:text-4xl fade-up">
            <span className="line"><span className="line-inner"><span className="heading-accent">{cfg.rsvp.heading}</span></span></span>
            <span className="section-heading-line" />
          </h2>
          <Ornament className="w-36 mx-auto mt-6" />
          <p className="serif-body text-muted mt-6 max-w-md mx-auto leading-relaxed">{cfg.rsvp.intro}</p>
        </div>

        {status === "sent" ? (
          <div data-reveal data-entrance className="soft-card p-12 text-center soft-shadow-lg">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/15 flex items-center justify-center">
              <svg className="w-7 h-7 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="script-display text-4xl text-primary-light mb-2">{L.thanksTitle}</p>
            <p className="serif-body text-muted">{L.thanksBody}</p>
            <button onClick={() => { setStatus("idle"); setForm({ name: "", presence: "Hadir", jumlah: "1 Orang" }); }} className="mt-6 text-primary-light hover:text-primary text-sm font-medium transition-colors cursor-pointer">
              {L.sendAgain}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} data-reveal data-entrance className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">{L.nameRequired}</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-border bg-surface px-4 py-3.5 text-fg rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder={L.namePlaceholder} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">{L.rsvpPresence}</label>
              <div className="grid grid-cols-2 gap-3">
                {[L.rsvpHadir, L.rsvpTidak].map((p) => (
                  <button type="button" key={p} onClick={() => setForm({ ...form, presence: p })} className={`py-3.5 border text-sm rounded-xl transition-all duration-300 cursor-pointer ${form.presence === p ? "bg-primary text-bg border-primary soft-shadow" : "border-primary/30 text-muted hover:border-primary"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">{L.rsvpJumlah}</label>
              <div className="grid grid-cols-2 gap-3">
                {[L.rsvp1Orang, L.rsvp2Orang].map((p) => (
                  <button type="button" key={p} onClick={() => setForm({ ...form, jumlah: p })} className={`py-3.5 border text-sm rounded-xl transition-all duration-300 cursor-pointer ${form.jumlah === p ? "bg-primary text-bg border-primary soft-shadow" : "border-primary/30 text-muted hover:border-primary"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={status === "sending"} className="sheen w-full bg-primary hover:bg-primary-light text-bg py-4 text-sm font-medium rounded-full transition-all duration-300 soft-shadow-lg hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer">
              {status === "sending" ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-bg/40 border-t-bg ring-spin" />
                  {L.sending}
                </span>
              ) : L.rsvpSubmit}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ---------- Guest Book ---------- */
function GuestBook({ cfg }: { cfg: Cfg }) {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [list, setList] = useState<{ name: string; msg: string }[]>([
    { name: "Yogi dan Ratna", msg: "Selamat menempuh hidup baru, semoga menjadi keluarga yang sakinah mawaddah warahmah. Aamiin." },
  ]);
  const [sent, setSent] = useState(false);
  const L = cfg.labels;

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
    <section data-section className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <SectionVideo cfg={cfg} name="guestbook" />
      <div className="max-w-xl mx-auto relative z-10">
        <div className="text-center mb-12" data-reveal data-entrance>
          <span className="kicker block mb-4">{L.guestbookSection}</span>
          <h2 data-line-reveal className="section-heading text-3xl md:text-4xl fade-up">
            <span className="line"><span className="line-inner"><span className="heading-accent">{cfg.guestbook.heading}</span></span></span>
            <span className="section-heading-line" />
          </h2>
          <Ornament className="w-36 mx-auto mt-6" />
          <p className="serif-body text-muted mt-6 max-w-md mx-auto leading-relaxed">{cfg.guestbook.intro}</p>
        </div>

        <form onSubmit={submit} data-reveal data-entrance className="soft-card p-6 soft-shadow space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">{L.guestbookName}</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-border bg-bg px-4 py-3 text-fg rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder={L.namePlaceholder} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">{L.guestbookMsg}</label>
            <textarea required value={msg} onChange={(e) => setMsg(e.target.value)} rows={3} className="w-full border border-border bg-bg px-4 py-3 text-fg rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" placeholder={L.guestbookPlaceholder} />
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primary-light text-bg py-3.5 text-sm font-medium rounded-full transition-all duration-300 soft-shadow cursor-pointer active:scale-[0.98]">
            {sent ? L.guestbookSent : L.guestbookSend}
          </button>
        </form>

        <div className="mt-8 space-y-3" data-reveal data-entrance>
          {list.map((g, i) => (
            <div key={i} className="soft-card p-5 soft-shadow flex gap-4 items-start">
              <div className="w-11 h-11 shrink-0 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center text-primary-light font-medium">
                {g.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-fg text-sm font-medium">{g.name}</p>
                <p className="serif-body text-muted mt-1 leading-relaxed">{g.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Closing ---------- */
function Closing({ cfg }: { cfg: Cfg }) {
  const L = cfg.labels;
  return (
    <section data-section className="min-h-screen flex items-center justify-center px-4 py-12 bg-sand/60 text-center relative overflow-hidden">
      <SectionVideo cfg={cfg} name="closing" />
      <div className="max-w-xl mx-auto relative z-10" data-reveal data-entrance>
        <CornerOrnament className="absolute -top-10 -left-10 w-24" />
        <CornerOrnament className="absolute -bottom-10 -right-10 w-24 flip" />
        <span className="kicker block mb-4">{L.closingTitle}</span>
        <h2 data-line-reveal className="section-heading text-3xl md:text-4xl mb-6 fade-up">
          <span className="line"><span className="line-inner"><span className="heading-accent">{cfg.closing.heading}</span></span></span>
          <span className="section-heading-line" />
        </h2>
        <Ornament className="w-40 mx-auto mb-8" />
        <p className="serif-body text-lg text-muted/80 leading-relaxed max-w-md mx-auto">{cfg.closing.text}</p>
        <p className="serif-body text-3xl text-primary-light mt-12 mb-2">{cfg.couple.groomFull} &amp; {cfg.couple.brideFull}</p>
        <p className="text-muted text-xs uppercase tracking-[0.3em]">{cfg.event.date}</p>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer({ cfg }: { cfg: Cfg }) {
  return (
    <footer className="py-10 px-4 text-center border-t border-primary/15">
      <p className="text-muted text-xs">{cfg.footer.credit}</p>
    </footer>
  );
}

/* ---------- Layout presets ---------- */
const LAYOUT_PRESETS: { key: string; name: string; desc: string; sections: string[] }[] = [
  {
    key: "galeri", name: "Galeri Bawah", desc: "Gift awal, galeri di paling bawah ",
    sections: ["couple", "savedate", "info", "gift", "rsvp", "guestbook", "closing", "gallery"],
  },
  {
    key: "klasik", name: "Klasik Lengkap", desc: "Semua section urut standar",
    sections: ["couple", "initial", "savedate", "timeline", "info", "liveStream", "gallery", "gift", "rsvp", "guestbook", "exclusive", "closing"],
  },
  {
    key: "live", name: "Live Streaming", desc: "Live stream ditambah, tanpa timeline ",
    sections: ["couple", "savedate", "info", "liveStream", "gift", "rsvp", "guestbook", "closing", "gallery"],
  },
  {
    key: "premium", name: "Premium Lengkap", desc: "Live + timeline + galeri bawah ",
    sections: ["couple", "savedate", "timeline", "info", "liveStream", "gift", "rsvp", "guestbook", "closing", "gallery"],
  },
  {
    key: "story", name: "Kisah Cinta", desc: "Timeline duluan, inisial menonjol ",
    sections: ["couple", "initial", "timeline", "savedate", "info", "gift", "rsvp", "guestbook", "closing", "gallery"],
  },
  {
    key: "savedate", name: "Save Date Awal", desc: "Hitung mundur ditegaskan di awal ",
    sections: ["couple", "savedate", "info", "liveStream", "gift", "rsvp", "gallery"],
  },
  {
    key: "minimal", name: "Minimal Ringkas", desc: "Tanpa timeline/live/ucapan ",
    sections: ["couple", "savedate", "info", "gift", "gallery"],
  },
  {
    key: "mewah", name: "Mewah Full", desc: "Semua section lengkap + exclusive",
    sections: ["couple", "initial", "savedate", "timeline", "info", "liveStream", "gallery", "gift", "rsvp", "guestbook", "exclusive", "closing"],
  },
];

/* ---------- Layout renderer: susun section sesuai cfg.layout ---------- */
function LayoutRenderer({ cfg }: { cfg: Cfg }) {
  const sections = cfg.layout?.sections?.length ? cfg.layout.sections : LAYOUT_PRESETS[0].sections;
  const map: Record<string, ReactNode> = {
    couple: <Couple cfg={cfg} />,
    initial: <InitialSection cfg={cfg} />,
    savedate: <SaveTheDate cfg={cfg} />,
    timeline: <TimelineSection cfg={cfg} />,
    info: <Info cfg={cfg} />,
    liveStream: <LiveStreamSection cfg={cfg} />,
    gallery: <Gallery cfg={cfg} />,
    gift: <Gift cfg={cfg} />,
    rsvp: <Rsvp cfg={cfg} />,
    guestbook: <GuestBook cfg={cfg} />,
    exclusive: <ExclusiveSection cfg={cfg} />,
    closing: <Closing cfg={cfg} />,
  };
  return (
    <>
      {sections.map((s) => map[s] ?? null)}
      <Footer cfg={cfg} />
    </>
  );
}

/* ---------- App ---------- */
export default function App() {
  const cfg = useConfig();
  useApplyTheme(cfg);
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const guest = useGuestName();
  const { playing, toggle } = useMusicPlayer(cfg?.media.musicEnabled || false, cfg?.media.music || "");
  const scrollScope = useScrollSetup(opened);
  const animScope = useWeddingAnimations(opened, cfg?.theme.motion);
  const scope = animScope || scrollScope;
  const handleOpen = useCallback(() => {
    setOpening(true);
    setTimeout(() => setOpened(true), 800);
  }, []);

  if (!cfg || loading) return <LoadingScreen onDone={() => setLoading(false)} />;

  return (
    <div ref={scope} data-scroll-container className="min-h-screen bg-bg text-fg relative overflow-x-hidden">
      <Blobs />

      <div className="fixed top-0 left-0 right-0 h-0.5 bg-transparent z-50">
        <div data-progress className="h-full bg-primary origin-left scale-x-0" />
      </div>

      {!opened ? (
        <div className={`relative z-10 ${opening ? "open-fade" : ""}`}>
          <Cover onOpen={handleOpen} guest={guest} cfg={cfg} />
        </div>
      ) : (
        <div className="relative z-10">
          <main>
            <LayoutRenderer cfg={cfg} />
          </main>
        </div>
      )}

      {cfg.media.musicEnabled && cfg.media.music && (
        <button
          onClick={toggle}
          className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full border border-primary bg-bg/85 backdrop-blur text-primary-light flex items-center justify-center soft-shadow-lg hover:bg-primary hover:text-bg transition-colors cursor-pointer"
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
      )}
    </div>
  );
}
