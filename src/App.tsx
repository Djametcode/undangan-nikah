import './App.css'

const themes = [
  { name: 'Pernikahan', icon: '💍', colors: 'linear-gradient(135deg, #fce4ec, #f8bbd0)', desc: 'Elegan & romantis dengan berbagai variasi' },
  { name: 'Ulang Tahun', icon: '🎂', colors: 'linear-gradient(135deg, #fff9c4, #fff176)', desc: 'Ceria & penuh warna untuk momen spesial' },
  { name: 'Khitanan', icon: '🕌', colors: 'linear-gradient(135deg, #e0f2f1, #b2dfdb)', desc: 'Syarat islami & modern untuk acara syukuran' },
  { name: 'Akad Nikah', icon: '🤵', colors: 'linear-gradient(135deg, #e8eaf6, #c5cae9)', desc: 'Formal & khidmat untuk hari bahagia' },
  { name: 'Wisuda', icon: '🎓', colors: 'linear-gradient(135deg, #f3e5f5, #e1bee7)', desc: 'Bangga & inspiratif untuk pencapaian' },
  { name: 'Tasyakuran', icon: '🙏', colors: 'linear-gradient(135deg, #fbe9e7, #ffccbc)', desc: 'Hangat & syahdu untuk acara syukuran' },
]

const features = [
  { icon: '🎨', title: 'Kustomisasi Mudah', desc: 'Sesuaikan warna, font, foto, dan musik sesuai keinginan Anda tanpa coding.' },
  { icon: '📱', title: 'Responsive & Modern', desc: 'Tampilan sempurna di semua perangkat, dari HP hingga desktop.' },
  { icon: '🔗', title: 'Link & QR Code', desc: 'Bagikan undangan via link atau QR code ke keluarga dan teman.' },
  { icon: '🎵', title: 'Musik Latar', desc: 'Tambahkan lagu favorit untuk menemani tamu membaca undangan.' },
  { icon: '💬', title: 'RSVP Online', desc: 'Fitur konfirmasi kehadiran otomatis & ucapan selamat langsung.' },
  { icon: '📊', title: 'Live Tamu', desc: 'Pantau siapa saja yang sudah melihat dan mengkonfirmasi undangan.' },
]

const plans = [
  { name: 'Gratis', price: '0', features: ['1 tema dasar', 'Tanpa musik', 'RSVP terbatas', 'Link undangan'] },
  { name: 'Basic', price: '49k', features: ['Semua tema', 'Musik latar', 'RSVP penuh', 'QR Code', 'Custom domain'] },
  { name: 'Premium', price: '99k', features: ['Semua fitur Basic', 'Video latar', 'Live tamu', 'Amplop digital', 'Prioritas support'] },
]

function App() {
  return (
    <>
      <nav className="navbar">
        <div className="container nav-inner">
          <div className="logo">
            <span className="logo-icon">💌</span>
            <span className="logo-text">UndanganKu</span>
          </div>
          <div className="nav-links">
            <a href="#tema">Tema</a>
            <a href="#fitur">Fitur</a>
            <a href="#harga">Harga</a>
            <a href="#kontak">Kontak</a>
            <a href="#tema" className="btn btn-primary nav-cta">Buat Undangan</a>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <h1>Undangan Digital<br /><span className="highlight">Cepat & Elegan</span></h1>
            <p className="hero-desc">Buat undangan digital impian Anda dalam hitungan menit. Pilih tema favorit, kustomisasi sesuai selera, dan bagikan ke tamu undangan dengan mudah.</p>
            <div className="hero-actions">
              <a href="#tema" className="btn btn-primary">Lihat Tema ✨</a>
              <a href="#fitur" className="btn btn-outline">Pelajari Fitur</a>
            </div>
            <div className="hero-stats">
              <div><strong>12.000+</strong><span>Undangan Terbuat</span></div>
              <div><strong>4.9★</strong><span>Rating Pengguna</span></div>
              <div><strong>150+</strong><span>Tema Tersedia</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-inner">
                <div className="card-decoration">💐</div>
                <h3>Annisa & Ahmad</h3>
                <p>Pernikahan • 20 Des 2025</p>
                <div className="card-footer">Buka Undangan →</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tema" className="tema">
        <div className="container">
          <div className="section-header">
            <span className="section-label">✦ Pilih Tema</span>
            <h2 className="section-title">Berbagai Tema Pilihan</h2>
            <p className="section-desc">Dari pernikahan hingga tasyakuran, temukan tema yang sesuai dengan acara Anda.</p>
          </div>
          <div className="tema-grid">
            {themes.map((t, i) => (
              <div key={i} className="tema-card">
                <div className="tema-preview" style={{ background: t.colors }}>
                  <span className="tema-icon">{t.icon}</span>
                </div>
                <div className="tema-info">
                  <h3>{t.name}</h3>
                  <p>{t.desc}</p>
                  <button className="btn-tema">Lihat Detail →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="fitur" className="fitur">
        <div className="container">
          <div className="section-header">
            <span className="section-label">✦ Fitur Unggulan</span>
            <h2 className="section-title">Kenapa Memilih Kami?</h2>
            <p className="section-desc">Kemudahan membuat undangan digital dengan fitur lengkap dan tampilan profesional.</p>
          </div>
          <div className="fitur-grid">
            {features.map((f, i) => (
              <div key={i} className="fitur-card">
                <span className="fitur-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="harga" className="harga">
        <div className="container">
          <div className="section-header">
            <span className="section-label">✦ Pilihan Paket</span>
            <h2 className="section-title">Harga Terjangkau</h2>
            <p className="section-desc">Mulai dari gratis hingga premium, pilih paket yang sesuai kebutuhan Anda.</p>
          </div>
          <div className="harga-grid">
            {plans.map((p, i) => (
              <div key={i} className={`harga-card ${i === 1 ? 'populer' : ''}`}>
                {i === 1 && <span className="badge">Paling Populer</span>}
                <h3>{p.name}</h3>
                <div className="price">{p.price === '0' ? 'Gratis' : <><span className="rp">Rp</span> {p.price}</>}</div>
                <ul>
                  {p.features.map((f, j) => <li key={j}>✓ {f}</li>)}
                </ul>
                <button className={`btn ${i === 1 ? 'btn-primary' : 'btn-outline'}`}>Pilih Paket</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="kontak" className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon">💌</span>
              <span className="logo-text">UndanganKu</span>
            </div>
            <p>Platform undangan digital no.1 di Indonesia. Buat undangan impian Anda sekarang.</p>
            <div className="social">
              <a href="#">📷</a>
              <a href="#">📱</a>
              <a href="#">💬</a>
              <a href="#">📧</a>
            </div>
          </div>
          <div className="footer-links">
            <div>
              <h4>Produk</h4>
              <a href="#">Tema</a>
              <a href="#">Fitur</a>
              <a href="#">Harga</a>
              <a href="#">Template</a>
            </div>
            <div>
              <h4>Bantuan</h4>
              <a href="#">FAQ</a>
              <a href="#">Panduan</a>
              <a href="#">Hubungi Kami</a>
            </div>
            <div>
              <h4>Legal</h4>
              <a href="#">Kebijakan Privasi</a>
              <a href="#">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <p>© 2025 UndanganKu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
