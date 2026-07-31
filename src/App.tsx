import './App.css'

const themes = [
  {
    name: 'Pernikahan',
    desc: 'Desain klasik untuk momen spesial Anda.',
  },
  {
    name: 'Akad Nikah',
    desc: 'Fokus pada ketenangan dan kesederhanaan.',
  },
  {
    name: 'Ulang Tahun',
    desc: 'Merayakan momen dengan gaya minimalis.',
  },
]

const features = [
  {
    title: 'Undangan Online',
    desc: 'Bagikan lewat link ke WhatsApp atau sosial media. Tidak perlu cetak.',
  },
  {
    title: 'Edit Sendiri',
    desc: 'Ubah nama, tanggal, lokasi, dan warna tanpa minta tolong desainer.',
  },
  {
    title: 'Tampilan Rapi',
    desc: 'Desain yang sopan dan profesional untuk semua kalangan.',
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
            <span>UndanganKu</span>
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
              <h1 className="hero-title">
                Undangan pernikahan yang <span className="accent">rapi dan sopan</span>
              </h1>
              <p className="hero-subtitle">
                Buat undangan digital yang layak dibuka keluarga. Mudah dibagikan, gampang diatur, tanpa ribet desain.
              </p>
              <div className="hero-actions">
                <a href="#tema" className="btn btn-primary">
                  Lihat Tema
                </a>
                <a href="#fitur" className="btn btn-outline">
                  Cara Kerja
                </a>
              </div>
            </div>

            <div className="hero-preview">
              <div className="preview-card">
                <div className="preview-body">
                  <div className="preview-kicker">Undangan Pernikahan</div>
                  <div className="preview-names">Annisa & Ahmad</div>
                  <div className="preview-event">Sabtu, 20 Desember 2025<br/>Gedung Graha, Jakarta</div>

                  <div className="preview-divider" />

                  <div className="preview-info">
                    <div className="preview-info-item">
                      <span className="label">Akad Nikah</span>
                      <span className="value">09.00 WIB</span>
                    </div>
                    <div className="preview-info-item">
                      <span className="label">Resepsi</span>
                      <span className="value">11.00 WIB</span>
                    </div>
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
                <h2 className="section-title">Pilih Tema Undangan</h2>
                <p className="section-subtitle">
                  Tema yang sudah terbukti dipakai banyak pasangan. Bisa disesuaikan warna dan isi.
                </p>
              </div>
            </div>

            <div className="themes-grid">
              {themes.map((t) => (
                <article className="theme-card" key={t.name}>
                  <div className="theme-preview">
                    <div className="theme-mock" />
                  </div>
                  <div className="theme-content">
                    <h3 className="theme-title">{t.name}</h3>
                    <p className="theme-desc">{t.desc}</p>
                    <a className="theme-link" href="#harga">
                      Lihat contoh →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="fitur" className="section section--features">
          <div className="container">
            <div className="section-header">
              <div className="section-header-main">
                <h2 className="section-title">Yang Anda Dapat</h2>
                <p className="section-subtitle">
                  Fitur yang benar-benar dipakai: undangan online, kelola tamu, bagikan link.
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
                <h2 className="section-title">Harga</h2>
                <p className="section-subtitle">
                  Mulai dari gratis. Bayar sekali, pakai selamanya.
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
                    <p className="price-sub">Bayar sekali saja</p>

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
              <span>UndanganKu</span>
            </div>
            <p className="footer-brand-text">
              Buat undangan digital yang rapi, praktis, dan mudah dibagikan.
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
          <span>Dibuat dengan kesederhanaan.</span>
        </div>
      </footer>
    </div>
  )
}

export default App
