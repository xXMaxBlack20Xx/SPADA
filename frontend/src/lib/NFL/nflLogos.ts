export const nflLogos: Record<string, string> = {
    // NFC East
    DAL: 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png',
    NYG: 'https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png',
    PHI: 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png',
    WAS: 'https://a.espncdn.com/i/teamlogos/nfl/500/was.png',

    // NFC North
    CHI: 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png',
    DET: 'https://a.espncdn.com/i/teamlogos/nfl/500/det.png',
    GB: 'https://a.espncdn.com/i/teamlogos/nfl/500/gb.png',
    MIN: 'https://a.espncdn.com/i/teamlogos/nfl/500/min.png',

    // NFC South
    ATL: 'https://a.espncdn.com/i/teamlogos/nfl/500/atl.png',
    CAR: 'https://a.espncdn.com/i/teamlogos/nfl/500/car.png',
    NO: 'https://a.espncdn.com/i/teamlogos/nfl/500/no.png',
    TB: 'https://a.espncdn.com/i/teamlogos/nfl/500/tb.png',

    // NFC West
    ARI: 'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png',
    LA: 'https://a.espncdn.com/i/teamlogos/nfl/500/lar.png',
    SF: 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png',
    SEA: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png',

    // AFC East
    BUF: 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png',
    MIA: 'https://a.espncdn.com/i/teamlogos/nfl/500/mia.png',
    NE: 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png',
    NYJ: 'https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png',

    // AFC North
    BAL: 'https://a.espncdn.com/i/teamlogos/nfl/500/bal.png',
    CIN: 'https://a.espncdn.com/i/teamlogos/nfl/500/cin.png',
    CLE: 'https://a.espncdn.com/i/teamlogos/nfl/500/cle.png',
    PIT: 'https://a.espncdn.com/i/teamlogos/nfl/500/pit.png',

    // AFC South
    HOU: 'https://a.espncdn.com/i/teamlogos/nfl/500/hou.png',
    IND: 'https://a.espncdn.com/i/teamlogos/nfl/500/ind.png',
    JAX: 'https://a.espncdn.com/i/teamlogos/nfl/500/jax.png',
    TEN: 'https://a.espncdn.com/i/teamlogos/nfl/500/ten.png',

    // AFC West
    DEN: 'https://a.espncdn.com/i/teamlogos/nfl/500/den.png',
    KC: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png',
    LV: 'https://a.espncdn.com/i/teamlogos/nfl/500/lv.png',
    LAC: 'https://a.espncdn.com/i/teamlogos/nfl/500/lac.png',
};

export const getNFLLogo = (teamCode: string): string | null => {
    return nflLogos[teamCode] || null;
};
