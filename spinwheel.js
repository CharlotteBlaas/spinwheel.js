(function () {
  var attempts = 0;
  var maxAttempts = 20;
  var retryDelay = 300;
  var hasStarted = false;

  function initOlaSpinHero() {
    var hero = document.getElementById('olaSpinHero');
    var wheel = document.getElementById('olaSpinHeroWheel');
    var badge = document.getElementById('olaSpinHeroBadge');
    var title = document.getElementById('olaSpinHeroTitle');
    var text = document.getElementById('olaSpinHeroText');
    var startButton = document.getElementById('olaSpinHeroStartButton');
    var resultButton = document.getElementById('olaSpinHeroButton');
    var voucherWrap = document.getElementById('olaSpinHeroVoucherWrap');
    var voucherCodeBox = document.getElementById('olaSpinHeroVoucherCode');
    var confettiLayer = document.getElementById('olaSpinHeroConfetti');
    var prizeValueBox = document.getElementById('olaSpinHeroPrizeValue');

    if (
      !hero ||
      !wheel ||
      !badge ||
      !title ||
      !text ||
      !startButton ||
      !resultButton ||
      !voucherWrap ||
      !voucherCodeBox ||
      !confettiLayer ||
      !prizeValueBox
    ) {
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
      confettiLayer.innerHTML = '';
      var colors = ['#FF4B4B', '#FFFFFF', '#21468B', '#FF8C00', '#FFA500', '#E63946'];
      var pieces = 140;

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
      return (value || '').trim();
    }

    function cleanPrizeValue(value) {
      var parsed = parseInt((value || '').replace(/[^\d-]/g, ''), 10);
      return isNaN(parsed) ? -1 : parsed;
    }

    var voucherCode = cleanVoucherCode(voucherCodeBox.textContent || '');
    var prizeValue = cleanPrizeValue(prizeValueBox.textContent || '');

    var states = {
      none: {
        badge: 'Helaas!',
        title: 'Helaas!<br>Vandaag <span>geen Lion punten</span>.',
        text: 'Vandaag geen Lion punten, maar blijf Club Lion volgen. Er komen regelmatig nieuwe acties en beloningen.',
        buttonText: 'Blijf Club Lion volgen',
        buttonUrl: 'https://www.my-stglions.nl/',
        rotation: -90,
        confetti: false,
        showVoucher: false
      },
      10: {
        badge: 'Gefeliciteerd',
        title: 'Gefeliciteerd<br>Je hebt <span>10 Lion punten</span> gewonnen!',
        text: 'Kopieer de code en verzilver deze bij Voucher claimen. (Deze code is persoonlijk en éénmalig te gebruiken.)',
        buttonText: 'Voucher claimen',
        buttonUrl: 'https://www.my-stglions.nl/Voucher/',
        rotation: 180,
        confetti: true,
        showVoucher: true
      },
      20: {
        badge: 'Gefeliciteerd',
        title: 'Gefeliciteerd<br>Je hebt <span>20 Lion punten</span> gewonnen!',
        text: 'Kopieer de code en verzilver deze bij Voucher claimen. (Deze code is persoonlijk en éénmalig te gebruiken.)',
        buttonText: 'Voucher claimen',
        buttonUrl: 'https://www.my-stglions.nl/Voucher/',
        rotation: 0,
        confetti: true,
        showVoucher: true
      },
      50: {
        badge: 'Gefeliciteerd',
        title: 'Gefeliciteerd<br>Je hebt <span>50 Lion punten</span> gewonnen!',
        text: 'Kopieer de code en verzilver deze bij Voucher claimen. (Deze code is persoonlijk en éénmalig te gebruiken.)',
        buttonText: 'Voucher claimen',
        buttonUrl: 'https://www.my-stglions.nl/Voucher/',
        rotation: 90,
        confetti: true,
        showVoucher: true
      }
    };

    var current = states[prizeValue] || states.none;

    startButton.addEventListener('click', function () {
      if (hasStarted) return;
      hasStarted = true;

      startButton.disabled = true;
      startButton.textContent = 'Het rad draait...';

      hero.classList.remove('ola-spinhero--confetti');
      confettiLayer.innerHTML = '';

      var spinDuration = 4200;
      var isMobile = window.innerWidth <= 920;
      var rotationOffset = isMobile ? 90 : 0;
      var finalRotation = (360 * 3) + current.rotation + rotationOffset;

      setTimeout(function () {
        wheel.style.setProperty('--ola-spinhero-wheel-rotation', finalRotation + 'deg');
      }, 100);

      setTimeout(function () {
        badge.textContent = current.badge;
        title.innerHTML = current.title;
        text.textContent = current.text;

        if (current.showVoucher) {
          voucherCodeBox.textContent = voucherCode || 'Geen code beschikbaar';
          voucherWrap.classList.remove('ola-spinhero__voucher-box--hidden');
        } else {
          voucherWrap.classList.add('ola-spinhero__voucher-box--hidden');
        }

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
