// =====================================================================
//  CONFIGURATION CLIENT — seul fichier à modifier pour un nouveau client
//  Après modification : `node scripts/build.mjs` (génère dist/index.html)
//  Photo du titulaire : assets/client/
// =====================================================================

export default {
    // --- Titulaire ------------------------------------------------------
    holder: {
        name: 'Rafael Montero',
        cedula: '001-1140005-7',
        // Photo : fichier dans assets/client/. null = monogramme (initiales).
        photo: 'assets/client/titular.jpg',
        photoPosition: '50% 18%',          // cadrage CSS object-position
    },

    // --- Comptes bancaires --------------------------------------------
    // bank : clé du catalogue src/banks.mjs (banreservas, popular, bhd, apap, adopem)
    // type : 'ahorro' | 'corriente'
    accounts: [
        { bank: 'bhd', type: 'ahorro', number: '14836250015' },
        { bank: 'banreservas', type: 'ahorro', number: '9609341896' },
        { bank: 'popular', type: 'ahorro', number: '768724890' },
    ],

    // --- SEO / Open Graph -----------------------------------------------
    meta: {
        title: 'Portal de Transferencia Ing. Montero',
        description: 'Portal de transferencia simple, claro y seguro.',
        // URL de production absolue (ex. 'https://xxx.vercel.app/') —
        // nécessaire pour l'aperçu WhatsApp. Vide tant qu'elle n'existe pas.
        url: '',
    },
};
