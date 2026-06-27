// Crianex Hub — Main app shell with viewport switcher + Vitrine/Admin toggle

const { useState: useStateApp, useEffect: useEffectApp } = React;

const Toolbar = ({ surface, setSurface, device, setDevice, page, setPage, lang, setLang }) => {
  return (
    <div className="toolbar">
      <div className="logo">
        <LogoMark size={22} />
        Crianex Hub
      </div>
      <span className="crumb">
        / {surface === 'vitrine' ? 'vitrine.crianex.com' : 'admin.crianex.com (interno)'}
      </span>

      <div style={{ flex: 1 }} />

      {/* Surface switch */}
      <div className="seg">
        <button
          className={surface === 'vitrine' ? 'on' : ''}
          onClick={() => {
            setSurface('vitrine');
            setPage({ name: 'home' });
          }}
        >
          <Icon name="layers" size={12} /> Vitrine
        </button>
        <button className={surface === 'admin' ? 'on' : ''} onClick={() => setSurface('admin')}>
          <Icon name="lock" size={12} /> Admin
        </button>
      </div>

      {/* Device switch */}
      <div className="seg">
        <button
          className={device === 'desktop' ? 'on' : ''}
          onClick={() => setDevice('desktop')}
          title="Desktop · 1280"
        >
          <Icon name="desktop" size={12} />
        </button>
        <button
          className={device === 'tablet' ? 'on' : ''}
          onClick={() => setDevice('tablet')}
          title="Tablet · 820"
        >
          <Icon name="tablet" size={12} />
        </button>
        <button
          className={device === 'mobile' ? 'on' : ''}
          onClick={() => setDevice('mobile')}
          title="Mobile · 390"
        >
          <Icon name="mobile" size={12} />
        </button>
      </div>

      {/* Language */}
      {surface === 'vitrine' && (
        <div className="seg" style={{ fontFamily: 'var(--font-mono)' }}>
          <button
            className={lang === 'pt' ? 'on' : ''}
            onClick={() => setLang('pt')}
            style={{ letterSpacing: '0.06em' }}
          >
            PT 🇧🇷
          </button>
          <button
            className={lang === 'en' ? 'on' : ''}
            onClick={() => setLang('en')}
            style={{ letterSpacing: '0.06em' }}
          >
            EN 🇺🇸
          </button>
        </div>
      )}

      <span className="pill">● {surface === 'vitrine' ? 'PUBLIC' : 'PRIVATE'}</span>
    </div>
  );
};

const VitrineApp = ({ lang, setLang }) => {
  const [page, setPage] = useStateApp({ name: 'home' });

  // scroll to top on page change
  useEffectApp(() => {
    const sc = document.querySelector('.viewport-inner');
    if (sc) sc.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <>
      <SiteHeader page={page} setPage={setPage} lang={lang} setLang={setLang} />
      <main>
        {page.name === 'home' && <HomePage lang={lang} setPage={setPage} />}
        {page.name === 'product' && (
          <ProductPage lang={lang} productId={page.id} setPage={setPage} />
        )}
        {page.name === 'about' && <AboutPage lang={lang} />}
        {page.name === 'contact' && <ContactPage lang={lang} />}
        {page.name === 'faq' && <FaqPage lang={lang} setPage={setPage} />}
      </main>
      <SiteFooter lang={lang} setPage={setPage} />
    </>
  );
};

const App = () => {
  const [surface, setSurface] = useStateApp('vitrine');
  const [device, setDevice] = useStateApp('desktop');
  const [page, setPage] = useStateApp({ name: 'home' });
  const [lang, setLang] = useStateApp('pt');

  return (
    <>
      <Toolbar
        surface={surface}
        setSurface={setSurface}
        device={device}
        setDevice={setDevice}
        page={page}
        setPage={setPage}
        lang={lang}
        setLang={setLang}
      />
      <div className="stage">
        <div className={`viewport ${device}`}>
          {(device === 'mobile' || device === 'tablet') && <div className="notch" />}
          <div className="viewport-inner" key={`${surface}-${device}`}>
            {surface === 'vitrine' ? <VitrineApp lang={lang} setLang={setLang} /> : <AdminApp />}
          </div>
        </div>
      </div>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
