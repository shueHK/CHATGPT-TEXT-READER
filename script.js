let voices = [];
let utterance = null;
let isPaused = false;

let originalSentences = [];
let activeQueue = [];
let hiddenIndexSet = new Set();

let currentLang = "zh-CN";


/* =====================================================
   UI 语言（17 种）
   ===================================================== */

const i18n = {

  "zh-CN": {
    name:"中文（简体）",
    title:"📖 自由听书",
    subtitle:"粘贴任何文字 · 免费朗读 · 无限文章",
    placeholder:"在这里粘贴任何你想听的文字…",
    play:"▶ 播放",
    pause:"⏸ 暂停",
    stop:"⏹ 停止",
    resume:"▶ 继续",
    edit:"✏️ 编辑文章",
    reset:"🔄 重置",
    languageLabel:"语言:",
    voiceLabel:"读音:",
    speedLabel:"速度:"
  },

  "zh-TW": {
    name:"中文（繁體）",
    title:"📖 自由聽書",
    subtitle:"貼上任何文字 · 免費朗讀 · 無限文章",
    placeholder:"在這裡貼上你想聽的文字…",
    play:"▶ 播放",
    pause:"⏸ 暫停",
    stop:"⏹ 停止",
    resume:"▶ 繼續",
    edit:"✏️ 編輯文章",
    reset:"🔄 重置",
    languageLabel:"語言:",
    voiceLabel:"讀音:",
    speedLabel:"速度:"
  },

  "ms-MY": {
    name:"Bahasa Melayu",
    title:"📖 Bacaan Bebas",
    subtitle:"Tampal teks · Bacaan percuma · Tanpa had",
    placeholder:"Tampal teks di sini…",
    play:"▶ Main",
    pause:"⏸ Jeda",
    stop:"⏹ Henti",
    resume:"▶ Sambung",
    edit:"✏️ Sunting",
    reset:"🔄 Tetap semula",
    languageLabel:"Bahasa:",
    voiceLabel:"Suara:",
    speedLabel:"Kelajuan:"
  },

  "ar": {
    name:"العربية",
    title:"📖 الاستماع الحر",
    subtitle:"الصق أي نص · قراءة مجانية · بلا حدود",
    placeholder:"الصق النص هنا…",
    play:"▶ تشغيل",
    pause:"⏸ إيقاف مؤقت",
    stop:"⏹ إيقاف",
    resume:"▶ متابعة",
    edit:"✏️ تحرير",
    reset:"🔄 إعادة تعيين",
    languageLabel:"اللغة:",
    voiceLabel:"الصوت:",
    speedLabel:"السرعة:"
  },

  "en": {
    name:"English",
    title:"📖 Free Listening",
    subtitle:"Paste any text · Free reading · Unlimited",
    placeholder:"Paste any text you want to listen to…",
    play:"▶ Play",
    pause:"⏸ Pause",
    stop:"⏹ Stop",
    resume:"▶ Resume",
    edit:"✏️ Edit Text",
    reset:"🔄 Reset",
    languageLabel:"Language:",
    voiceLabel:"Voice:",
    speedLabel:"Speed:"
  },

  "hi": {
    name:"हिन्दी",
    title:"📖 मुक्त श्रवण",
    subtitle:"कोई भी पाठ चिपकाएँ · निःशुल्क · असीमित",
    placeholder:"यहाँ पाठ चिपकाएँ…",
    play:"▶ चलाएँ",
    pause:"⏸ विराम",
    stop:"⏹ रोकें",
    resume:"▶ जारी रखें",
    edit:"✏️ संपादित करें",
    reset:"🔄 रीसेट",
    languageLabel:"भाषा:",
    voiceLabel:"आवाज़:",
    speedLabel:"गति:"
  },

  "ko": {
    name:"한국어",
    title:"📖 자유 낭독",
    subtitle:"텍스트 붙여넣기 · 무료 · 무제한",
    placeholder:"여기에 텍스트를 붙여넣으세요…",
    play:"▶ 재생",
    pause:"⏸ 일시정지",
    stop:"⏹ 정지",
    resume:"▶ 계속",
    edit:"✏️ 편집",
    reset:"🔄 초기화",
    languageLabel:"언어:",
    voiceLabel:"음성:",
    speedLabel:"속도:"
  },

  "ja": {
    name:"日本語",
    title:"📖 自由朗読",
    subtitle:"テキスト貼り付け · 無料 · 無制限",
    placeholder:"ここに貼り付けてください…",
    play:"▶ 再生",
    pause:"⏸ 一時停止",
    stop:"⏹ 停止",
    resume:"▶ 続ける",
    edit:"✏️ 編集",
    reset:"🔄 リセット",
    languageLabel:"言語:",
    voiceLabel:"音声:",
    speedLabel:"速度:"
  },

  "th": {
    name:"ภาษาไทย",
    title:"📖 การอ่านอิสระ",
    subtitle:"วางข้อความ · ฟรี · ไม่จำกัด",
    placeholder:"วางข้อความที่นี่…",
    play:"▶ เล่น",
    pause:"⏸ หยุดชั่วคราว",
    stop:"⏹ หยุด",
    resume:"▶ ต่อ",
    edit:"✏️ แก้ไข",
    reset:"🔄 รีเซ็ต",
    languageLabel:"ภาษา:",
    voiceLabel:"เสียง:",
    speedLabel:"ความเร็ว:"
  },

  "es": {
    name:"Español",
    title:"📖 Lectura Libre",
    subtitle:"Pega texto · Gratis · Ilimitado",
    placeholder:"Pega texto aquí…",
    play:"▶ Reproducir",
    pause:"⏸ Pausa",
    stop:"⏹ Detener",
    resume:"▶ Continuar",
    edit:"✏️ Editar",
    reset:"🔄 Reiniciar",
    languageLabel:"Idioma:",
    voiceLabel:"Voz:",
    speedLabel:"Velocidad:"
  },

  "fr": {
    name:"Français",
    title:"📖 Lecture Libre",
    subtitle:"Collez du texte · Gratuit · Illimité",
    placeholder:"Collez le texte ici…",
    play:"▶ Lire",
    pause:"⏸ Pause",
    stop:"⏹ Arrêter",
    resume:"▶ Continuer",
    edit:"✏️ Éditer",
    reset:"🔄 Réinitialiser",
    languageLabel:"Langue:",
    voiceLabel:"Voix:",
    speedLabel:"Vitesse:"
  },

  "de": {
    name:"Deutsch",
    title:"📖 Freies Lesen",
    subtitle:"Text einfügen · Kostenlos · Unbegrenzt",
    placeholder:"Text hier einfügen…",
    play:"▶ Abspielen",
    pause:"⏸ Pause",
    stop:"⏹ Stop",
    resume:"▶ Fortsetzen",
    edit:"✏️ Bearbeiten",
    reset:"🔄 Zurücksetzen",
    languageLabel:"Sprache:",
    voiceLabel:"Stimme:",
    speedLabel:"Geschwindigkeit:"
  },

  "it": {
    name:"Italiano",
    title:"📖 Lettura Libera",
    subtitle:"Incolla testo · Gratis · Illimitato",
    placeholder:"Incolla testo qui…",
    play:"▶ Riproduci",
    pause:"⏸ Pausa",
    stop:"⏹ Stop",
    resume:"▶ Continua",
    edit:"✏️ Modifica",
    reset:"🔄 Reimposta",
    languageLabel:"Lingua:",
    voiceLabel:"Voce:",
    speedLabel:"Velocità:"
  },

  "pt": {
    name:"Português",
    title:"📖 Leitura Livre",
    subtitle:"Cole texto · Grátis · Ilimitado",
    placeholder:"Cole texto aqui…",
    play:"▶ Reproduzir",
    pause:"⏸ Pausar",
    stop:"⏹ Parar",
    resume:"▶ Continuar",
    edit:"✏️ Editar",
    reset:"🔄 Redefinir",
    languageLabel:"Idioma:",
    voiceLabel:"Voz:",
    speedLabel:"Velocidade:"
  },

  "ru": {
    name:"Русский",
    title:"📖 Свободное чтение",
    subtitle:"Вставьте текст · Бесплатно · Без ограничений",
    placeholder:"Вставьте текст здесь…",
    play:"▶ Воспроизвести",
    pause:"⏸ Пауза",
    stop:"⏹ Стоп",
    resume:"▶ Продолжить",
    edit:"✏️ Редактировать",
    reset:"🔄 Сброс",
    languageLabel:"Язык:",
    voiceLabel:"Голос:",
    speedLabel:"Скорость:"
  },

  "nl": {
    name:"Nederlands",
    title:"📖 Vrij Lezen",
    subtitle:"Plak tekst · Gratis · Onbeperkt",
    placeholder:"Plak tekst hier…",
    play:"▶ Afspelen",
    pause:"⏸ Pauze",
    stop:"⏹ Stop",
    resume:"▶ Hervatten",
    edit:"✏️ Bewerken",
    reset:"🔄 Reset",
    languageLabel:"Taal:",
    voiceLabel:"Stem:",
    speedLabel:"Snelheid:"
  },

  "vi": {
    name:"Tiếng Việt",
    title:"📖 Nghe Tự Do",
    subtitle:"Dán văn bản · Miễn phí · Không giới hạn",
    placeholder:"Dán văn bản tại đây…",
    play:"▶ Phát",
    pause:"⏸ Tạm dừng",
    stop:"⏹ Dừng",
    resume:"▶ Tiếp tục",
    edit:"✏️ Chỉnh sửa",
    reset:"🔄 Đặt lại",
    languageLabel:"Ngôn ngữ:",
    voiceLabel:"Giọng đọc:",
    speedLabel:"Tốc độ:"
  }
};


