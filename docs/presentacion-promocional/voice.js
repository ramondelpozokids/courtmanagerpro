/* Narración guiada CourtManager Pro — TTS (ES/CA/EN) + MP3 opcional */
(function () {
  const lang = (document.documentElement.lang || 'es').toLowerCase();
  const variant = (document.documentElement.dataset.variant || '').toLowerCase();
  const scriptKey = variant === 'fcb' && lang === 'ca' ? 'fcb' : lang;

  const AUDIO_SRC = { es: 'audio/es.mp3', ca: 'audio/ca.mp3' };
  const preferMp3 = document.documentElement.dataset.audio === 'mp3';
  const useAudio = preferMp3 && Object.prototype.hasOwnProperty.call(AUDIO_SRC, lang);

  const SCRIPTS = {
    es: `Bienvenido a CourtManager Pro. Te guío por esta presentación.

CourtManager Pro es una plataforma SaaS para la gestión profesional de utilería en baloncesto: ACB, Euroliga y academias de élite. Sustituye Excel y WhatsApp por una sola aplicación web accesible desde móvil.

En la cabecera encontrarás la demo en vivo, módulos, precios e inversores. Puedes cambiar entre español, catalán e inglés en cualquier momento.

El dashboard es tu centro de mando: jugadores registrados, stock, solicitudes pendientes y viajes en preparación. La demo incluye diecisiete jugadores y cuatro competiciones: Liga Endesa, Euroliga, Copa del Rey y Supercopa.

En la demo en vivo puedes explorar la app desplegada en Vercel sin instalar nada. El flujo cubre plantilla y tallas, solicitudes, viajes y alertas, e informes ejecutivos.

Los nueve módulos principales son: plantilla profesional, matriz de tallas con más de veintiséis productos, inventario con código QR, solicitudes de material, viajes y packing lists, lavandería, material médico con alertas de caducidad, dashboard de KPIs y alertas inteligentes.

Los precios son transparentes: plan Starter desde cuarenta y nueve euros al mes para canteras. Plan Pro a trescientos cuarenta y nueve euros para clubes ACB. Plan Elite a mil novecientos noventa euros para Euroliga. Facturación mensual o anual con diecisiete por ciento de ahorro.

Para inversores: coste de reemplazo del MVP unos cuarenta y cinco mil euros, margen bruto del ochenta y cinco al noventa por ciento. Objetivo realista de ingresos recurrentes en el primer año: más de ciento veinte mil euros. Mercado: más de treinta y seis clubes ACB y Euroliga en España.

El equipo lo lideran Ramón del Pozo Rott, fundador y superadmin, y Carlos Rodriguez Kobe, jefe de utilería que valida la operativa real del club.

Un club que pierde veinte mil euros al año en material invierte menos de cuatro mil doscientos en la plataforma. CourtManager Pro se amortiza desde el primer mes.

Prueba la demo en courtmanagerpro punto vercel punto app, o escribe a info arroba ramondelpozorott punto es. Gracias por escuchar.`,

    ca: `Benvingut a CourtManager Pro. Et guio per aquesta presentació.

CourtManager Pro és una plataforma SaaS per a la gestió professional de material esportiu en bàsquet: ACB, Eurolliga i acadèmies d'elit. Substitueix l'Excel i el WhatsApp per una sola aplicació web accessible des del mòbil.

A la capçalera trobaràs la demo en directe, mòduls, preus i inversors. Pots canviar entre català, castellà i anglès en qualsevol moment.

El dashboard és el teu centre de comandament: jugadors registrats, estoc, sol·licituds pendents i viatges en preparació. La demo inclou disset jugadors i quatre competicions: Liga Endesa, Eurolliga, Copa del Rei i Supercopa.

A la demo en directe pots explorar l'app desplegada a Vercel sense instal·lar res. El flux cobreix plantilla i talles, sol·licituds, viatges i alertes, i informes executius.

Els nou mòduls principals són: plantilla professional, matriu de talles amb més de vint-i-sis productes, inventari amb codi QR, sol·licituds de material, viatges i packing lists, bugaderia, material mèdic amb alertes de caducitat, dashboard de KPIs i alertes intel·ligents.

Els preus són transparents: pla Starter des de quaranta-nou euros al mes per a canteres. Pla Pro a tres-cents quaranta-nou euros per a clubs ACB. Pla Elite a mil nou-cents noranta euros per a Eurolliga. Facturació mensual o anual amb disset per cent d'estalvi.

Per a inversors: cost de reemplaçament del MVP uns quaranta-cinc mil euros, marge brut del vuitanta-cinc al noranta per cent. Objectiu realista d'ingressos recurrents el primer any: més de cent vint mil euros. Mercat: més de trenta-sis clubs ACB i Eurolliga a Espanya.

L'equip el lideren Ramón del Pozo Rott, fundador i superadmin, i Carlos Rodriguez Kobe, cap d'utileria que valida l'operativa real del club.

Un club que perd vint mil euros l'any en material inverteix menys de quatre mil dos-cents en la plataforma. CourtManager Pro s'amortitza des del primer mes.

Prova la demo a courtmanagerpro punt vercel punt app, o escriu a info arroba ramondelpozorott punt es. Gràcies per escoltar.`,

    fcb: `Benvingut al FC Barcelona. Aquesta és la proposta de CourtManager Pro per al departament esportiu i utileria del Barça.

CourtManager Pro centralitza plantilla, talles, inventari amb codi QR, sol·licituds, viatges de Liga Endesa i Eurolliga, bugaderia i material mèdic en una sola aplicació web, accessible des del mòbil al pavelló Olímpic o a qualsevol desplaçament.

La plataforma està pensada per a clubs d'elit com el Barça: múltiples competicions, plantilla amplia, staff tècnic i alertes en temps real abans de cada partit.

El dashboard mostra jugadors, estoc, sol·licituds pendents i viatges. La demo inclou disset jugadors i quatre competicions, amb flux validat per un cap d'utileria de club ACB.

Els mòduls clau per al Barça: matriu de talles amb més de vint-i-sis productes per jugador, inventari QR al vestidor i magatzem, packing lists per desplaçaments europeus, alertes de caducitat mèdica i informes CSV per a direcció esportiva.

El pla recomanat per a un club de primer nivell com el FC Barcelona és Elite, amb onboarding personalitzat, colors del club i suport prioritari.

Un club que perd vint mil euros l'any en material recupera la inversió des del primer mes. CourtManager Pro redueix errors de talla, pèrdues en aeroports i hores de gestió manual.

Sol·liciteu una demo de trenta minuts sense compromís. Contacte: info arroba ramondelpozorott punt es. Demo en directe: courtmanagerpro punt vercel punt app. Gràcies i visca el Barça.`,

    en: `Welcome to CourtManager Pro. I'll guide you through this presentation.

CourtManager Pro is a SaaS platform for professional basketball equipment management: ACB, EuroLeague and elite academies. It replaces Excel spreadsheets and WhatsApp threads with one unified web application.

In the header you'll find the live demo, features, pricing and investors section. You can switch between Spanish, Catalan and English at any time.

The dashboard is your command center. It shows real-time club status: registered players, stock levels, pending requests and trips in preparation. The demo includes seventeen players across four competitions: Liga Endesa, EuroLeague, Copa del Rey and SuperCup.

In the live demo section you can explore the app deployed on Vercel with no installation. The workflow covers roster and sizing, requests, travel and alerts, and executive reports.

The nine core modules are: pro roster, sizing matrix with twenty-six plus products, QR inventory, material requests, travel and packing lists, laundry, medical supplies with expiry alerts, KPI dashboard and smart alerts.

Pricing is transparent. Starter plan from forty-nine euros per month for academies. Pro plan at three hundred forty-nine euros for ACB clubs. Elite plan at one thousand nine hundred ninety euros for EuroLeague. Choose monthly or annual billing with seventeen percent savings.

For investors: MVP replacement cost is around forty-five thousand euros, with eighty-five to ninety percent gross margin. Realistic year-one ARR target is over one hundred twenty thousand euros. The addressable market includes thirty-six plus ACB and EuroLeague clubs in Spain.

The team is led by Ramón del Pozo Rott, founder and superadmin, and Carlos Rodriguez Kobe, equipment manager validating real club operations.

CourtManager Pro pays for itself in month one: a club losing twenty thousand euros in gear per year invests less than four thousand two hundred in the platform.

To try the demo visit courtmanagerpro dot vercel dot app, or email info at ramondelpozorott dot es. Thank you for listening.`,
  };

  const labels = {
    es: {
      play: '▶ Escuchar presentación',
      pause: '⏸ Pausar',
      resume: '▶ Continuar',
      stop: '⏹ Detener',
      title: 'Narración CourtManager Pro',
      hint: 'Voz MP3 · CourtManager Pro',
    },
    ca: {
      play: '▶ Escoltar presentació',
      pause: '⏸ Pausar',
      resume: '▶ Continuar',
      stop: '⏹ Aturar',
      title: 'Narració CourtManager Pro',
      hint: 'Àudio MP3 · CourtManager Pro',
    },
    fcb: {
      play: '▶ Escoltar proposta Barça',
      pause: '⏸ Pausar',
      resume: '▶ Continuar',
      stop: '⏹ Aturar',
      title: 'Narració FC Barcelona',
      hint: 'Català · CourtManager Pro',
    },
    en: {
      play: '▶ Listen to pitch',
      pause: '⏸ Pause',
      resume: '▶ Resume',
      stop: '⏹ Stop',
      title: 'CourtManager Pro narration',
      hint: 'Synthetic voice · ~4 min',
    },
  };
  const L = labels[scriptKey] || labels[lang] || labels.es;
  const scriptText = SCRIPTS[scriptKey] || SCRIPTS[lang] || SCRIPTS.es;

  let audio = null;
  let utterance = null;
  let paused = false;
  let playBtn;
  let pauseBtn;
  let stopBtn;
  let bar;

  function buildPanel() {
    const panel = document.createElement('div');
    panel.id = 'voice-panel';
    panel.innerHTML = `
      <div class="voice-inner">
        <div class="voice-head">
          <span class="voice-icon">🎙️</span>
          <div>
            <strong>${L.title}</strong>
            <small>${useAudio ? L.hint.replace('sintética', 'MP3').replace('sintètica', 'MP3') : L.hint}</small>
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
      #voice-bar { height: 100%; width: 0%; background: #f97316; transition: width 0.15s linear; border-radius: 999px; }
      @media (max-width: 600px) { #voice-panel { left: 0.75rem; right: 0.75rem; max-width: none; } }
    `;
    document.head.appendChild(style);

    playBtn = document.getElementById('voice-play');
    pauseBtn = document.getElementById('voice-pause');
    stopBtn = document.getElementById('voice-stop');
    bar = document.getElementById('voice-bar');

    playBtn.addEventListener('click', onPlayClick);
    pauseBtn.addEventListener('click', onPauseClick);
    stopBtn.addEventListener('click', stopNarration);

    if (window.speechSynthesis) {
      speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
    }
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

  function updateProgressFromAudio() {
    if (!audio || !audio.duration) return;
    bar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
  }

  function onNarrationEnd() {
    bar.style.width = '100%';
    setTimeout(resetUI, 600);
  }

  function stopNarration() {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio = null;
    }
    if (window.speechSynthesis) speechSynthesis.cancel();
    utterance = null;
    resetUI();
  }

  function startAudio() {
    stopNarration();
    audio = new Audio(AUDIO_SRC[lang]);
    audio.addEventListener('timeupdate', updateProgressFromAudio);
    audio.addEventListener('ended', onNarrationEnd);
    audio.addEventListener('error', () => {
      resetUI();
      startSpeech();
    });
    audio.play().then(() => {
      playBtn.disabled = true;
      pauseBtn.disabled = false;
      stopBtn.disabled = false;
    }).catch(() => startSpeech());
  }

  function pickVoice() {
    const voices = speechSynthesis.getVoices();
    const prefix = scriptKey === 'fcb' || lang === 'ca' ? 'ca' : lang === 'en' ? 'en' : 'es';
    const preferred =
      voices.find((v) => v.lang.startsWith(prefix) && /female|helena|joana|elvira|montserrat|google/i.test(v.name))
      || voices.find((v) => v.lang.startsWith(prefix))
      || voices[0];
    return preferred;
  }

  function startSpeech() {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    utterance = new SpeechSynthesisUtterance(scriptText);
    utterance.rate = 0.93;
    utterance.pitch = 1;
    utterance.volume = 1;
    const voice = pickVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    let prog = 0;
    const tick = setInterval(() => {
      if (!speechSynthesis.speaking && !paused) {
        clearInterval(tick);
        return;
      }
      prog = Math.min(prog + 0.35, speechSynthesis.speaking ? 92 : 100);
      bar.style.width = `${prog}%`;
    }, 800);

    utterance.onend = () => {
      clearInterval(tick);
      onNarrationEnd();
    };
    utterance.onerror = () => {
      clearInterval(tick);
      resetUI();
    };

    speechSynthesis.speak(utterance);
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;
  }

  function onPlayClick() {
    if (useAudio) {
      if (paused && audio) {
        audio.play();
        paused = false;
        playBtn.disabled = true;
        pauseBtn.disabled = false;
        return;
      }
      startAudio();
      return;
    }
    if (paused) {
      speechSynthesis.resume();
      paused = false;
      playBtn.disabled = true;
      pauseBtn.disabled = false;
      return;
    }
    startSpeech();
  }

  function onPauseClick() {
    if (useAudio && audio && !audio.paused) {
      audio.pause();
      paused = true;
      playBtn.disabled = false;
      playBtn.textContent = L.resume;
      pauseBtn.disabled = true;
      return;
    }
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      paused = true;
      playBtn.disabled = false;
      playBtn.textContent = L.resume;
      pauseBtn.disabled = true;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildPanel);
  } else {
    buildPanel();
  }
})();
