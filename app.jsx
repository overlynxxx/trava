// App entry — orchestrates lang, tweaks, sections
const { useState: useStateA, useEffect: useEffectA } = React;

const TRAVA_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroStyle": "photo",
  "palette": "moss",
  "typography": "garamond"
}/*EDITMODE-END*/;

const PALETTES = {
  moss: {
    name: "Мох (по умолч.)",
    "--moss-700": "oklch(0.42 0.06 145)",
    "--moss-800": "oklch(0.32 0.05 145)",
    "--moss-900": "oklch(0.22 0.04 145)",
    "--moss-100": "oklch(0.94 0.018 120)",
    "--moss-200": "oklch(0.88 0.03 130)",
    "--terra-600": "oklch(0.58 0.13 45)",
    "--terra-700": "oklch(0.5 0.13 42)",
    "--paper": "oklch(0.97 0.012 85)",
    "--paper-2": "oklch(0.94 0.016 85)",
    "--cream": "oklch(0.93 0.022 85)",
    "--bark-900": "oklch(0.18 0.018 60)",
  },
  pine: {
    name: "Сосна (тёмный)",
    "--moss-700": "oklch(0.45 0.07 175)",
    "--moss-800": "oklch(0.32 0.06 175)",
    "--moss-900": "oklch(0.2 0.04 175)",
    "--moss-100": "oklch(0.93 0.02 175)",
    "--moss-200": "oklch(0.85 0.04 175)",
    "--terra-600": "oklch(0.62 0.13 60)",
    "--terra-700": "oklch(0.54 0.13 58)",
    "--paper": "oklch(0.96 0.014 90)",
    "--paper-2": "oklch(0.93 0.018 90)",
    "--cream": "oklch(0.91 0.024 90)",
    "--bark-900": "oklch(0.17 0.02 75)",
  },
  ochre: {
    name: "Охра (тёплая)",
    "--moss-700": "oklch(0.5 0.1 95)",
    "--moss-800": "oklch(0.38 0.08 95)",
    "--moss-900": "oklch(0.24 0.06 90)",
    "--moss-100": "oklch(0.95 0.025 95)",
    "--moss-200": "oklch(0.88 0.04 95)",
    "--terra-600": "oklch(0.55 0.14 35)",
    "--terra-700": "oklch(0.48 0.14 32)",
    "--paper": "oklch(0.97 0.018 85)",
    "--paper-2": "oklch(0.94 0.022 85)",
    "--cream": "oklch(0.92 0.028 85)",
    "--bark-900": "oklch(0.2 0.025 55)",
  },
  birch: {
    name: "Берёза (светлая)",
    "--moss-700": "oklch(0.45 0.05 160)",
    "--moss-800": "oklch(0.34 0.04 160)",
    "--moss-900": "oklch(0.22 0.03 160)",
    "--moss-100": "oklch(0.95 0.012 160)",
    "--moss-200": "oklch(0.88 0.02 160)",
    "--terra-600": "oklch(0.6 0.1 25)",
    "--terra-700": "oklch(0.52 0.1 22)",
    "--paper": "oklch(0.985 0.005 85)",
    "--paper-2": "oklch(0.96 0.008 85)",
    "--cream": "oklch(0.94 0.012 85)",
    "--bark-900": "oklch(0.16 0.012 60)",
  },
};

const TYPOGRAPHY = {
  garamond: {
    name: "Cormorant + Geist",
    "--font-display": '"Cormorant Garamond", "Times New Roman", serif',
    "--font-body": '"Geist", "Inter", system-ui, sans-serif',
  },
  fraunces: {
    name: "Fraunces + Manrope",
    "--font-display": '"Fraunces", Georgia, serif',
    "--font-body": '"Manrope", system-ui, sans-serif',
  },
  ibm: {
    name: "IBM Plex (всё)",
    "--font-display": '"IBM Plex Serif", Georgia, serif',
    "--font-body": '"IBM Plex Sans", system-ui, sans-serif',
  },
  bricolage: {
    name: "Bricolage + Geist",
    "--font-display": '"Bricolage Grotesque", system-ui, sans-serif',
    "--font-body": '"Geist", system-ui, sans-serif',
  },
};

function applyTweaks(t) {
  const root = document.documentElement;
  // Palette
  const pal = PALETTES[t.palette] || PALETTES.moss;
  Object.entries(pal).forEach(([k, v]) => {
    if (k.startsWith("--")) root.style.setProperty(k, v);
  });
  // Typography
  const ty = TYPOGRAPHY[t.typography] || TYPOGRAPHY.garamond;
  Object.entries(ty).forEach(([k, v]) => {
    if (k.startsWith("--")) root.style.setProperty(k, v);
  });
}

function App() {
  const [lang, setLang] = useStateA("ru");
  const [season, setSeason] = useStateA("summer");
  const T = STRINGS[lang];
  const [t, setTweak] = useTweaks(TRAVA_TWEAK_DEFAULTS);

  useEffectA(() => {
    applyTweaks(t);
  }, [t.palette, t.typography]);

  return (
    <>
      <Header lang={lang} setLang={setLang} season={season} setSeason={setSeason} T={T} />
      <Hero T={T} heroStyle={t.heroStyle} season={season} setSeason={setSeason} BookingWidget={BookingWidget} />
      <BookingBand BookingWidget={BookingWidget} />
      <FactsBand season={season} />
      <OverviewCards T={T} />
      <Cottages T={T} />
      <Banya T={T} season={season} />
      <Activities T={T} season={season} />
      <Events T={T} />
      <WinterSection T={T} />
      <Gallery T={T} season={season} />
      <Reviews T={T} />
      <FAQ T={T} />
      <Contacts T={T} />
      <Footer T={T} />

      <a href="#booking" className="btn btn-terra sticky-book">
        Забронировать
      </a>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Hero">
          <TweakRadio
            label="Стиль hero"
            value={t.heroStyle}
            options={[
              { value: "photo", label: "Фото" },
              { value: "gradient", label: "Градиент" },
              { value: "illustration", label: "Илл." },
            ]}
            onChange={(v) => setTweak("heroStyle", v)}
          />
        </TweakSection>
        <TweakSection title="Палитра">
          <TweakSelect
            label="Цветовая схема"
            value={t.palette}
            options={Object.entries(PALETTES).map(([k, v]) => ({ value: k, label: v.name }))}
            onChange={(v) => setTweak("palette", v)}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {Object.entries(PALETTES).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setTweak("palette", k)}
                title={v.name}
                style={{
                  width: 28, height: 28, borderRadius: "50%",
                  border: t.palette === k ? "2px solid var(--bark-900, #222)" : "1px solid #ddd",
                  background: `linear-gradient(135deg, ${v["--moss-700"]} 0%, ${v["--moss-700"]} 50%, ${v["--terra-600"]} 50%, ${v["--terra-600"]} 100%)`,
                  cursor: "pointer", padding: 0,
                }}
              />
            ))}
          </div>
        </TweakSection>
        <TweakSection title="Типографика">
          <TweakSelect
            label="Шрифтовая пара"
            value={t.typography}
            options={Object.entries(TYPOGRAPHY).map(([k, v]) => ({ value: k, label: v.name }))}
            onChange={(v) => setTweak("typography", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