/* =====================================================
   浏览器语言
   ===================================================== */

function detectBrowserLangOnce(){

  if(localStorage.getItem("uiLangLocked")){
    return;
  }

  const nav = navigator.language;

  const match =
    Object.keys(i18n).find(
      k =>
        nav === k ||
        nav.startsWith(k.split("-")[0])
    );

  currentLang = match || "zh-CN";

  localStorage.setItem(
    "uiLangLocked",
    "1"
  );
}


/* =====================================================
   初始化 UI
   ===================================================== */

function initUI(){

  detectBrowserLangOnce();


  /* ========= 恢复上次 UI 语言 ========= */

  const savedLang =
    localStorage.getItem("userLang");

  if(savedLang && i18n[savedLang]){

    currentLang = savedLang;

  }


  /* ========= 创建语言列表 ========= */

  langSelect.innerHTML = "";


  Object.keys(i18n).forEach(k => {

    const o =
      document.createElement("option");

    o.value = k;

    o.textContent =
      i18n[k].name;

    if(k === currentLang){

      o.selected = true;

    }

    langSelect.appendChild(o);

  });


  /* =================================================
     语言改变
     ================================================= */

  langSelect.onchange = () => {

    currentLang =
      langSelect.value;

    localStorage.setItem(
      "userLang",
      currentLang
    );

    updateLanguage();

  };


  /* =================================================
     语音改变
     ================================================= */

  voice.onchange = () => {

    const selectedVoice =
      voices[voice.value];

    if(!selectedVoice){
      return;
    }


    const voiceKey =
      getVoiceKey(
        selectedVoice
      );


    /*
      只保存最后选择的声音
    */

    localStorage.setItem(
      "savedVoiceKey",
      voiceKey
    );


    /*
      重新排列：

      上次选择的声音
      ↓
      放到第一位

      其他声音
      ↓
      保持原来的顺序
    */

    loadVoices();

  };


  /* =================================================
     速度改变
     ================================================= */

  rate.onchange = () => {

    localStorage.setItem(
      "savedRate",
      rate.value
    );

  };


  /* =================================================
     按钮
     ================================================= */

  editBtn.onclick = () => {

    editContainer.style.display =
      "block";

    readContainer.style.display =
      "none";

  };


  playBtn.onclick = play;

  pauseBtn.onclick = hardStop;

  stopBtn.onclick = softPause;

  resumeBtn.onclick = resume;

  resetBtn.onclick = resetQueue;


  updateLanguage();

}


