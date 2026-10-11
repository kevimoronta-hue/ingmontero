// =====================================================================
//  PORTAL DE TRANSFERENCIA — comportement (copie + ouverture app bancaire)
//  Les données bancaires viennent de window.PORTAL_BANKS, injecté au build
//  depuis src/banks.mjs (seulement les banques utilisées par le client).
// =====================================================================

const BANKS = window.PORTAL_BANKS || {};

/**
 * Copie asynchrone dans le presse-papiers avec fallback robuste
 */
async function copyAccount(text) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback ci-dessous
        }
    }
    return fallbackCopy(text);
}

/**
 * Méthode de copie de secours pour contextes non sécurisés
 */
function fallbackCopy(text) {
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
    } catch (e) {
        console.error('Fallback copy error:', e);
        return false;
    }
}

/**
 * Déclenchement du feedback visuel "✓ Copiado"
 */
function showCopyFeedback(btn) {
    const icon = btn.querySelector('i');
    const textSpan = btn.querySelector('.btn-text');
    if (!icon || !textSpan) return;

    // État d'origine mémorisé une seule fois (double-clic rapide sans effet de bord)
    btn.dataset.origIcon ??= icon.className;
    btn.dataset.origText ??= textSpan.textContent;
    clearTimeout(btn._copyTimer);

    icon.className = 'fa-solid fa-check';
    textSpan.textContent = 'Copiado';
    btn.classList.add('is-copied');

    btn._copyTimer = setTimeout(() => {
        icon.className = btn.dataset.origIcon;
        textSpan.textContent = btn.dataset.origText;
        btn.classList.remove('is-copied');
    }, 1400);
}


/**
 * Returns true when running on Android (Chrome or Samsung Internet).
 * Used to select between Android intent and iOS App Store fallback.
 * APAP and BHD bypass this entirely via verified HTTPS App Links.
 */
function isAndroid() {
    return /android/i.test(navigator.userAgent);
}

/**
 * Action centralisée: Copier → Feedback → Ouvrir l'app.
 *
 * APAP / BHD (appLink set):
 *   iOS + Android → window.location.href vers le HTTPS App Link vérifié.
 *   L'OS intercèpte si l'app est installée (Universal Link / App Link confirmés ✅).
 *
 * Banreservas / Popular / Adopem:
 *   Android → intent avec package + S.browser_fallback_url Play Store
 *             Si app installée → app ouverte.
 *             Si app absente  → Play Store (fallback encodé dans l'intent).
 *   iOS     → App Store officiel (aucun Universal Link ou scheme vérifié disponible).
 *
 * Cédula (pas d'attribut data-bank) → copy-only, aucune navigation.
 */
async function copyAndOpenBank(btn) {
    const textToCopy = btn.getAttribute('data-copy');
    const bankKey = btn.getAttribute('data-bank');
    if (!textToCopy) return;

    // 1. Copier le numéro de compte
    await copyAccount(textToCopy);

    // 2. Afficher ✓ Copiado
    showCopyFeedback(btn);

    // 3. Ouvrir l'app bancaire — uniquement si data-bank présent (Cédula n'en a pas)
    if (!bankKey || !BANKS[bankKey]) return;

    const bank = BANKS[bankKey];

    if (bank.appLink) {
        // APAP / BHD — HTTPS App Link vérifié, fonctionne sur iOS et Android
        window.location.href = bank.appLink;

    } else if (isAndroid()) {
        // Banreservas / Popular / Adopem — Android
        // intent:// avec package + fallback Play Store encodé.
        // Chrome Android: ouvre l'app si installée, sinon redirige vers Play Store.
        const fallback = encodeURIComponent(bank.androidStore);
        window.location.href =
            `intent://#Intent;package=${bank.androidPackage};S.browser_fallback_url=${fallback};end;`;

    } else {
        // Banreservas / Popular / Adopem — iOS
        // Aucun Universal Link ni scheme vérifié → App Store officiel.
        window.location.href = bank.iosStore;
    }
}


// iOS Safari n'applique :active (feedback de pression) qu'avec un écouteur tactile.
document.addEventListener('touchstart', () => {}, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
    // 1. Animation d'entrée des cartes en cascade
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, 80 + (index * 60));
    });

    // 2. Écouteurs de clic sur les boutons de copie
    const buttons = document.querySelectorAll('.copy-button');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => copyAndOpenBank(btn));
    });
});
