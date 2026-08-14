(() => {
    const screens = document.querySelectorAll('.screen');

    function showScreen(name) {
        screens.forEach((screen) => {
            screen.classList.remove('active');
        });
        const target = document.querySelector(`[data-screen="${name}"]`);
        if (target) {
            target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    }

    document.getElementById('btn-to-alternatives').addEventListener('click', () => {
        showScreen('alternatives');
    });

    const nextBtn = document.getElementById('btn-to-confirm');
    nextBtn.addEventListener('click', () => {
        renderSummary();
        showScreen('confirm');
    });

    document.querySelectorAll('[data-back]').forEach((btn) => {
        btn.addEventListener('click', () => {
            showScreen(btn.dataset.back);
        });
    });

    const FLUFF_LABELS = ['Non toccarmi', 'Che schifo', 'Chiamo la polizia degli Alpaca', 'Finiscila', 'Jamila STOP', 'Hai delle belle mani, davvero (sono Francesco).'];
    const FLUFF_MAX = 5;

    const alpacaCard = document.querySelector('[data-card="alpaca"]');
    const fluffBtn = alpacaCard.querySelector('[data-fluff-btn]');
    const fluffFill = alpacaCard.querySelector('[data-fluff-fill]');
    const fluffCount = alpacaCard.querySelector('[data-fluff-count]');
    const fluffLabel = alpacaCard.querySelector('[data-fluff-label]');
    let fluffValue = 0;

    fluffBtn.addEventListener('click', () => {
        if (fluffValue >= FLUFF_MAX) return;
        fluffValue += 1;
        fluffCount.textContent = fluffValue;
        fluffFill.style.width = `${(fluffValue / FLUFF_MAX) * 100}%`;
        const labelIndex = Math.min(
            FLUFF_LABELS.length - 1,
            Math.ceil((fluffValue / FLUFF_MAX) * (FLUFF_LABELS.length - 1))
        );
        fluffLabel.textContent = FLUFF_LABELS[labelIndex];
        if (fluffValue >= FLUFF_MAX) {
            fluffBtn.textContent = '';
            const emoji = document.createElement('span');
            emoji.className = 'fluff-emoji';
            emoji.textContent = '🎉';
            fluffBtn.appendChild(emoji);
            fluffBtn.append(' Coccole massime');
        }
    });

    const tisanaCard = document.querySelector('[data-card="tisana"]');
    const chips = tisanaCard.querySelectorAll('[data-chip]');
    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            chips.forEach((c) => c.classList.remove('is-active'));
            chip.classList.add('is-active');
        });
    });

    const giroCard = document.querySelector('[data-card="giro"]');
    const segments = giroCard.querySelectorAll('[data-segment]');
    segments.forEach((segment) => {
        segment.addEventListener('click', () => {
            segments.forEach((s) => s.classList.remove('is-active'));
            segment.classList.add('is-active');
        });
    });

    const favToggles = document.querySelectorAll('[data-fav]');

    function updateNextButtonState() {
        const anySelected = document.querySelectorAll('.card.is-selected').length > 0;
        nextBtn.disabled = !anySelected;
    }

    const ratings = {};
    document.querySelectorAll('.card').forEach((card) => {
        const cardName = card.dataset.card;
        const pills = card.querySelectorAll('[data-rating]');
        pills.forEach((pill) => {
            pill.addEventListener('click', () => {
                pills.forEach((p) => p.classList.remove('is-active'));
                pill.classList.add('is-active');
                ratings[cardName] = pill.dataset.rating;
            });
        });
    });

    favToggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const card = toggle.closest('.card');
            const pressed = toggle.getAttribute('aria-pressed') === 'true';
            toggle.setAttribute('aria-pressed', String(!pressed));
            card.classList.toggle('is-selected', !pressed);
            updateNextButtonState();
        });
    });

    const CARD_META = {
        alpaca: { title: 'Alpaca a Venusio' },
        tisana: { title: 'Tisana al bar e dolcetto' },
        giro: { title: 'Giro in un posto poco affollato' },
        nulla: { title: 'Non usciamo' },
    };

    function getCardDetail(cardName) {
        const parts = [];
        if (cardName === 'alpaca') {
            parts.push(fluffValue > 0
                ? `Livello coccole: ${FLUFF_LABELS[Math.min(FLUFF_LABELS.length - 1, Math.ceil((fluffValue / FLUFF_MAX) * (FLUFF_LABELS.length - 1)))]}`
                : 'Livello coccole non ancora impostato');
        } else if (cardName === 'tisana') {
            const chosenChip = tisanaCard.querySelector('[data-chip].is-active');
            parts.push(chosenChip ? `Dolcetto scelto: ${chosenChip.textContent}` : 'Nessun dolcetto scelto ancora');
        } else if (cardName === 'giro') {
            const active = giroCard.querySelector('[data-segment].is-active');
            parts.push(active ? `Ritmo: ${active.textContent}` : 'Ritmo non ancora scelto');
        }
        if (ratings[cardName]) {
            parts.push(`Voto: ${ratings[cardName]}/10`);
        }
        return parts.join(' · ');
    }

    const summaryList = document.getElementById('summary-list');

    function renderSummary() {
        summaryList.innerHTML = '';

        document.querySelectorAll('.card').forEach((card) => {
            const name = card.dataset.card;
            const isPicked = card.classList.contains('is-selected');

            const item = document.createElement('div');
            item.className = 'summary-item';
            item.classList.toggle('is-picked', isPicked);

            const title = document.createElement('h4');
            title.textContent = CARD_META[name].title + (isPicked ? ' 💚' : '');
            item.appendChild(title);

            const detailText = getCardDetail(name);
            if (detailText) {
                const detail = document.createElement('p');
                detail.textContent = detailText;
                item.appendChild(detail);
            }

            summaryList.appendChild(item);
        });
    }

    const confettiLayer = document.getElementById('confetti-layer');
    const confirmBlock = document.getElementById('confirm-block');
    const finalMessage = document.getElementById('final-message');
    const btnConfirm = document.getElementById('btn-confirm');
    const btnRestart = document.getElementById('btn-restart');

    const CONFETTI_COLORS = ['#84cc16', '#65a30d', '#4d7c0f', '#ecfccb', '#e5e5e5', '#a3a3a3'];

    function launchConfetti() {
        const pieceCount = 60;
        for (let i = 0; i < pieceCount; i += 1) {
            const piece = document.createElement('span');
            piece.className = 'confetti-piece';
            const size = 6 + Math.random() * 8;
            piece.style.width = `${size}px`;
            piece.style.height = `${size * (Math.random() > 0.5 ? 1 : 2.2)}px`;
            piece.style.left = `${Math.random() * 100}vw`;
            piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            piece.style.animationDuration = `${2.2 + Math.random() * 1.6}s`;
            piece.style.animationDelay = `${Math.random() * 0.4}s`;
            confettiLayer.appendChild(piece);
        }
        setTimeout(() => {
            confettiLayer.innerHTML = '';
        }, 4200);
    }

    btnConfirm.addEventListener('click', () => {
        launchConfetti();
        confirmBlock.hidden = true;
        finalMessage.hidden = false;
    });

    btnRestart.addEventListener('click', () => {
        fluffValue = 0;
        fluffCount.textContent = '0';
        fluffFill.style.width = '0%';
        fluffLabel.textContent = FLUFF_LABELS[0];
        fluffBtn.innerHTML = '<span class="fluff-emoji">🤍</span> Coccola';

        chips.forEach((chip) => chip.classList.remove('is-active'));
        segments.forEach((s) => s.classList.remove('is-active'));

        document.querySelectorAll('[data-rating].is-active').forEach((pill) => pill.classList.remove('is-active'));
        Object.keys(ratings).forEach((key) => delete ratings[key]);

        favToggles.forEach((toggle) => {
            toggle.setAttribute('aria-pressed', 'false');
            toggle.closest('.card').classList.remove('is-selected');
        });
        updateNextButtonState();

        finalMessage.hidden = true;
        confirmBlock.hidden = false;

        showScreen('hero');
    });
})();