/* =====================================================
   Voice 唯一 ID
   ===================================================== */

function getVoiceKey(v){

  return (
    v.name +
    "||" +
    v.lang +
    "||" +
    (v.localService
      ? "local"
      : "remote")
  );

}


/* =====================================================
   ★ 只把上次选择的 Voice 放第一
   ===================================================== */

function sortVoices(list){

  const savedVoiceKey =
    localStorage.getItem(
      "savedVoiceKey"
    );


  /*
    第一次使用：
    没有保存过声音

    → 完全保持浏览器原来的顺序
  */

  if(!savedVoiceKey){

    return [...list];

  }


  /*
    找到上次选择的 Voice
  */

  const savedVoice =
    list.find(
      v =>
        getVoiceKey(v) ===
        savedVoiceKey
    );


  /*
    如果这个 Voice 当前不存在

    → 保持原来的顺序
  */

  if(!savedVoice){

    return [...list];

  }


  /*
    上次选择的 Voice 放第一

    其他 Voice：
    完全保持原来的顺序
  */

  return [

    savedVoice,

    ...list.filter(
      v =>
        getVoiceKey(v) !==
        savedVoiceKey
    )

  ];

}


/* =====================================================
   更新语言
   ===================================================== */

function updateLanguage(){

  const t =
    i18n[currentLang];


  title.textContent =
    t.title;

  subtitle.textContent =
    t.subtitle;

  text.placeholder =
    t.placeholder;

  playBtn.textContent =
    t.play;

  pauseBtn.textContent =
    t.pause;

  stopBtn.textContent =
    t.stop;

  resumeBtn.textContent =
    t.resume;

  editBtn.textContent =
    t.edit;

  resetBtn.textContent =
    t.reset;


  const languageLabel =
    document.querySelector(
      ".language label"
    );


  if(languageLabel){

    languageLabel.textContent =
      t.languageLabel;

  }


  const voiceLabel =
    document.querySelector("#voice")
      ?.parentElement
      ?.querySelector("label");


  if(voiceLabel){

    voiceLabel.textContent =
      t.voiceLabel;

  }


  const rateLabel =
    document.querySelector("#rate")
      ?.parentElement
      ?.querySelector("label");


  if(rateLabel){

    rateLabel.textContent =
      t.speedLabel;

  }

}


