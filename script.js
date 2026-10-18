/* =========================
   EDIT THESE ONLY
========================= */

const CONFIG = {
  name: "Nadoshty",
  specialDate: "992023",
  welcomeArabic:"انهارده عيد ميلاد ندوشتى😍"
};


/* =========================
   ELEMENTS
========================= */

const $ = id => document.getElementById(id);

$("lockName").textContent = CONFIG.name.toUpperCase();
$("heroName").textContent = CONFIG.name;
$("finalName").textContent = CONFIG.name;


/* =========================
   PIN
========================= */

let entered = "";

function updatePin() {
  const boxes = [...document.querySelectorAll("#pinBoxes span")];

  boxes.forEach((box, i) => {
    box.classList.toggle("filled", i < entered.length);
  });
}


function unlock() {

  $("lockScreen").classList.add("hidden");

  $("welcomeScreen").classList.remove("hidden");


  /* Welcome screen */

  setTimeout(() => {

    $("welcomeScreen").classList.add("hidden");

    $("arabicIntro").classList.remove("hidden");

    $("arabicIntro")
      .querySelector(".arabic-line")
      .textContent = CONFIG.welcomeArabic;

  }, 2600);


  /* Main website */

  setTimeout(() => {

    $("arabicIntro").classList.add("hidden");

    $("mainSite").classList.remove("hidden");

    $("musicBar").classList.remove("hidden");


    /*
      مهم:
      Scratch Cards لازم تبدأ بعد ظهور mainSite
      عشان الكروت يكون عندها width و height حقيقيين.
    */

    requestAnimationFrame(() => {
      initScratchCards();
    });


    window.scrollTo(0, 0);

    startParticles();

  }, 5200);

}


/* =========================
   KEYPAD
========================= */

document.querySelectorAll(".keypad button").forEach(btn => {

  btn.addEventListener("click", () => {

    const k = btn.dataset.key;


    /* Delete */

    if (k === "del") {

      entered = entered.slice(0, -1);

      updatePin();

      return;
    }


    /* Maximum 4 digits */

    if (entered.length >= 6) return;


    entered += k;

    updatePin();


    /* Check PIN */

    if (entered.length === 6) {

      if (entered === CONFIG.specialDate) {

        setTimeout(unlock, 350);

      } else {

        $("pinError").classList.add("show");


        setTimeout(() => {

          $("pinError").classList.remove("show");

        }, 1300);


        entered = "";

        updatePin();

      }

    }

  });

});


/* =========================
   SCRATCH CARDS
========================= */

function initScratchCards() {

  document.querySelectorAll(".love-card").forEach(card => {

    const canvas = card.querySelector(".scratch-canvas");

    if (!canvas) return;


    const ctx = canvas.getContext("2d");


    /* Get the real visible size */

    const rect = card.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;


    /* If card is still hidden, stop */

    if (width === 0 || height === 0) return;


    const dpr = window.devicePixelRatio || 1;


    /* Canvas size */

    canvas.width = width * dpr;
    canvas.height = height * dpr;


    canvas.style.width = width + "px";
    canvas.style.height = height + "px";


    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );


    /* =========================
       PINK SCRATCH LAYER
    ========================= */

    ctx.globalCompositeOperation = "source-over";

    ctx.fillStyle = "#f7b8c9";

    ctx.fillRect(
      0,
      0,
      width,
      height
    );


    /* =========================
       HEART
    ========================= */

    ctx.fillStyle = "#8b3f57";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.font = "24px Arial";

    ctx.fillText(
      "♥",
      width / 2,
      height / 2 - 18
    );


    /* =========================
       SCRATCH ME TEXT
    ========================= */

    ctx.font = "10px Montserrat";

    ctx.fillText(
      "SCRATCH ME",
      width / 2,
      height / 2 + 15
    );


    /* =========================
       SCRATCHING
    ========================= */

    let scratching = false;


    function scratch(e) {

      if (!scratching) return;


      const canvasRect =
        canvas.getBoundingClientRect();


      const x =
        e.clientX - canvasRect.left;

      const y =
        e.clientY - canvasRect.top;


      ctx.globalCompositeOperation =
        "destination-out";


      ctx.beginPath();

      ctx.arc(
        x,
        y,
        25,
        0,
        Math.PI * 2
      );

      ctx.fill();

    }


    /* =========================
       POINTER DOWN
    ========================= */

    canvas.onpointerdown = e => {

      scratching = true;

      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {}

      scratch(e);

    };


    /* =========================
       POINTER MOVE
    ========================= */

    canvas.onpointermove = scratch;


    /* =========================
       POINTER UP
    ========================= */

    canvas.onpointerup = e => {

      scratching = false;

      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {}

    };


    /* =========================
       POINTER CANCEL
    ========================= */

    canvas.onpointercancel = () => {

      scratching = false;

    };

  });

}


