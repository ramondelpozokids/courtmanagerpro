/* Narración guiada CourtManager Pro — MP3 (ES/EN) + TTS de respaldo */
(function () {
  const lang = (document.documentElement.lang || 'es').toLowerCase() === 'en' ? 'en' : 'es';

  const AUDIO_SRC = { es: 'audio/es.mp3', en: 'audio/en.mp3' };
  const preferMp3 = document.documentElement.dataset.audio === 'mp3';
  const useAudio = preferMp3 && Object.prototype.hasOwnProperty.call(AUDIO_SRC, lang);

  const SCRIPTS = {
    es: `CourtManager Pro organiza la ropa y el material del club.

Hoy, en muchos vestuarios, todo se lleva con Excel y WhatsApp. Se pierde material en los viajes, se compra de más, y el día del partido faltan tallas.

CourtManager Pro lo concentra en un solo sitio, en el móvil o en el ordenador: plantilla y tallas, inventario, almacén general con precios y stock, peticiones de material, viajes, lavandería, botiquín con avisos de caducidad, y la lista de comprobación antes del partido.

En el almacén general ves cuánto hay, dónde está y cuánto vale en euros. Así compras con datos, no a ojo. Queda registro de quién sacó o entró cada cosa.

Sirve para fútbol y baloncesto de élite. El plan profesional cuesta desde trescientos cuarenta y nueve euros al mes. Puedes probarlo unas semanas. Si no encaja, lo dejas: sin quedarte atado. Si quieres, adaptamos colores y logo del club con un presupuesto claro.

Soy Ramón del Pozo Rott, creador del proyecto. Contacto: info arroba ramondelpozorott punto es. Gracias por escuchar.`,

    en: `CourtManager Pro organizes club kits and equipment.

Today, many dressing rooms still run on spreadsheets and WhatsApp. Gear gets lost on trips, clubs overbuy, and on match day the right sizes are missing.

CourtManager Pro brings everything into one place, on phone or computer: roster and sizing, inventory, a general warehouse with prices and stock, material requests, travel packing lists, laundry, medical kit with expiry alerts, and a pre-match checklist.

In the general warehouse you see how much you have, where it is, and what it is worth in euros. You buy with facts, not guesswork. Every move is logged.

It works for elite football and basketball. The professional plan starts at three hundred forty-nine euros a month. You can try it for a few weeks. If it does not fit, you leave — no long lock-in. Club colours and logo can be adapted with a clear setup budget.

I am Ramón del Pozo Rott, founder of the project. Contact: info at ramondelpozorott dot es. Thank you for listening.`,
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
    en: {
      play: '▶ Listen to pitch',
      pause: '⏸ Pause',
      resume: '▶ Resume',
      stop: '⏹ Stop',
      title: 'CourtManager Pro narration',
      hint: 'MP3 voice · CourtManager Pro',
    },
  };
  const L = labels[lang] || labels.es;
  const scriptText = SCRIPTS[lang] || SCRIPTS.es;

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
    const prefix = lang === 'en' ? 'en' : 'es';
    return (
      voices.find((v) => v.lang && v.lang.startsWith(prefix) && /female|helena|elvira|jenny|aria|google/i.test(v.name))
      || voices.find((v) => v.lang && v.lang.startsWith(prefix))
      || voices[0]
      || null
    );
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
    } else {
      utterance.lang = lang === 'en' ? 'en-US' : 'es-ES';
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