/* =====================================================
   ★ 自动扫描电脑当前可用的所有 Voice
   ===================================================== */

function loadVoices(){

  const available =
    speechSynthesis.getVoices();


  /*
    Chrome 有时候第一次调用时
    还没有返回 Voice。
  */

  if(!available.length){

    return;

  }


  /*
    先按照浏览器原本顺序
    获取完整 Voice 列表
  */

  voices =
    sortVoices(
      available
    );


  voice.innerHTML = "";


  /* =================================================
     创建 Voice 下拉选项
     ================================================= */

  voices.forEach((v, i) => {

    const o =
      document.createElement(
        "option"
      );


    o.value = i;


    o.textContent =
      v.name +
      " (" +
      v.lang +
      ")";


    voice.appendChild(o);

  });


  /* =================================================
     恢复上次选择的 Voice
     ================================================= */

  const savedVoiceKey =
    localStorage.getItem(
      "savedVoiceKey"
    );


  if(savedVoiceKey){

    const savedIndex =
      voices.findIndex(
        v =>
          getVoiceKey(v) ===
          savedVoiceKey
      );


    if(savedIndex >= 0){

      voice.value =
        savedIndex;

    }

  }


  /* =================================================
     恢复上次速度
     ================================================= */

  const savedRate =
    localStorage.getItem(
      "savedRate"
    );


  if(savedRate !== null){

    /*
      确认这个速度目前存在
    */

    const rateOption =
      [...rate.options].find(
        o =>
          o.value === savedRate
      );


    if(rateOption){

      rate.value =
        savedRate;

    }

  }

}


/* =====================================================
   分句
   ===================================================== */

function splitTextIntoSentences(text){

  return text

    .match(
      /[^。！？,.!?；;:\r\n]+[。！？,.!?；;:]?/g
    )

    ?.map(
      s => s.trim()
    )

    .filter(Boolean)

    || [];

}


/* =====================================================
   朗读前删除引号
   ===================================================== */

