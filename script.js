/* =========================================================
   CONFIGURATION
========================================================= */

const SECRET_PIN = "1508";

const PERSON_NAME = "M";

const YOUR_NAME = "F";

/* =========================================================
   LOADING
========================================================= */

const BUTTERFLY_COUNT = 120;

const LOADING_TIME = 7000;

const BOOK_OPEN_TIME = 1350;

const HOLD_TIME = 5000;

/* =========================================================
   MESSAGE
========================================================= */

const REAL_MESSAGE = `Untuk Sayangku,

Aku tahu sekarang kamu lagi nggak baik-baik saja,
dan mungkin badanmu sedang lelah
karena harus melawan rasa sakit.
Kalau aku bisa,

aku ingin ada di sampingmu sekarang.
Menemani kamu,
memastikan kamu makan,
minum obat,
dan istirahat dengan cukup.

Jangan terlalu memaksakan diri, ya.
Untuk sekarang, tugas kamu cuma satu:
sembuh. 🤍

Aku mungkin nggak selalu bisa
menghilangkan rasa sakitmu,
tapi aku ingin kamu tahu
bahwa kamu nggak harus melewati semuanya sendirian.

Kalau sakitnya terasa berat,
cerita ke aku.
Kalau kamu capek,
istirahatlah.

Kalau kamu ingin ditemani,
aku ada.

Dan kalau nanti kamu sudah sembuh,
aku ingin melihat senyum kamu lagi.
Karena entah kenapa,

senyum kamu selalu punya cara
sendiri untuk membuat hariku lebih baik.
Jadi cepat sembuh, ya, sayang. 🤍

Aku masih punya banyak cerita,
banyak hal yang ingin aku lakukan bersamamu,
dan tentu saja...

masih banyak rasa yang belum selesai
aku tunjukkan kepadamu.

Jaga diri baik-baik.

Jangan lupa makan.

Jangan lupa minum obat.

Dan jangan terlalu banyak berpikir.

Karena ada seseorang di sini
yang diam-diam selalu khawatir
kalau kamu sakit.

Seseorang yang mungkin
nggak selalu pandai mengatakannya,
tapi sungguh...

aku sayang kamu.
Cepat sembuh, Sayangku.
Aku tunggu kamu kembali ceria. 🤍

— ${YOUR_NAME}`;

/* =========================================================
   RANDOM CHARACTERS
========================================================= */

const RANDOM_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&*@!?";

/* =========================================================
   STATE
========================================================= */

let enteredPin = "";

let isTransitioning = false;

let bookOpened = false;

let holdActive = false;

let holdStartTime = 0;

let holdAnimationFrame = null;

/* =========================================================
   DOM
========================================================= */

const bgMusic = document.getElementById("bgMusic");

const pinScreen = document.getElementById("pinScreen");

const pinDisplay = document.getElementById("pinDisplay");

const pinDots = pinDisplay ? pinDisplay.querySelectorAll("span") : [];

const pinError = document.getElementById("pinError");

const loadingScreen = document.getElementById("loadingScreen");

const butterflyContainer = document.getElementById("butterflyContainer");

const bookPage = document.getElementById("bookPage");

const book = document.getElementById("book");

const openBookButton = document.getElementById("openBookButton");

const personName = document.getElementById("personName");

const encryptedMessage = document.getElementById("encryptedMessage");

const holdButton = document.getElementById("holdButton");

const holdProgress = holdButton
  ? holdButton.querySelector(".hold-progress")
  : null;

const realMessage = document.getElementById("realMessage");

const messageEnd = document.getElementById("messageEnd");

const musicButton = document.getElementById("musicButton");

const restartButton = document.getElementById("restartButton");

const keypadButtons = document.querySelectorAll(".key[data-number]");

const clearPinButton = document.getElementById("clearPin");

const deletePinButton = document.getElementById("deletePin");

/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
  if (personName) {
    personName.textContent = PERSON_NAME;
  }

  updatePinDisplay();

  prepareEncryptedMessage();

  setupPin();

  setupBook();

  setupHoldButton();

  setupMusic();

  setupRestart();

  preventDoubleTapZoom();
}

/* =========================================================
   PIN
========================================================= */