/* =========================
   FLOATING HEARTS
========================= */

function addParticle() {

  const p = document.createElement("div");

  p.className = "particle";

  p.textContent =
    Math.random() > 0.5
      ? "♥"
      : "♡";


  p.style.left =
    Math.random() * 100 + "%";


  p.style.bottom = "-20px";


  p.style.fontSize =
    8 + Math.random() * 13 + "px";


  p.style.animationDuration =
    8 + Math.random() * 9 + "s";


  $("particles").appendChild(p);


  setTimeout(() => {

    p.remove();

  }, 18000);

}


function startParticles() {

  setInterval(
    addParticle,
    850
  );


  for (let i = 0; i < 8; i++) {

    setTimeout(
      addParticle,
      i * 250
    );

  }

}


/* =========================
   LOVE LETTER
========================= */

const envelope = $("envelope");

if (envelope) {

  envelope.addEventListener("click", () => {

    envelope.classList.toggle("open");

  });

}

/* =========================
   MUSIC
========================= */

const music = $("music");

const musicBtn = $("musicBtn");

let playing = false;


musicBtn.addEventListener(
  "click",
  async () => {

    if (!music.src) {

      alert(
        "ضعّي ملف الموسيقى باسم music.mp3 بجوار index.html"
      );

      return;
    }


    if (playing) {

      music.pause();

      musicBtn.textContent = "▶";

      playing = false;

    } else {

      try {

        await music.play();

        musicBtn.textContent = "Ⅱ";

        playing = true;

      } catch (error) {

        console.log(
          "Music could not start:",
          error
        );

      }

    }

  }
);


/* =========================
   MUSIC TIME
========================= */

music.addEventListener(
  "timeupdate",
  () => {

    const minutes =
      Math.floor(
        music.currentTime / 60
      )
      .toString()
      .padStart(2, "0");


    const seconds =
      Math.floor(
        music.currentTime % 60
      )
      .toString()
      .padStart(2, "0");


    $("musicTime").textContent =
      `${minutes}:${seconds}`;

  }
);

/* =========================
   BIRTHDAY PHOTO
========================= */

const surpriseButton = $("surpriseButton");
const birthdayPhotoModal = $("birthdayPhotoModal");
const closeBirthdayPhoto = $("closeBirthdayPhoto");


if (surpriseButton && birthdayPhotoModal) {

  surpriseButton.addEventListener("click", () => {

    birthdayPhotoModal.classList.add("show");

    document.body.style.overflow = "hidden";

  });

}


if (closeBirthdayPhoto && birthdayPhotoModal) {

  closeBirthdayPhoto.addEventListener("click", () => {

    birthdayPhotoModal.classList.remove("show");

    document.body.style.overflow = "";

  });

}


/* Close by clicking outside the content */

if (birthdayPhotoModal) {

  birthdayPhotoModal.addEventListener("click", e => {

    if (e.target === birthdayPhotoModal) {

      birthdayPhotoModal.classList.remove("show");

      document.body.style.overflow = "";

    }

  });

}

/* =========================
   SURPRISE PHOTO
========================= */

const SurpriseButton = $("surpriseButton");
const BirthdayPhotoModal = $("birthdayPhotoModal");
const CloseBirthdayPhoto = $("closeBirthdayPhoto");

if (surpriseButton && birthdayPhotoModal) {

  surpriseButton.addEventListener("click", () => {

    birthdayPhotoModal.classList.add("show");

    document.body.style.overflow = "hidden";

  });

}

if (closeBirthdayPhoto) {

  closeBirthdayPhoto.addEventListener("click", () => {

    birthdayPhotoModal.classList.remove("show");

    document.body.style.overflow = "";

  });

}

if (birthdayPhotoModal) {

  birthdayPhotoModal.addEventListener("click", (e) => {

    if (e.target === birthdayPhotoModal) {

      birthdayPhotoModal.classList.remove("show");

      document.body.style.overflow = "";

    }

  });

}