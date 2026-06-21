/* Narración guiada CourtManager Pro — MP3 (ES/CA) + Web Speech (EN) */
(function () {
  const lang = (document.documentElement.lang || 'es').toLowerCase();
  const AUDIO_SRC = { es: 'audio/es.mp3', ca: 'audio/ca.mp3' };
  const useAudio = Object.prototype.hasOwnProperty.call(AUDIO_SRC, lang);

  const SCRIPTS = {
    en: `Welcome to CourtManager Pro. I'll guide you through this presentation.

CourtManager Pro is a SaaS platform for professional basketball equipment management: ACB, EuroLeague and elite academies. It replaces Excel spreadsheets and WhatsApp threads with one unified web application.

In the header you'll find the live demo, features, pricing and investors section. You can switch between Spanish, Catalan and English at any time.

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

  const labels = {
    es: {
      play: '▶ Escuchar presentación',
      pause: '⏸ Pausar',
      resume: '▶ Continuar',
      stop: '⏹ Detener',
      title: 'Narración guiada',
      hint: 'Voz profesional · audio MP3',
    },
    ca: {
      play: '▶ Escoltar presentació',
      pause: '⏸ Pausar',
      resume: '▶ Continuar',
      stop: '⏹ Aturar',
      title: 'Narració guiada',
      hint: 'Veu professional · àudio MP3',
    },
    en: {
      play: '▶ Listen to pitch',
      pause: '⏸ Pause',
      resume: '▶ Resume',
      stop: '⏹ Stop',
      title: 'Guided narration',
      hint: 'Synthetic voice · ~4 min',
    },
  };
  const L = labels[lang] || labels.es;

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

    if (!useAudio && window.speechSynthesis) {
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
    audio.addEventListener('error', resetUI);
    audio.play().then(() => {
      playBtn.disabled = true;
      pauseBtn.disabled = false;
      stopBtn.disabled = false;
    }).catch(resetUI);
  }

  function pickEnglishVoice() {
    const voices = speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang.startsWith('en') && /female|samantha|google us english/i.test(v.name))
      || voices.find((v) => v.lang.startsWith('en'))
      || voices[0]
    );
  }

  function startSpeech() {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    utterance = new SpeechSynthesisUtterance(SCRIPTS.en);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    const voice = pickEnglishVoice();
    if (voice) utterance.voice = voice;

    let prog = 0;
    const tick = setInterval(() => {
      if (!speechSynthesis.speaking && !paused) {
        clearInterval(tick);
        return;
      }
      prog = Math.min(prog + 0.4, speechSynthesis.speaking ? 92 : 100);
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
