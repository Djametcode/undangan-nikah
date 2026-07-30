import './App.css'

const themes = [
  {
    name: 'Pernikahan',
    tag: 'Classic · Romantic',
    desc: 'Desain rapi dan tenang untuk hari paling penting.',
  },
  {
    name: 'Akad Nikah',
    tag: 'Simple · Sacred',
    desc: 'Fokus pada ketenangan dan momen sakral.',
  },
  {
    name: 'Ulang Tahun',
    tag: 'Fun · Minimal',
    desc: 'Merayakan momen tanpa terasa berlebihan.',
  },
]

const features = [
  {
    title: 'Undangan Online',
    desc: 'Bagikan undangan lewat tautan, tanpa ribet cetak.',
  },
  {
    title: 'Kustom Sederhana',
    desc: 'Ganti nama, tanggal, dan warna tanpa desainer.',
  },
  {
    title: 'Tampil Elegan',
    desc: 'Desain yang sopan untuk keluarga dan tamu penting.',
  },
]

const plans = [
  { name: 'Gratis', price: '0' },
  { name: 'Standard', price: '49k' },
  { name: 'Premium', price: '99k' },
]

function App() {
  return (
    <div className="page">
      <header className="navbar">
        <div className="container navbar-inner">
          <div className="logo">
            <span className="logo-dot" />
            <span className="logo-text">UndanganKu</span>
          </div>
          <nav className="nav-links">
            <a href="#tema">Tema</a>
            <a href="#fitur">Fitur</a>
            <a href="#harga">Harga</a>
            <a href="#kontak">Kontak</a>
            <a href="#tema" className="btn btn-primary nav-cta">
              Buat Undangan
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-inner">
            <div>
              <div className="hero-eyebrow">
                <span className="hero-pill-dot" />
                <span>Undangan digital modern</span>
              </div>
              <h1 className="hero-title">
                Undangan pernikahan
                <br />
                <span className="accent">tenang dan berkelas</span>
              </h1>
              <p className="hero-subtitle">
                Buat undangan yang sopan dibuka keluarga, mudah dibagikan ke tamu, dan tidak terasa
                seperti template yang sama dengan orang lain.
              </p>
              <div className="hero-actions">
                <a href="#tema" className="btn btn-primary">
                  Lihat Tema
                </a>
                <a href="#fitur" className="btn btn-outline">
                  Pelajari Fitur
                </a>
              </div>
            </div>

            <div className="hero-preview">
              <div className="preview-card">
                <div className="preview-header">
                  <div className="preview-label">The Wedding</div>
                  <div className="preview-pill">Live Preview</div>
                </div>
                <div className="preview-body">
                  <div className="preview-kicker">Undangan</div>
                  <div className="preview-names">Annisa & Ahmad</div>
                  <div className="preview-event">Sabtu, 20 Desember 2025 · Jakarta</div>

                  <div className="preview-divider" />

                  <div className="preview-footer">
                    <span>Akad & Resepsi</span>
                    <span className="preview-tag">Detail</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="tema" className="section section--themes">
          <div className="container">
            <div className="section-header">
              <div className="section-header-main">
                <span className="section-label">
                  <span className="section-label-dot" />
                  Tema Favorit
                </span>
                <h2 className="section-title">Dipakai banyak pasangan</h2>
                <p className="section-subtitle">
                  Tema yang sering dipakai, bisa disesuaikan dengan warna dan gaya acara Anda.
                </p>
              </div>
            </div>

            <div className="themes-grid">
              {themes.map((t) => (
                <article className="theme-card" key={t.name}>
                  <header className="theme-preview">
                    <div className="theme-pill">
                      <span>{t.tag}</span>
                    </div>
                    <h3 className="theme-title">{t.name}</h3>
                    <p className="theme-desc">{t.desc}</p>
                    <div className="theme-mock" />
                  </header>
                  <footer className="theme-footer">
                    <span>Cocok untuk acara intim & keluarga.</span>
                    <a className="link-arrow" href="#harga">
                      Lihat contoh
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="M13 6l6 6-6 6" />
                      </svg>
                    </a>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="fitur" className="section section--features">
          <div className="container">
            <div className="section-header">
              <div className="section-header-main">
                <span className="section-label">
                  <span className="section-label-dot" />
                  Fitur inti
                </span>
                <h2 className="section-title">Cukup untuk kebutuhan Anda</h2>
                <p className="section-subtitle">
                  Fitur difokuskan pada hal yang benar-benar dipakai: undangan, tamu, dan kemudahan
                  berbagi.
                </p>
              </div>
            </div>

            <div className="feature-grid">
              {features.map((f) => (
                <article className="feature-card" key={f.title}>
                  <div className="feature-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                  </div>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="harga" className="section section--pricing">
          <div className="container">
            <div className="section-header">
              <div className="section-header-main">
                <span className="section-label">
                  <span className="section-label-dot" />
                  Harga
                </span>
                <h2 className="section-title">Paket sederhana, langsung jelas</h2>
                <p className="section-subtitle">
                  Mulai dari gratis sampai fitur lengkap, tanpa skema yang membingungkan.
                </p>
              </div>
            </div>

            <div className="pricing-grid">
              {plans.map((p, idx) => {
                const highlight = idx === 1
                return (
                  <article
                    key={p.name}
                    className={highlight ? 'price-card price-card--highlight' : 'price-card'}
                  >
                    {highlight && <div className="price-badge">Paling laris</div>}
                    <h3 className="price-name">{p.name}</h3>
                    <p className="price-sub">Sekali bayar, tanpa langganan</p>

                    <div className="price-amount">
                      {p.price === '0' ? (
                        <span className="value">Gratis</span>
                      ) : (
                        <>
                          <span className="currency">Rp</span>
                          <span className="value">{p.price}</span>
                        </>
                      )}
                    </div>

                    <ul className="price-list">
                      <li>Undangan online</li>
                      <li>RSVP tamu</li>
                      <li>Bagikan lewat link & QR</li>
                      {highlight && <li>Musik latar & tema lengkap</li>}
                      {idx === 2 && <li>Amplop digital & live tamu</li>}
                    </ul>

                    <button
                      type="button"
                      className={
                        idx === 1 ? 'btn btn-primary price-cta' : 'btn btn-outline price-cta'
                      }
                    >
                      Pilih paket
                    </button>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <footer id="kontak" className="footer">
        <div className="container footer-inner">
          <div>
            <div className="logo">
              <span className="logo-dot" />
              <span className="logo-text">UndanganKu</span>
            </div>
            <p className="footer-brand-text">
              Platform undangan digital untuk pasangan yang ingin undangan rapi tanpa ribet.
            </p>
            <div className="footer-meta">
              <span>hello@undangan.id</span>
              <span>Senin–Jumat · 09.00–18.00</span>
            </div>
          </div>
          <div className="footer-links">
            <div>
              <h4>Produk</h4>
              <a href="#tema">Tema</a>
              <a href="#fitur">Fitur</a>
              <a href="#harga">Harga</a>
            </div>
            <div>
              <h4>Bantuan</h4>
              <a href="#">Panduan</a>
              <a href="#">Kontak</a>
            </div>
            <div>
              <h4>Legal</h4>
              <a href="#">Kebijakan Privasi</a>
              <a href="#">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 UndanganKu</span>
          <span>Dibuat sederhana, seperti seharusnya undangan.</span>
        </div>
      </footer>
    </div>
  )
}

export default App