function setupPin() {
  keypadButtons.forEach((button) => {
    button.addEventListener("click", () => {
      enterPinNumber(button.dataset.number);
    });
  });

  if (clearPinButton) {
    clearPinButton.addEventListener("click", clearPin);
  }

  if (deletePinButton) {
    deletePinButton.addEventListener("click", deleteLastPin);
  }
}

/* =========================================================
   ENTER PIN
========================================================= */

function enterPinNumber(number) {
  if (isTransitioning) {
    return;
  }

  if (enteredPin.length >= SECRET_PIN.length) {
    return;
  }

  enteredPin += number;

  updatePinDisplay();

  hidePinError();

  if (enteredPin.length === SECRET_PIN.length) {
    setTimeout(checkPin, 120);
  }
}

/* =========================================================
   UPDATE PIN
========================================================= */

function updatePinDisplay() {
  pinDots.forEach((dot, index) => {
    dot.classList.toggle("filled", index < enteredPin.length);
  });
}

/* =========================================================
   CLEAR
========================================================= */

function clearPin() {
  if (isTransitioning) {
    return;
  }

  enteredPin = "";

  updatePinDisplay();

  hidePinError();
}

/* =========================================================
   DELETE
========================================================= */

function deleteLastPin() {
  if (isTransitioning) {
    return;
  }

  enteredPin = enteredPin.slice(0, -1);

  updatePinDisplay();

  hidePinError();
}

/* =========================================================
   CHECK PIN
========================================================= */

function checkPin() {
  if (isTransitioning) {
    return;
  }

  if (enteredPin === SECRET_PIN) {
    isTransitioning = true;

    hidePinError();

    /*
      Dipanggil langsung dari
      klik PIN agar audio tidak
      ditolak browser.
    */

    playMusic();

    pinScreen.style.transition = "opacity .55s ease, transform .55s ease";

    pinScreen.style.opacity = "0";

    pinScreen.style.transform = "scale(1.03)";

    setTimeout(startLoadingExperience, 550);

    return;
  }

  showPinError();

  enteredPin = "";

  updatePinDisplay();
}

/* =========================================================
   PIN ERROR
========================================================= */

function showPinError() {
  if (!pinError) {
    return;
  }

  pinError.textContent = "Kuncinya belum tepat 🤍";

  pinError.style.opacity = "1";

  pinError.animate(
    [
      {
        transform: "translateX(0)",
      },

      {
        transform: "translateX(-7px)",
      },

      {
        transform: "translateX(7px)",
      },

      {
        transform: "translateX(-5px)",
      },

      {
        transform: "translateX(5px)",
      },

      {
        transform: "translateX(0)",
      },
    ],
    {
      duration: 350,

      easing: "ease-out",
    },
  );
}

function hidePinError() {
  if (!pinError) {
    return;
  }

  pinError.textContent = "";

  pinError.style.opacity = "0";
}

/* =========================================================
   LOADING
========================================================= */

async function startLoadingExperience() {
  pinScreen.classList.add("hidden");

  loadingScreen.classList.remove("hidden");

  bookPage.classList.add("hidden");

  resetBook();

  createButterflies();

  await wait(LOADING_TIME);

  /*
    Kupu-kupu terakhir
    bergerak keluar
  */

  if (butterflyContainer) {
    const butterflies =
      butterflyContainer.querySelectorAll(".loading-butterfly");

    butterflies.forEach((butterfly) => {
      butterfly.style.animation = "flyButterflyOut 1.1s ease-in forwards";
    });
  }

  await wait(1100);

  if (butterflyContainer) {
    butterflyContainer.innerHTML = "";
  }

  loadingScreen.classList.add("hidden");

  showBookPage();
}

/* =========================================================
   CREATE BUTTERFLIES
========================================================= */

