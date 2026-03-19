(function () {
  var attempts = 0;
  var maxAttempts = 20;
  var retryDelay = 300;
  var hasStarted = false;

  function initOlaSpinHero() {
    var hero = document.getElementById('olaSpinHero');
    var frame = document.getElementById('olaSpinHeroFrame');
    var wheel = document.getElementById('olaSpinHeroWheel');
    var badge = document.getElementById('olaSpinHeroBadge');
    var title = document.getElementById('olaSpinHeroTitle');
    var text = document.getElementById('olaSpinHeroText');
    var startButton = document.getElementById('olaSpinHeroStartButton');
    var resultButton = document.getElementById('olaSpinHeroButton');
    var voucherWrap = document.getElementById('olaSpinHeroVoucherWrap');
    var voucherCodeBox = document.getElementById('olaSpinHeroVoucherCode');
    var confettiLayer = document.getElementById('olaSpinHeroConfetti');

    if (!hero || !frame || !wheel || !badge || !title || !text || !startButton || !resultButton || !voucherWrap || !voucherCodeBox) {
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(initOlaSpinHero, retryDelay);
      }
      return;
    }

    if (hero.getAttribute('data-spinhero-initialized') === 'true') {
      return;
    }
    hero.setAttribute('data-spinhero-initialized', 'true');

    function createConfetti() {
      if (!confettiLayer) return;
      confettiLayer.innerHTML = '';

      var colors = ['#ffffff', '#d4af37', '#7e8a97', '#bfc7ce', '#a97142', '#FFE680'];
      var pieces = 130;

      for (var i = 0; i < pieces; i++) {
        var piece = document.createElement('span');
        piece.className = 'ola-spinhero__confetti-piece';

        var left = Math.random() * 100;
        var sizeW = 6 + Math.random() * 8;
        var sizeH = 10 + Math.random() * 14;
        var duration = 3.8 + Math.random() * 2.8;
        var delay = Math.random() * 1.8;
        var drift = (-120 + Math.random() * 240).toFixed(0) + 'px';
        var rotate = (Math.random() * 50 - 25).toFixed(0) + 'deg';

        piece.style.left = left + 'vw';
        piece.style.width = sizeW + 'px';
        piece.style.height = sizeH + 'px';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = duration + 's';
        piece.style.animationDelay = delay + 's';
        piece.style.transform = 'rotate(' + rotate + ')';
        piece.style.setProperty('--ola-confetti-x', drift);

        confettiLayer.appendChild(piece);
      }
    }

    function cleanVoucherCode(value) {
      return (value || '').replace(/\s+/g, '').toUpperCase();
    }

    function getVoucherPrefix(code) {
      return code.split('-')[0];
    }

    var voucherCodeRaw = voucherCodeBox.textContent || '';
    var voucherCode = cleanVoucherCode(voucherCodeRaw);
    var prefix = getVoucherPrefix(voucherCode);

    var states = {
      brons: {
        prize: 'brons',
        badge: 'Jij hebt brons gewonnen',
        title: 'Gefeliciteerd!<br>Jij hebt <span>brons</span> gewonnen',
        text: 'Jouw voucher hoort bij de categorie Brons.',
        buttonText: 'Ga naar de voordeelshop',
        buttonUrl: 'https://ola.touchtickets.nl/nl/catalogue/',
        rotation: 0,
        frameBg: '#a97142',
        confetti: false
      },
      goud: {
        prize: 'goud',
        badge: 'Jij hebt goud gewonnen',
        title: 'Gefeliciteerd!<br>Jij hebt <span>goud</span> gewonnen',
        text: 'Jouw voucher hoort bij de categorie Goud.',
        buttonText: 'Ga naar de voordeelshop',
        buttonUrl: 'https://ola.touchtickets.nl/nl/catalogue/',
        rotation: -90,
        frameBg: '#d4af37',
        confetti: true
      },
      zilver: {
        prize: 'zilver',
        badge: 'Jij hebt zilver gewonnen',
        title: 'Gefeliciteerd!<br>Jij hebt <span>zilver</span> gewonnen',
        text: 'Jouw voucher hoort bij de categorie Zilver.',
        buttonText: 'Ga naar de voordeelshop',
        buttonUrl: 'https://ola.touchtickets.nl/nl/catalogue/',
        rotation: -270,
        frameBg: '#bfc7ce',
        confetti: true
      },
      platinum: {
        prize: 'platinum',
        badge: 'Jij hebt platinum gewonnen',
        title: 'Gefeliciteerd!<br>Jij hebt <span>platinum</span> gewonnen',
        text: 'Jouw voucher hoort bij de categorie Platinum.',
        buttonText: 'Ga naar de voordeelshop',
        buttonUrl: 'https://ola.touchtickets.nl/nl/catalogue/',
        rotation: -180,
        frameBg: '#7e8a97',
        confetti: true
      }
    };

    var current = states.brons;

    if (prefix === 'TESTG') {
      current = states.goud;
    } else if (prefix === 'TESP') {
      current = states.platinum;
    } else if (prefix === 'TESTZ') {
      current = states.zilver;
    } else if (prefix === 'TESTB') {
      current = states.brons;
    }

    startButton.addEventListener('click', function () {
      if (hasStarted) return;
      hasStarted = true;

      startButton.disabled = true;
      startButton.textContent = 'Het rad draait...';

      var spinDuration = 4200;
      var isMobile = window.innerWidth <= 920;
      var rotationOffset = isMobile ? 90 : 0;
      var finalRotation = (360 * 3) + current.rotation + rotationOffset;

      setTimeout(function () {
        wheel.style.setProperty('--ola-spinhero-wheel-rotation', finalRotation + 'deg');
      }, 100);

      setTimeout(function () {
        frame.style.setProperty('--ola-spinhero-frame-bg', current.frameBg);
        badge.textContent = current.badge;
        title.innerHTML = current.title;
        text.textContent = current.text;

        voucherCodeBox.textContent = voucherCode ? voucherCode : 'Geen code gevonden';
        voucherWrap.classList.remove('ola-spinhero__voucher-box--hidden');

        resultButton.textContent = current.buttonText;
        resultButton.href = current.buttonUrl;
        resultButton.classList.remove('ola-spinhero__button--hidden');

        startButton.classList.add('ola-spinhero__button--hidden');

        if (current.confetti) {
          hero.classList.add('ola-spinhero--confetti');
          createConfetti();
        }
      }, 100 + spinDuration);
    });
  }

  initOlaSpinHero();
})();
