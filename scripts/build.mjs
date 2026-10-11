// =====================================================================
//  BUILD — génère dist/ (HTML statique) depuis portal.config.mjs
//  Usage : node scripts/build.mjs
//  Structure identique au portail validé (lcdamoronta) : seules les
//  données client changent. Le HTML est rendu au build pour que
//  WhatsApp / Facebook lisent le titre et l'image Open Graph.
// =====================================================================

import { writeFile, mkdir, cp, rm, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const { holder, accounts, meta } = (await import(path.join(root, 'portal.config.mjs'))).default;
const banks = (await import(path.join(root, 'src/banks.mjs'))).default;
const scalia = (await import(path.join(root, 'src/scalia.mjs'))).default;

const ACCOUNT_TYPES = {
    ahorro: { label: 'Ahorro', icon: 'fa-piggy-bank' },
    corriente: { label: 'Corriente', icon: 'fa-building-columns' },
};

// ---------------------------------------------------------------------
//  Helpers
// ---------------------------------------------------------------------
const esc = (v = '') => String(v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const absolute = (p) => (meta.url ? new URL(p, meta.url).href : p);
const waLink = (number, message) => `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

const copyButton = (value, label, bankKey) => `
                <button class="copy-button btn-gold btn-gold--compact" data-copy="${esc(value)}"${bankKey ? ` data-bank="${esc(bankKey)}"` : ''} aria-label="${esc(label)}">
                    <i class="fa-regular fa-copy"></i>
                    <span class="btn-text">Copiar</span>
                </button>`;

// ---------------------------------------------------------------------
//  Composants
// ---------------------------------------------------------------------
function IdentityCard() {
    const photo = holder.photo
        ? `<img src="${esc(holder.photo)}" alt="${esc(holder.name)}" width="640" height="800" style="object-position:${esc(holder.photoPosition || '50% 18%')}">`
        : `<span class="identity-monogram" aria-hidden="true">${esc(initials(holder.name))}</span>`;
    return `
            <section class="card identity-card" aria-label="Titular de las cuentas">
                <figure class="identity-photo${holder.photo ? '' : ' identity-photo--placeholder'}">
                    ${photo}
                </figure>
                <div class="identity-info">
                    <span class="label">Titular de las cuentas</span>
                    <p class="identity-name">${esc(holder.name)}</p>
                    <div class="identity-id">
                        <div>
                            <span class="label">Cédula</span>
                            <span class="identity-id-value">${esc(holder.cedula)}</span>
                        </div>${copyButton(holder.cedula, 'Copiar cédula').replace(/\n {16}/g, '\n                        ')}
                    </div>
                </div>
            </section>`;
}

function BankCard(account) {
    const bank = banks[account.bank];
    if (!bank) throw new Error(`Banque inconnue "${account.bank}" — voir src/banks.mjs`);
    const type = ACCOUNT_TYPES[account.type] || ACCOUNT_TYPES.ahorro;
    const { c1, c2, accent, glow } = bank.colors;
    const vars = `--c1:${c1};--c2:${c2};--accent:${accent}${glow ? `;--glow:${glow}` : ''}`;
    return `
            <article class="card bank-card" style="${vars}">
                <div class="bank-logo"><img src="${esc(bank.logo)}" alt="${esc(bank.name)}"></div>
                <div class="account-number">
                    <div class="account-meta">
                        <span class="label">Número de cuenta</span>
                        <span class="account-type"><i class="fa-solid ${type.icon}" aria-hidden="true"></i>${type.label}</span>
                    </div>
                    <span class="number">${esc(account.number)}</span>
                </div>${copyButton(account.number, `Copiar cuenta ${bank.name}`, account.bank)}
            </article>`;
}

// ---------------------------------------------------------------------
//  Page
// ---------------------------------------------------------------------
const ogImage = absolute(scalia.ogImage);
const usedBanks = Object.fromEntries(accounts.map((a) => {
    const { appLink, androidPackage, androidStore, iosStore } = banks[a.bank] || {};
    return [a.bank, { appLink, androidPackage, androidStore, iosStore }];
}));

const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
    <meta name="theme-color" content="#F6EEDF">
    <title>${esc(meta.title)}</title>
    <meta name="description" content="${esc(meta.description)}">${meta.url ? `
    <link rel="canonical" href="${esc(meta.url)}">` : ''}

    <!-- Open Graph -->
    <meta property="og:type" content="website">${meta.url ? `
    <meta property="og:url" content="${esc(meta.url)}">` : ''}
    <meta property="og:title" content="${esc(meta.title)}">
    <meta property="og:description" content="${esc(meta.description)}">
    <meta property="og:image" content="${esc(ogImage)}">
    <meta property="og:image:secure_url" content="${esc(ogImage)}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${esc(scalia.ogImageAlt)}">
    <meta property="og:locale" content="es_DO">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(meta.title)}">
    <meta name="twitter:description" content="${esc(meta.description)}">
    <meta name="twitter:image" content="${esc(ogImage)}">
    <meta name="twitter:image:alt" content="${esc(scalia.ogImageAlt)}">

    <link rel="preload" as="image" href="assets/shared/scalia-bg-mobile.jpg" media="(max-width: 899px)">
    <link rel="preload" as="image" href="assets/shared/scalia-bg-desktop.jpg" media="(min-width: 900px)">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
    <div class="backdrop" aria-hidden="true"></div>

    <div class="page">

        <!-- Colonne identité -->
        <aside class="identity-col">
            <header class="page-header">
                <span class="eyebrow">Datos para transferencias</span>
                <h1 class="page-title">Cuentas<br class="title-break"> bancarias</h1>
            </header>
${IdentityCard()}

            <p class="hint">
                <i class="fa-solid fa-hand-pointer"></i>
                <span>Toca <strong>Copiar</strong>: el número se copia y se abre la app de tu banco.</span>
            </p>
        </aside>

        <!-- Colonne comptes -->
        <main class="accounts" id="cards-container">
${accounts.map(BankCard).join('\n')}

        </main>

        <footer class="page-footer" role="contentinfo">
            <div class="footer-center">
                <a href="${esc(scalia.url)}" target="_blank" rel="noopener noreferrer" class="powered-link" aria-label="Powered by Scalia — visitar ${esc(new URL(scalia.url).host)}">
                    <img src="assets/shared/powered-by-scalia-gold.png" alt="Powered by Scalia" width="900" height="264">
                </a>
            </div>
            <img src="assets/shared/scaly.webp" alt="" class="scaly" width="321" height="420" aria-hidden="true">
            <a class="cta-whatsapp btn-gold btn-gold--large" href="${esc(waLink(scalia.cta.whatsapp, scalia.cta.message))}" target="_blank" rel="noopener noreferrer">${esc(scalia.cta.label)}</a>
        </footer>
    </div>

    <script>window.PORTAL_BANKS = ${JSON.stringify(usedBanks)};</script>
    <script src="app.js"></script>
</body>
</html>
`;

// ---------------------------------------------------------------------
//  Sortie
// ---------------------------------------------------------------------
const required = [holder.photo, scalia.ogImage, ...accounts.map((a) => banks[a.bank]?.logo)].filter(Boolean);
for (const p of required) {
    await access(path.join(root, p)).catch(() => { throw new Error(`Fichier manquant : ${p}`); });
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await writeFile(path.join(dist, 'index.html'), html);
await cp(path.join(root, 'src/styles.css'), path.join(dist, 'styles.css'));
await cp(path.join(root, 'src/app.js'), path.join(dist, 'app.js'));
await cp(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true });

console.log(`✓ dist/ généré — ${holder.name} · ${accounts.length} compte(s)`);
if (!meta.url) console.warn('⚠ meta.url vide : og:image relative — renseigner l\'URL de prod pour l\'aperçu WhatsApp.');
if (!holder.photo) console.warn('ℹ holder.photo vide : monogramme affiché.');
