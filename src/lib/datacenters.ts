export const DataCenters: Record<
	number,
	{
		name: string;
		worlds: Record<number, string>;
	}
> = {
	9: { name: 'Materia', worlds: { 21: 'Ravana', 22: 'Bismarck', 86: 'Sephirot', 87: 'Sophia', 88: 'Zurvan' } },
	3: {
		name: 'Mana',
		worlds: {
			23: 'Asura',
			28: 'Pandaemonium',
			44: 'Anima',
			47: 'Hades',
			48: 'Ixion',
			61: 'Titan',
			70: 'Chocobo',
			96: 'Masamune'
		}
	},
	10: {
		name: 'Meteor',
		worlds: {
			24: 'Belias',
			29: 'Shinryu',
			30: 'Unicorn',
			31: 'Yojimbo',
			32: 'Zeromus',
			52: 'Valefor',
			60: 'Ramuh',
			82: 'Mandragora'
		}
	},
	7: {
		name: 'Light',
		worlds: {
			33: 'Twintania',
			36: 'Lich',
			42: 'Zodiark',
			56: 'Phoenix',
			66: 'Odin',
			67: 'Shiva',
			402: 'Alpha',
			403: 'Raiden'
		}
	},
	8: {
		name: 'Crystal',
		worlds: {
			34: 'Brynhildr',
			37: 'Mateus',
			41: 'Zalera',
			62: 'Diabolos',
			74: 'Coeurl',
			75: 'Malboro',
			81: 'Goblin',
			91: 'Balmung'
		}
	},
	5: {
		name: 'Primal',
		worlds: {
			35: 'Famfrit',
			53: 'Exodus',
			55: 'Lamia',
			64: 'Leviathan',
			77: 'Ultros',
			78: 'Behemoth',
			93: 'Excalibur',
			95: 'Hyperion'
		}
	},
	6: {
		name: 'Chaos',
		worlds: {
			39: 'Omega',
			71: 'Moogle',
			80: 'Cerberus',
			83: 'Louisoix',
			85: 'Spriggan',
			97: 'Ragnarok',
			400: 'Sagittarius',
			401: 'Phantom'
		}
	},
	4: {
		name: 'Aether',
		worlds: {
			40: 'Jenova',
			54: 'Faerie',
			57: 'Siren',
			63: 'Gilgamesh',
			65: 'Midgardsormr',
			73: 'Adamantoise',
			79: 'Cactuar',
			99: 'Sargatanas'
		}
	},
	2: {
		name: 'Gaia',
		worlds: {
			43: 'Alexander',
			46: 'Fenrir',
			51: 'Ultima',
			59: 'Ifrit',
			69: 'Bahamut',
			76: 'Tiamat',
			92: 'Durandal',
			98: 'Ridill'
		}
	},
	1: {
		name: 'Elemental',
		worlds: {
			45: 'Carbuncle',
			49: 'Kujata',
			50: 'Typhon',
			58: 'Garuda',
			68: 'Atomos',
			72: 'Tonberry',
			90: 'Aegis',
			94: 'Gungnir'
		}
	},
	11: { name: 'Dynamis', worlds: { 404: 'Marilith', 405: 'Seraph', 406: 'Halicarnassus', 407: 'Maduin' } }
};
