/* Narración guiada CourtManager Pro — Web Speech API */
(function () {
  const SCRIPTS = {
    es: `Bienvenido a CourtManager Pro. Soy tu guía en esta presentación.

CourtManager Pro es la plataforma SaaS de gestión de utilería para clubes de baloncesto profesional: ACB, Euroliga y categorías elite. Centraliza en una sola aplicación web todo lo que hoy se hace con Excel y WhatsApp.

En la cabecera verás el acceso a la demo en vivo, las funciones, los precios y la sección para inversores. Puedes cambiar el idioma entre español e inglés en cualquier momento.

El dashboard es el centro de mando. Muestra el estado del club en tiempo real: jugadores registrados, stock de material, solicitudes pendientes y viajes en preparación. La demo incluye diecisiete jugadores y cuatro competiciones: Liga Endesa, Euroliga, Copa del Rey y Supercopa.

En la sección de demo en vivo puedes explorar la aplicación desplegada en Vercel sin instalar nada. El flujo cubre cuatro pasos: plantilla y fichas por competición, solicitudes y tallas, viajes y alertas, e informes para la dirección deportiva.

Los nueve módulos principales son: plantilla profesional, tabla de tallas con más de veintiséis productos, inventario con código QR, solicitudes de material, viajes y packing lists, lavandería, material médico con alertas de caducidad, dashboard de KPIs y alertas inteligentes de cumpleaños y stock.

La galería visual muestra el dashboard en producción, el inventario con QR, la logística de viajes Euroliga, la validación operativa por Carlos Rodriguez Kobe como equipment manager, y la operativa en pabellón.

Los precios son transparentes. Plan Starter desde cuarenta y nueve euros al mes para canteras. Plan Pro a trescientos cuarenta y nueve euros para clubes ACB. Plan Elite a mil novecientos noventa euros para Euroliga. Puedes elegir facturación mensual o anual con un diecisiete por ciento de ahorro.

Para inversores: el coste de reemplazo del MVP ronda los cuarenta y cinco mil euros, con un margen bruto del ochenta y cinco al noventa por ciento. El objetivo realista de ingresos recurrentes en el primer año es de ciento veintitrés mil euros. El mercado incluye más de treinta y seis clubes ACB y Euroliga en España.

El equipo está liderado por Ramón del Pozo Rott, creador y superadministrador, y Carlos Rodriguez Kobe, equipment manager que valida la operativa real del club.

CourtManager Pro recupera su coste en el primer mes: un club que pierde veinte mil euros en material al año invierte menos de cuatro mil doscientos en la plataforma.

Para probar la demo visita courtmanagerpro punto vercel punto app, o escribe a info arroba ramondelpozorott punto es. Gracias por tu atención.`,

    en: `Welcome to CourtManager Pro. I'll guide you through this presentation.

CourtManager Pro is a SaaS platform for professional basketball equipment management: ACB, EuroLeague and elite academies. It replaces Excel spreadsheets and WhatsApp threads with one unified web application.

In the header you'll find the live demo, features, pricing and investors section. You can switch between Spanish and English at any time.

The dashboard is your command center. It shows real-time club status: registered players, stock levels, pending requests and trips in preparation. The demo includes seventeen players across four competitions: Liga Endesa, EuroLeague, Copa del Rey and SuperCup.

In the live demo section you can explore the app deployed on Vercel with no installation. The workflow covers four steps: roster and competition profiles, requests and sizing, travel and alerts, and executive reports.

The nine core modules are: pro roster, sizing matrix with twenty-six plus products, QR inventory, material requests, travel and packing lists, laundry, medical supplies with expiry alerts, KPI dashboard and smart alerts for birthdays and low stock.

The visual gallery shows the production dashboard, QR inventory operations, EuroLeague travel logistics, validation by Carlos Rodriguez Kobe as equipment manager, and arena-ready operations.

Pricing is transparent. Starter plan from forty-nine euros per month for academies. Pro plan at three hundred forty-nine euros for ACB clubs. Elite plan at one thousand nine hundred ninety euros for EuroLeague. Choose monthly or annual billing with seventeen percent savings.

For investors: MVP replacement cost is around forty-five thousand euros, with eighty-five to ninety percent gross margin. Realistic year-one ARR target is one hundred twenty-three thousand euros. The addressable market includes thirty-six plus ACB and EuroLeague clubs in Spain.

The team is led by Ramón del Pozo Rott, founder and superadmin, and Carlos Rodriguez Kobe, equipment manager validating real club operations.

CourtManager Pro pays for itself in month one: a club losing twenty thousand euros in gear per year invests less than four thousand two hundred in the platform.

To try the demo visit courtmanagerpro dot vercel dot app, or email info at ramondelpozorott dot es. Thank you for listening.`,
  };

  const lang = document.documentElement.lang === 'en' ? 'en' : 'es';
  const labels = {
    es: { play: '▶ Escuchar presentación', pause: '⏸ Pausar', resume: '▶ Continuar', stop: '⏹ Detener', title: 'Narración guiada', hint: 'Voz sintética · ~4 min' },
    en: { play: '▶ Listen to pitch', pause: '⏸ Pause', resume: '▶ Resume', stop: '⏹ Stop', title: 'Guided narration', hint: 'Synthetic voice · ~4 min' },
  };
  const L = labels[lang];

  let utterance = null;
  let paused = false;

  function buildPanel() {
    const panel = document.createElement('div');
    panel.id = 'voice-panel';
    panel.innerHTML = `
      <div class="voice-inner">
        <div class="voice-head">
          <span class="voice-icon">🎙️</span>
          <div>
            <strong>${L.title}</strong>
            <small>${L.hint}</small>
          </div>
        </div>
        <div class="voice-controls">
          <button type="button" id="voice-play" class="voice-btn primary">${L.play}</button>
          <button type="button" id="voice-pause" class="voice-btn" disabled>${L.pause}</button>
          <button type="button" id="voice-stop" class="voice-btn" disabled>${L.stop}</button>
        </div>
        <div class="voice-progress"><div id="voice-bar"></div></div>
      </div>`;
    document.body.appendChild(panel);

    const style = document.createElement('style');
    style.textContent = `
      #voice-panel {
        position: fixed; bottom: 1.25rem; left: 1.25rem; z-index: 200;
        background: #0f172aee; backdrop-filter: blur(14px);
        border: 1px solid #f9731644; border-radius: 18px;
        padding: 1rem 1.15rem; max-width: 320px;
        box-shadow: 0 20px 60px #0008, 0 0 40px #f9731622;
      }
      .voice-head { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.85rem; }
      .voice-icon { font-size: 1.5rem; }
      .voice-head strong { display: block; font-size: 0.88rem; color: #f1f5f9; }
      .voice-head small { font-size: 0.72rem; color: #94a3b8; }
      .voice-controls { display: flex; gap: 0.45rem; flex-wrap: wrap; }
      .voice-btn {
        padding: 0.45rem 0.75rem; border-radius: 10px; border: 1px solid #334155;
        background: #1e293b; color: #e2e8f0; font-size: 0.75rem; font-weight: 700;
        cursor: pointer; transition: background 0.15s;
      }
      .voice-btn:hover:not(:disabled) { background: #334155; }
      .voice-btn:disabled { opacity: 0.35; cursor: default; }
      .voice-btn.primary { background: linear-gradient(135deg,#f97316,#ea580c); border-color: #f97316; color: #fff; }
      .voice-progress { margin-top: 0.65rem; height: 4px; background: #1e293b; border-radius: 999px; overflow: hidden; }
      #voice-bar { height: 100%; width: 0%; background: #f97316; transition: width 0.3s; border-radius: 999px; }
      @media (max-width: 600px) { #voice-panel { left: 0.75rem; right: 0.75rem; max-width: none; } }
    `;
    document.head.appendChild(style);

    const playBtn = document.getElementById('voice-play');
    const pauseBtn = document.getElementById('voice-pause');
    const stopBtn = document.getElementById('voice-stop');
    const bar = document.getElementById('voice-bar');

    function pickVoice() {
      const voices = speechSynthesis.getVoices();
      const prefer = lang === 'es'
        ? voices.find(v => v.lang.startsWith('es') && /female|paula|helena|laura|espa/i.test(v.name))
          || voices.find(v => v.lang.startsWith('es'))
        : voices.find(v => v.lang.startsWith('en') && /female|samantha|google us english/i.test(v.name))
          || voices.find(v => v.lang.startsWith('en'));
      return prefer || voices[0];
    }

    function resetUI() {
      playBtn.textContent = L.play;
      playBtn.disabled = false;
      pauseBtn.disabled = true;
      stopBtn.disabled = true;
      pauseBtn.textContent = L.pause;
      bar.style.width = '0%';
      paused = false;
    }

    function startSpeech() {
      speechSynthesis.cancel();
      utterance = new SpeechSynthesisUtterance(SCRIPTS[lang]);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;
      const voice = pickVoice();
      if (voice) utterance.voice = voice;

      let prog = 0;
      const tick = setInterval(() => {
        if (!speechSynthesis.speaking && !paused) { clearInterval(tick); return; }
        prog = Math.min(prog + 0.4, speechSynthesis.speaking ? 92 : 100);
        bar.style.width = prog + '%';
      }, 800);

      utterance.onend = () => { clearInterval(tick); bar.style.width = '100%'; setTimeout(resetUI, 600); };
      utterance.onerror = () => { clearInterval(tick); resetUI(); };

      speechSynthesis.speak(utterance);
      playBtn.disabled = true;
      pauseBtn.disabled = false;
      stopBtn.disabled = false;
    }

    playBtn.addEventListener('click', () => {
      if (paused) {
        speechSynthesis.resume();
        paused = false;
        playBtn.disabled = true;
        pauseBtn.disabled = false;
        pauseBtn.textContent = L.pause;
        return;
      }
      startSpeech();
    });

    pauseBtn.addEventListener('click', () => {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        paused = true;
        playBtn.disabled = false;
        playBtn.textContent = L.resume;
        pauseBtn.disabled = true;
      }
    });

    stopBtn.addEventListener('click', () => {
      speechSynthesis.cancel();
      resetUI();
    });

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => pickVoice();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildPanel);
  } else {
    buildPanel();
  }
})();
