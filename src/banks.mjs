// =====================================================================
//  CATALOGUE DES BANQUES — commun à tous les portails
//  Une entrée = logo + palette de carte + ouverture de l'app bancaire.
//  Pour ajouter une banque : logo dans assets/banks/, puis une entrée ici.
//
//  Ouverture de l'app (testé sur appareils réels) :
//    appLink         → HTTPS Universal Link / App Link vérifié (iOS + Android)
//    androidPackage  → intent:// avec repli Play Store (Chrome Android)
//    iosStore        → fiche App Store (aucun lien profond iOS vérifié)
// =====================================================================

export default {
    banreservas: {
        name: 'Banreservas',
        logo: 'assets/banks/banreservas.png',
        colors: { c1: '#0B72BC', c2: '#04264A', accent: '#22C3F3' },
        appLink: null,
        androidPackage: 'com.banreservas.tubancoappmobile',
        androidStore: 'https://play.google.com/store/apps/details?id=com.banreservas.tubancoappmobile',
        iosStore: 'https://apps.apple.com/do/app/banreservas/id1170610154',
    },
    popular: {
        name: 'Banco Popular',
        logo: 'assets/banks/popular.png',
        colors: { c1: '#1A3F98', c2: '#060F33', accent: '#5C8DFF' },
        appLink: null,
        androidPackage: 'com.popular.app.android',
        androidStore: 'https://play.google.com/store/apps/details?id=com.popular.app.android',
        iosStore: 'https://apps.apple.com/do/app/banco-popular-dominicano/id583475424',
    },
    bhd: {
        name: 'Banco BHD',
        logo: 'assets/banks/bhd.png',
        colors: { c1: '#0E8C47', c2: '#032B16', accent: '#5BE08F' },
        appLink: 'https://link.bhd.com.do/',
        androidPackage: null,
        androidStore: null,
        iosStore: null,
    },
    apap: {
        name: 'Asociación APAP',
        logo: 'assets/banks/apap.png',
        colors: { c1: '#2459B8', c2: '#0A1A3C', accent: '#F5C518', glow: '#4F8BEA' },
        appLink: 'https://movil.apap.com.do/',
        androidPackage: null,
        androidStore: null,
        iosStore: null,
    },
    adopem: {
        name: 'Banco Adopem',
        logo: 'assets/banks/adopem.png',
        colors: { c1: '#E8701A', c2: '#5E2203', accent: '#FFB066' },
        appLink: null,
        androidPackage: 'org.mfbbva.mobile.adp',
        androidStore: 'https://play.google.com/store/apps/details?id=org.mfbbva.mobile.adp',
        iosStore: 'https://apps.apple.com/do/app/appdopem/id1516815961',
    },
};
