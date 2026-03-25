
const cols = document.querySelectorAll(".parallax-col");
let ticking = false;

function updateParallax() {
  const scrollY = window.scrollY;
  const heroEl = document.querySelector(".hero");
  if (!heroEl) return;
  const heroH = heroEl.offsetHeight;
  if (scrollY > heroH * 1.5) {
    ticking = false;
    return;
  }
  
  cols.forEach((col) => {
    const speed = parseFloat(col.dataset.speed) || 0.3;
    const offset = scrollY * speed * 0.7;
    col.style.transform = `translateY(${offset}px)`;
  });

  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  },
  { passive: true }
);

const gallery = document.getElementById("galleryStrip");
let isDown = false,
  startX = 0,
  scrollLeft = 0;

if (gallery) {
    gallery.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - gallery.offsetLeft;
      scrollLeft = gallery.parentElement.scrollLeft;
      gallery.style.cursor = "default";
    });
    window.addEventListener("mouseup", () => {
      isDown = false;
      gallery.style.cursor = "default";
    });
    gallery.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - gallery.offsetLeft;
      const walk = (x - startX) * 1.5;
      gallery.parentElement.scrollLeft = scrollLeft - walk;
    });
}

const gallerySection = document.querySelector(".gallery-strip");
function updateGallery() {
  if (!gallerySection || !gallery) return;
  const rect = gallerySection.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const inView = rect.top < viewportHeight && rect.bottom > 0;
  
  if (inView) {
    const scrollRange = viewportHeight + rect.height;
    const progress = (viewportHeight - rect.top) / scrollRange;
    const scrollAmount = (gallery.scrollWidth - gallerySection.offsetWidth) * progress;
    gallery.style.transform = `translateX(${-scrollAmount}px)`;
  }
}
window.addEventListener("scroll", () => requestAnimationFrame(updateGallery), {
  passive: true
});

const subBtn = document.getElementById("subBtn");
if (subBtn) {
    subBtn.addEventListener("click", () => {
      const val = document.getElementById("emailInput").value.trim();
      if (!val || !val.includes("@")) {
        document.getElementById("emailInput").style.borderColor = "#B05C52";
        document.getElementById("emailInput").style.background = "#FDF0EB";
        setTimeout(() => {
          document.getElementById("emailInput").style.borderColor = "";
          document.getElementById("emailInput").style.background = "";
        }, 1200);
        return;
      }
      document.getElementById("subForm").style.display = "none";
      document.getElementById("successMsg").style.display = "block";
    });
}

const emailInput = document.getElementById("emailInput");
if (emailInput) {
    emailInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") document.getElementById("subBtn").click();
    });
}

document.querySelectorAll(".class-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.filter = "brightness(0.96)";
  });
  card.addEventListener("mouseleave", () => {
    card.style.filter = "";
  });
});

const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            if (entry.target.classList.contains('stat-box')) {
                const numEl = entry.target.querySelector('.stat-num');
                if (numEl) animateCounter(numEl);
            }
        }
    });
}, revealOptions);

document.querySelectorAll('h1, .reveal, .reveal-left, .reveal-right, .reveal-stagger, section, .class-card, .stat-box, .faq-item, .quote-card').forEach(el => {
    
    if (!el.className.includes('reveal')) {
        el.classList.add('reveal');
    }
    revealObserver.observe(el);
});

function animateCounter(el) {
    if (!el || el.dataset.animated) return;
    el.dataset.animated = "true";
    const rawText = el.innerText;
    const target = parseFloat(rawText.replace(/[^0-9.]/g, ''));
    if (isNaN(target)) return;

    let count = 0;
    const duration = 1500;
    const startTime = performance.now();
    
    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentCount = progress * target;

        if (rawText.includes('.')) {
            el.innerHTML = currentCount.toFixed(1) + (rawText.includes('%') ? '%' : (rawText.includes('+') ? '+' : ''));
        } else {
            el.innerHTML = Math.floor(currentCount) + (rawText.includes('%') ? '%' : (rawText.includes('+') ? '+' : ''));
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.innerHTML = rawText; 
        }
    };
    requestAnimationFrame(update);
}

function initTickers() {
  const tickers = [
    { el: document.getElementById("tickerInner"), speed: 0.8 },
    { el: document.getElementById("brandsInner"), speed: 0.5 }
  ];

  tickers.forEach(t => {
    if (!t.el) return;
    let x = 0;
    const scroll = () => {
      x -= t.speed;
      if (Math.abs(x) >= t.el.scrollWidth / 2) x = 0;
      t.el.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(scroll);
    };
    scroll();
  });
}
initTickers();

if (typeof lucide !== 'undefined') {
  lucide.createIcons();
  setTimeout(() => lucide.createIcons(), 500);
}

document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const nav = document.querySelector('nav');
    if (navToggle && nav) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('nav-open');
        });
        
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('nav-open') && !nav.contains(e.target)) {
                nav.classList.remove('nav-open');
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById("stackly-preloader");
    if (!preloader) return;
    
    document.body.classList.add("preloading");
    
    const bar = preloader.querySelector(".preloader-bar");
    const text = preloader.querySelector(".preloader-text");
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        if (bar) bar.style.width = `${progress}%`;
        
        if (progress >= 30 && progress < 60) {
            if (text) text.textContent = "VERIFYING PROTOCOLS...";
        } else if (progress >= 60 && progress < 90) {
            if (text) text.textContent = "ESTABLISHING CONNECTION...";
        } else if (progress >= 100) {
            if (text) text.textContent = "ACCESS GRANTED";
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add("fade-out");
                document.body.classList.remove("preloading");
                setTimeout(() => preloader.remove(), 600);
            }, 300);
        }
    }, 150);
});