function createButterflies() {
  if (!butterflyContainer) {
    return;
  }

  butterflyContainer.innerHTML = "";

  const width = window.innerWidth;

  const height = window.innerHeight;

  /*
     Di HP jumlah sedikit dikurangi
     agar tetap ringan.
  */

  const count = width <= 600 ? 90 : BUTTERFLY_COUNT;

  for (let i = 0; i < count; i++) {
    const butterfly = document.createElement("img");

    butterfly.src = "assets/butterfly.png";

    butterfly.alt = "";

    butterfly.className = "loading-butterfly";

    /*
      Ukuran kupu-kupu kecil
    */

    const size = randomFloat(7, width <= 600 ? 14 : 18);

    /*
      posisi awal
    */

    const startX = randomFloat(-50, width + 50);

    const startY = randomFloat(-50, height + 50);

    /*
      jalur pertama
    */

    const midX = randomFloat(-width * 0.2, width * 0.7);

    const midY = randomFloat(-height * 0.2, height * 0.8);

    /*
      jalur kedua
    */

    const mid2X = randomFloat(-width * 0.25, width * 0.9);

    const mid2Y = randomFloat(-height * 0.25, height * 1.0);

    /*
      titik keluar
    */

    const endX = Math.random() > 0.5 ? width + 200 : -200;

    const endY = randomFloat(-150, height + 150);

    /*
      durasi
    */

    const duration = randomFloat(3.5, 7);

    /*
      delay acak
    */

    const delay = randomFloat(-6, 0);

    const opacity = randomFloat(0.45, 0.92);

    butterfly.style.width = `${size}px`;

    butterfly.style.setProperty("--opacity", opacity);

    butterfly.style.setProperty("--start-x", `${startX}px`);

    butterfly.style.setProperty("--start-y", `${startY}px`);

    butterfly.style.setProperty("--mid-x", `${midX}px`);

    butterfly.style.setProperty("--mid-y", `${midY}px`);

    butterfly.style.setProperty("--mid2-x", `${mid2X}px`);

    butterfly.style.setProperty("--mid2-y", `${mid2Y}px`);

    butterfly.style.setProperty("--end-x", `${endX}px`);

    butterfly.style.setProperty("--end-y", `${endY}px`);

    butterfly.style.setProperty("--duration", `${duration}s`);

    butterfly.style.setProperty("--delay", `${delay}s`);

    /*
      mirror acak
    */

    if (Math.random() > 0.5) {
      butterfly.style.transform = "scaleX(-1)";
    }

    butterflyContainer.appendChild(butterfly);
  }
}

/* =========================================================
   SHOW BOOK
========================================================= */

function showBookPage() {
  if (!bookPage) {
    return;
  }

  bookPage.classList.remove("hidden");

  resetBook();
}

/* =========================================================
   BOOK SETUP
========================================================= */

function setupBook() {
  if (!openBookButton) {
    return;
  }

  openBookButton.addEventListener("click", openBook);
}

/* =========================================================
   OPEN BOOK
========================================================= */

function openBook() {
  /*
    Jangan eksekusi dua kali
  */

  if (bookOpened) {
    return;
  }

  if (!book) {
    return;
  }

  bookOpened = true;

  prepareEncryptedMessage();

  /*
    Pastikan musik tetap hidup
  */

  playMusic();

  /*
    INI CLASS YANG DIPAKAI CSS:
    .book.opened .book-cover
  */

  requestAnimationFrame(() => {
    book.classList.add("opened");
  });

  /*
    Setelah cover selesai,
    halaman siap digunakan.
  */

  setTimeout(() => {
    const letter = document.querySelector(".letter-content");

    if (letter) {
      letter.scrollTop = 0;
    }
  }, BOOK_OPEN_TIME);
}

/* =========================================================
   RESET BOOK
========================================================= */

function resetBook() {
  bookOpened = false;

  if (book) {
    book.classList.remove("opened");
  }

  prepareEncryptedMessage();
}

/* =========================================================
   PREPARE ENCRYPTED MESSAGE
========================================================= */

function prepareEncryptedMessage() {
  if (!encryptedMessage) {
    return;
  }

  encryptedMessage.style.display = "block";

  encryptedMessage.style.opacity = "1";

  encryptedMessage.style.transform = "translateY(0)";

  encryptedMessage.textContent = generateEncryptedMessage(REAL_MESSAGE);

  if (holdButton) {
    holdButton.classList.remove("hidden");

    holdButton.disabled = false;
  }

  if (holdProgress) {
    holdProgress.style.width = "0%";
  }

  if (realMessage) {
    realMessage.textContent = "";

    realMessage.style.opacity = "0";
  }

  if (messageEnd) {
    messageEnd.classList.add("hidden");
  }
}