function cleanTextForSpeech(str){

  return str

    .replace(/[“”]/g, "")

    .replace(/[‘’]/g, "")

    .replace(/[「」]/g, "")

    .replace(/[『』]/g, "")

    .replace(/[《》]/g, "")

    .replace(/[〈〉]/g, "")

    .replace(/[【】]/g, "")

    .replace(/[（）()]/g, "")

    .trim();

}


/* =====================================================
   初始化阅读队列
   ===================================================== */

function initQueue(){

  const raw =
    splitTextIntoSentences(
      text.value
    );


  originalSentences =
    raw.map((t, i) => ({

      text: t,

      index: i

    }));


  activeQueue =
    [...originalSentences];


  hiddenIndexSet.clear();


  renderSentences();


  editContainer.style.display =
    "none";

  readContainer.style.display =
    "block";

}


/* =====================================================
   显示文章
   ===================================================== */

function renderSentences(){

  textContainer.innerHTML =
    "";


  originalSentences.forEach(
    item => {

      const span =
        document.createElement(
          "span"
        );


      /*
        页面显示原始文字
      */

      span.textContent =
        item.text + " ";


      if(
        hiddenIndexSet.has(
          item.index
        )
      ){

        span.classList.add(
          "read"
        );

      }


      span.onclick =
        () =>
          jumpToSentence(
            item.index
          );


      textContainer.appendChild(
        span
      );

    }
  );

}


/* =====================================================
   播放
   ===================================================== */

function play(){

  hardStop();

  initQueue();

  isPaused = false;

  playNext();

}


/* =====================================================
   播放下一句
   ===================================================== */

function playNext(){

  if(!activeQueue.length){

    return;

  }


  const item =
    activeQueue[0];


  const speechText =
    cleanTextForSpeech(
      item.text
    );


  utterance =
    new SpeechSynthesisUtterance(
      speechText
    );


  /* =================================================
     使用当前选择的 Voice
     ================================================= */

  utterance.voice =
    voices[voice.value] ||
    voices[0];


  /* =================================================
     使用当前速度
     ================================================= */

  utterance.rate =
    parseFloat(
      rate.value
    );


  utterance.onend = () => {

    hiddenIndexSet.add(
      item.index
    );


    activeQueue.shift();


    renderSentences();


    if(
      activeQueue.length &&
      !isPaused
    ){

      playNext();

    }

  };


  speechSynthesis.speak(
    utterance
  );

}


/* =====================================================
   点击句子
   ===================================================== */

function jumpToSentence(idx){

  hardStop();


  hiddenIndexSet.clear();


  originalSentences.forEach(
    item => {

      if(item.index < idx){

        hiddenIndexSet.add(
          item.index
        );

      }

    }
  );


  activeQueue =
    originalSentences.filter(
      item =>
        item.index >= idx
    );


  renderSentences();


  isPaused = false;


  playNext();

}


/* =====================================================
   暂停
   ===================================================== */

function softPause(){

  if(
    speechSynthesis.speaking &&
    !speechSynthesis.paused
  ){

    isPaused = true;

    speechSynthesis.pause();

  }

}


/* =====================================================
   真停止
   ===================================================== */

function hardStop(){

  isPaused = false;

  speechSynthesis.cancel();

}


/* =====================================================
   继续
   ===================================================== */

function resume(){

  if(
    speechSynthesis.paused
  ){

    isPaused = false;

    speechSynthesis.resume();

  }

  else if(
    activeQueue.length
  ){

    isPaused = false;

    playNext();

  }

}


/* =====================================================
   重置文章
   ===================================================== */

function resetQueue(){

  hardStop();


  originalSentences = [];

  activeQueue = [];

  hiddenIndexSet.clear();


  text.value = "";

  textContainer.innerHTML =
    "";


  editContainer.style.display =
    "block";

  readContainer.style.display =
    "none";

}


/* =====================================================
   启动
   ===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initUI();

    loadVoices();


    /*
      Chrome / Edge 有时不会
      在第一次调用时立即提供 Voices。
    */

    setTimeout(
      loadVoices,
      500
    );

    setTimeout(
      loadVoices,
      1500
    );

  }
);


/* =====================================================
   Voice 加载完成
   ===================================================== */

speechSynthesis.onvoiceschanged =
  loadVoices;