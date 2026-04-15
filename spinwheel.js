<script>
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

    if (!hero || !wheel || !badge || !title || !text || !startButton || !resultButton || !voucherWrap || !voucherCodeBox || !prizeValueBox || !confettiLayer) {
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

      var colors = ['#f58220', '#d62828', '#ffffff', '#1d4ed8'];
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
      return isNaN(parsed) ? 0 : parsed;
    }

    var voucherCodeRaw = voucherCodeBox.textContent || '';
    var voucherCode = cleanVoucherCode(voucherCodeRaw);

    var prizeValueRaw = prizeValueBox.textContent || '';
    var prizeValue = cleanPrizeValue(prizeValueRaw);

    var states = {
      0: {
        badge: 'Helaas, geen prijs',
        title: 'Deze keer <br> helaas <span>geen prijs</span>',
        text: 'Je hebt deze ronde geen Club Lions punten gewonnen, maar leuk dat je hebt meegedaan aan de STG Koningsdagactie.',
        buttonText: 'Bekijk de STG voordeelshop',
        buttonUrl: 'https://ola.touchtickets.nl/nl/catalogue/',
        rotation: -90,
        confetti: false
      },
      10: {
        badge: 'Yes, je hebt gewonnen',
        title: 'Gefeliciteerd!<br>Jij hebt <span>10 Club Lions punten</span> gewonnen',
        text: 'Goed nieuws: je hebt 10 Club Lions punten gewonnen in de STG Koningsdagactie.',
        buttonText: 'Ga naar de STG voordeelshop',
        buttonUrl: 'https://ola.touchtickets.nl/nl/catalogue/',
        rotation: -180,
        confetti: true
      },
      50: {
        badge: 'Yes, je hebt gewonnen',
        title: 'Gefeliciteerd!<br>Jij hebt <span>50 Club Lions punten</span> gewonnen',
        text: 'Top! Je hebt 50 Club Lions punten gewonnen in de STG Koningsdagactie.',
        buttonText: 'Ga naar de STG voordeelshop',
        buttonUrl: 'https://ola.touchtickets.nl/nl/catalogue/',
        rotation: -270,
        confetti: true
      },
      100: {
        badge: 'Geweldig, hoofdprijs',
        title: 'Gefeliciteerd!<br>Jij hebt <span>100 Club Lions punten</span> gewonnen',
        text: 'Fantastisch! Je hebt 100 Club Lions punten gewonnen in de STG Koningsdagactie.',
        buttonText: 'Ga naar de STG voordeelshop',
        buttonUrl: 'https://ola.touchtickets.nl/nl/catalogue/',
        rotation: 0,
        confetti: true
      }
    };

    var current = states[prizeValue] || states[0];

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

        voucherCodeBox.textContent = voucherCode || 'Geen code beschikbaar';
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
</script>