/* =========================================================
   ENCRYPT MESSAGE
========================================================= */

function generateEncryptedMessage(message) {
  let output = "";

  for (const char of message) {
    if (char === " " || char === "\n" || char === "\t") {
      output += char;
    } else {
      output += randomCharacter();
    }
  }

  return output;
}

/* =========================================================
   RANDOM CHARACTER
========================================================= */

function randomCharacter() {
  const index = Math.floor(Math.random() * RANDOM_CHARACTERS.length);

  return RANDOM_CHARACTERS[index];
}

/* =========================================================
   HOLD
========================================================= */

function setupHoldButton() {
  if (!holdButton) {
    return;
  }

  holdButton.addEventListener("pointerdown", startHold);

  holdButton.addEventListener("pointerup", endHold);

  holdButton.addEventListener("pointercancel", cancelHold);

  holdButton.addEventListener("lostpointercapture", cancelHold);
}

/* =========================================================
   START HOLD
========================================================= */

function startHold(event) {
  if (!holdButton || holdButton.disabled) {
    return;
  }

  event.preventDefault();

  try {
    holdButton.setPointerCapture(event.pointerId);
  } catch (error) {
    // Browser tertentu mungkin tidak mendukung.
  }

  if (holdActive) {
    return;
  }

  holdActive = true;

  holdStartTime = performance.now();

  if (holdProgress) {
    holdProgress.style.width = "0%";
  }

  cancelAnimationFrame(holdAnimationFrame);

  updateDecryption();
}

/* =========================================================
   END HOLD
========================================================= */

function endHold(event) {
  if (event) {
    event.preventDefault();
  }

  if (!holdActive) {
    return;
  }

  const elapsed = performance.now() - holdStartTime;

  const progress = Math.min(elapsed / HOLD_TIME, 1);

  if (progress >= 1) {
    holdActive = false;

    cancelAnimationFrame(holdAnimationFrame);

    completeDecryption();
  } else {
    cancelIncompleteHold();
  }
}

/* =========================================================
   CANCEL HOLD
========================================================= */

function cancelHold() {
  if (!holdActive) {
    return;
  }

  cancelIncompleteHold();
}

/* =========================================================
   INCOMPLETE
========================================================= */

function cancelIncompleteHold() {
  holdActive = false;

  cancelAnimationFrame(holdAnimationFrame);

  if (holdProgress) {
    holdProgress.style.width = "0%";
  }

  if (encryptedMessage) {
    encryptedMessage.textContent = generateEncryptedMessage(REAL_MESSAGE);
  }
}

/* =========================================================
   UPDATE DECRYPTION
========================================================= */

function updateDecryption() {
  if (!holdActive) {
    return;
  }

  const elapsed = performance.now() - holdStartTime;

  const progress = Math.min(elapsed / HOLD_TIME, 1);

  if (holdProgress) {
    holdProgress.style.width = `${progress * 100}%`;
  }

  updateEncryptedText(progress);

  if (progress >= 1) {
    holdActive = false;

    completeDecryption();

    return;
  }

  holdAnimationFrame = requestAnimationFrame(updateDecryption);
}

/* =========================================================
   UPDATE ENCRYPTED
========================================================= */

function updateEncryptedText(progress) {
  if (!encryptedMessage) {
    return;
  }

  const revealCount = Math.floor(REAL_MESSAGE.length * progress);

  let output = "";

  for (let i = 0; i < REAL_MESSAGE.length; i++) {
    const original = REAL_MESSAGE[i];

    if (original === " " || original === "\n" || original === "\t") {
      output += original;

      continue;
    }

    if (i < revealCount) {
      output += original;
    } else {
      output += randomCharacter();
    }
  }

  encryptedMessage.textContent = output;
}

/* =========================================================
   COMPLETE DECRYPTION
========================================================= */

