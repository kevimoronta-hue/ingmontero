// =====================================================================
//  CATALOGUE DES BANQUES — commun à tous les portails
//  Une entrée = logo + palette de carte + ouverture de l'app bancaire.
//  Pour ajouter une banque : logo dans assets/banks/, puis une entrée ici.
//
//  iOS (testé sur iPhone réel) :
//    iosScheme  → schéma custom validé physiquement (popup "Ouvrir dans…")
//    appLink    → Universal Link vérifié (AASA) — utilisé si pas d'iosScheme
//    iosStore   → fiche App Store (fallback iOS)
//
//  Android — le package est la source de vérité (androidApp()) :
//    packageName → package vérifié sur Google Play
//    directLink  → ouverture directe de l'app, UNIQUEMENT si confirmée :
//                  App Link https (assetlinks.json) ou schéma custom testé sur Android
//    marketUrl   → market://details?id=<package>  — fiche Play Store (validé physiquement)
//    storeUrl    → https://play.google.com/store/apps/details?id=<package> — fallback final
// =====================================================================

/**
 * Construit la config Android d'une banque à partir de son package.
 * opts.plain = true → le directLink est ouvert tel quel (sans intent) — cas BHD.
 */
function androidApp(packageName, directLink = null, opts = {}) {
    return {
        packageName,
        directLink,
        directLinkPlain: !!opts.plain,
        marketUrl: `market://details?id=${packageName}`,
        storeUrl: `https://play.google.com/store/apps/details?id=${packageName}`,
    };
}

export default {
    banreservas: {
        name: 'Banreservas',
        logo: 'assets/banks/banreservas.png',
        colors: { c1: '#0B72BC', c2: '#04264A', accent: '#22C3F3' },
        iosScheme: 'tubancoapp://',   // validé iPhone 2026-10-12
        appLink: null,
        iosStore: 'https://apps.apple.com/do/app/banreservas/id1170610154',
        android: androidApp('com.banreservas.tubancoappmobile'),   // market:// validé Android 2026-10-12
    },
    popular: {
        name: 'Banco Popular',
        logo: 'assets/banks/popular.png',
        colors: { c1: '#1A3F98', c2: '#060F33', accent: '#5C8DFF' },
        iosScheme: 'popular://',   // validé iPhone 2026-10-12
        appLink: null,
        iosStore: 'https://apps.apple.com/do/app/banco-popular-dominicano/id583475424',
        android: androidApp('com.popular.app.android'),   // market:// validé Android 2026-10-12
    },
    bhd: {
        name: 'Banco BHD',
        logo: 'assets/banks/bhd.png',
        colors: { c1: '#0E8C47', c2: '#032B16', accent: '#5BE08F' },
        // Lien direct BHD, prioritaire sur iOS ET Android (ouvre l'app ; sinon page officielle BHD)
        appLink: 'https://link.bhd.com.do/',
        iosStore: null,
        android: androidApp('com.artech.infocorp_bhd.bhd', 'https://link.bhd.com.do/', { plain: true }),
    },
    apap: {
        name: 'Asociación APAP',
        logo: 'assets/banks/apap.png',
        colors: { c1: '#2459B8', c2: '#0A1A3C', accent: '#F5C518', glow: '#4F8BEA' },
        appLink: 'https://movil.apap.com.do/',
        iosStore: null,
        // App Link vérifié (assetlinks.json + Google Digital Asset Links)
        android: androidApp('com.apapmovilprod', 'https://movil.apap.com.do/'),
    },
    adopem: {
        name: 'Banco Adopem',
        logo: 'assets/banks/adopem.png',
        colors: { c1: '#E8701A', c2: '#5E2203', accent: '#FFB066' },
        appLink: null,
        iosStore: 'https://apps.apple.com/do/app/appdopem/id1516815961',
        android: androidApp('org.mfbbva.mobile.adp'),   // market:// validé Android 2026-10-12
    },
};
