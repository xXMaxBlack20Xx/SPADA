export const nflTeamToAbbrev: Record<string, string> = {
    // NFC East
    'Dallas Cowboys': 'DAL',
    'New York Giants': 'NYG',
    'Philadelphia Eagles': 'PHI',
    'Washington Commanders': 'WAS',

    // NFC North
    'Chicago Bears': 'CHI',
    'Detroit Lions': 'DET',
    'Green Bay Packers': 'GB',
    'Minnesota Vikings': 'MIN',

    // NFC South
    'Atlanta Falcons': 'ATL',
    'Carolina Panthers': 'CAR',
    'New Orleans Saints': 'NO',
    'Tampa Bay Buccaneers': 'TB',

    // NFC West
    'Arizona Cardinals': 'ARI',
    'Los Angeles Rams': 'LA',
    'San Francisco 49ers': 'SF',
    'Seattle Seahawks': 'SEA',

    // AFC East
    'Buffalo Bills': 'BUF',
    'Miami Dolphins': 'MIA',
    'New England Patriots': 'NE',
    'New York Jets': 'NYJ',

    // AFC North
    'Baltimore Ravens': 'BAL',
    'Cincinnati Bengals': 'CIN',
    'Cleveland Browns': 'CLE',
    'Pittsburgh Steelers': 'PIT',

    // AFC South
    'Houston Texans': 'HOU',
    'Indianapolis Colts': 'IND',
    'Jacksonville Jaguars': 'JAX',
    'Tennessee Titans': 'TEN',

    // AFC West
    'Denver Broncos': 'DEN',
    'Kansas City Chiefs': 'KC',
    'Las Vegas Raiders': 'LV',
    'Los Angeles Chargers': 'LAC',
};

export const toAbbrev = (name: string): string => {
    if (!name) return 'UNK';

    // If it's already an abbreviation (2-3 uppercase chars), return it
    if (name.length <= 3 && name === name.toUpperCase()) {
        return name;
    }

    const abbrev = nflTeamToAbbrev[name];

    return abbrev || name.substring(0, 3).toUpperCase();
};