function completeDecryption() {
  if (!encryptedMessage || !holdButton) {
    return;
  }

  if (holdProgress) {
    holdProgress.style.width = "100%";
  }

  encryptedMessage.textContent = REAL_MESSAGE;

  holdButton.disabled = true;

  setTimeout(() => {
    encryptedMessage.style.opacity = "0";

    encryptedMessage.style.transform = "translateY(-8px)";
  }, 350);

  setTimeout(() => {
    holdButton.classList.add("hidden");

    encryptedMessage.style.display = "none";

    showRealMessage();
  }, 750);
}

/* =========================================================
   SHOW MESSAGE
========================================================= */

async function showRealMessage() {
  if (!realMessage) {
    return;
  }

  realMessage.textContent = "";

  realMessage.style.opacity = "1";

  const characters = Array.from(REAL_MESSAGE);

  for (let i = 0; i < characters.length; i++) {
    realMessage.textContent += characters[i];

    await wait(7);
  }

  if (messageEnd) {
    messageEnd.classList.remove("hidden");

    setTimeout(() => {
      messageEnd.scrollIntoView({
        behavior: "smooth",

        block: "center",
      });
    }, 250);
  }
}

/* =========================================================
   MUSIC
========================================================= */

function setupMusic() {
  if (!musicButton) {
    return;
  }

  musicButton.addEventListener("click", toggleMusic);

  updateMusicButton();
}

function playMusic() {
  if (!bgMusic) {
    return;
  }

  bgMusic.volume = 0.65;

  const promise = bgMusic.play();

  if (promise && typeof promise.catch === "function") {
    promise.catch((error) => {
      console.log("Musik belum dapat diputar:", error);
    });
  }

  updateMusicButton();
}

function toggleMusic() {
  if (!bgMusic) {
    return;
  }

  if (bgMusic.paused) {
    playMusic();
  } else {
    bgMusic.pause();

    updateMusicButton();
  }
}

function updateMusicButton() {
  if (!musicButton || !bgMusic) {
    return;
  }

  musicButton.textContent = bgMusic.paused ? "♪" : "♫";
}

/* =========================================================
   RESTART
========================================================= */

function setupRestart() {
  if (!restartButton) {
    return;
  }

  restartButton.addEventListener("click", restartExperience);
}

function restartExperience() {
  cancelAnimationFrame(holdAnimationFrame);

  holdActive = false;

  bookOpened = false;

  isTransitioning = false;

  enteredPin = "";

  /*
    Reset audio
  */

  if (bgMusic) {
    bgMusic.pause();

    bgMusic.currentTime = 0;
  }

  /*
    Reset loading
  */

  if (butterflyContainer) {
    butterflyContainer.innerHTML = "";
  }

  loadingScreen.classList.add("hidden");

  /*
    Reset book
  */

  bookPage.classList.add("hidden");

  resetBook();

  /*
    Reset pin
  */

  pinScreen.classList.remove("hidden");

  pinScreen.style.opacity = "0";

  pinScreen.style.transform = "scale(1.03)";

  updatePinDisplay();

  hidePinError();

  prepareEncryptedMessage();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      pinScreen.style.transition = "opacity .45s ease, transform .45s ease";

      pinScreen.style.opacity = "1";

      pinScreen.style.transform = "scale(1)";
    });
  });
}

/* =========================================================
   UTILITY RANDOM
========================================================= */

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/* =========================================================
   PREVENT DOUBLE-TAP ZOOM
========================================================= */

function preventDoubleTapZoom() {
  let lastTouchEnd = 0;

  document.addEventListener(
    "touchend",
    (event) => {
      const now = Date.now();

      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }

      lastTouchEnd = now;
    },
    {
      passive: false,
    },
  );
}

/* =========================================================
   TAMBAHAN ANIMASI KELUAR
========================================================= */

const extraStyle = document.createElement("style");

extraStyle.textContent = `

  @keyframes flyButterflyOut {

    0% {

      opacity:
        var(--opacity);

      transform:
        translate3d(
          var(--mid2-x),
          var(--mid2-y),
          0
        )
        rotate(300deg)
        scale(1);

    }

    100% {

      opacity:
        0;

      transform:
        translate3d(
          var(--end-x),
          var(--end-y),
          0
        )
        rotate(720deg)
        scale(.2);

    }

  }

`;

document.head.appendChild(extraStyle);
