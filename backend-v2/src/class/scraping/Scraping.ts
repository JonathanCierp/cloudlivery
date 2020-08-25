// Classes
import CustomError from "../error/CustomError"
// Types
import {GetGen} from "nexus-plugin-prisma/dist/schema/typegen"
import {
	Provider,
	Marque,
	Format,
	LabelsQualite,
	PreferencesAlimentaire,
	Promotion,
	SubstancesControversee,
	Rayon
} from "../../types/scraping"
// Utils
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const Apify = require('apify')


const slugify = (text) => {
	return text.toString().toLowerCase()
		.replace(/\s+/g, '-')           // Replace spaces with -
		.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
		.replace(/\-\-+/g, '-')         // Replace multiple - with single -
		.replace(/^-+/, '')             // Trim - from start of text
		.replace(/-+$/, '');            // Trim - from end of text
}

export default class Scraping {

	//region Protected parameters
	/**
	 * Provider
	 * @type Provider | undefined
	 * @default provider
	 */
	provider: Provider | undefined

	/**
	 * Providers
	 * @type Array<string>
	 * @default providers
	 */
	providers: Array<Provider> = [
		{
			label: "CARREFOUR",
			prefix_url: "https://www.carrefour.fr"
		},
		{
			label: "AUCHAN",
			prefix_url: "https://www.auchan.com"
		}
	]

	/**
	 * Formats
	 * @type Array<string>
	 * @default formats by providers
	 */
	formats: Array<string> = [
		"1,115L",
		"1,25L",
		"1,5L",
		"1L",
		"2L et plus",
		"33cL et moins",
		"4x75cL",
		"50CL",
		"75cL",
		"3L",
		"1,75L",
		"33,5cL",
		"5x4,5g",
		"6x1,25L",
		"70cL",
		"60cL",
		"130cL",
		"100cL",
		"700mL"
	]

	/**
	 * labels Qualites
	 * @type Array<string>
	 * @default labelsQualites by providers
	 */
	labelsQualites: Array<string> = [
		"Bio",
		"Fabriqué en France",
		"Oeuf Plein Air",
		"Label Rouge",
		"Indication géographique protégée",
		"Filière qualité Carrefour",
		"Origine France",
		"Le porc français",
		"Sans sucres",
		"Viande bovine française",
		"Appellation d'origine protégée",
		"Forêt responsable",
		"Ecolabel"
	]

	/**
	 * Preferences Alimentaires
	 * @type Array<string>
	 * @default preferencesAlimentaires by providers
	 */
	preferencesAlimentaires: Array<string> = [
		"Sans gluten",
		"Sans lactose",
		"Sans sucre ajoutés",
		"Halal",
		"Végétarien",
		"Pur jus"
	]

	/**
	 * Promotions
	 * @type Array<string>
	 * @default promotions by providers
	 */
	promotions: Array<string> = [
		"Toutes les promotions",
		"Vue en catalogue",
		"Prime bio",
		"Remises immédiates",
		"A saisir"
	]

	/**
	 * Substances Controversees
	 * @type Array<string>
	 * @default substancesControversees by providers
	 */
	substancesControversees: Array<string> = [
		"Sans OGM",
		"Sans conservateur artificiel",
		"Sans colorant artificiel",
		"Sans arôme artificiel"
	]

	/**
	 * Instance puppeteer
	 */
	puppeteer: any

	/**
	 * Navigateur puppeteer
	 */
	browser: any

	/**
	 * Page du navigateur puppeteer
	 */
	page: any

	/**
	 * Contexte de l'applicaion
	 */
	ctx: GetGen<any> | undefined

	marques = [
		"SANS MARQUE",
		"LA MARQUE DU CONSOMMATEUR",
		"AGRILAIT",
		"BASKALIA",
		"BEARN LAIT",
		"C'EST QUI LE PATRON ?!",
		"CANDIA",
		"CARREFOUR BIO",
		"CARREFOUR",
		"ET ALDIA",
		"FAIREFRANCE",
		"GERENTE",
		"GRANDLAIT",
		"J'AIME LE LAIT D'ICI",
		"LACTEL",
		"LACTEL BIO",
		"LAITERIE LES FAYES",
		"LAITIK",
		"LE GALL",
		"LE LAIT DE MA REGION",
		"LE LAIT EQUITABLE SARTHOIS",
		"LE PETIT VENDEEN",
		"LES FAYES",
		"LES LAITIERS RESPONSABLES",
		"MONT LAIT",
		"ONETIK",
		"VERNEUIL",
		"CHARAL",
		"SOCOPA",
		"TENDRE ET PLUS",
		"MAITRE JACQUES",
		"TENDRIADE",
		"JEMANGEFRANÇAIS.COM",
		"BIGARD",
		"HENAFF",
		"METRAS TRIPIER EN PROVENCE",
		"LE MARCHE",
		"PAILLARD",
		"LES BONS MORCEAUX",
		"LES BRASERADES",
		"JOHNSONVILLE",
		"LA BRESSE",
		"NOBLES",
		"ALDELIS",
		"DOUCE FRANCE",
		"MADRANCE",
		"MORITZ",
		"PEGASE",
		"DABIA",
		"DELICADEZAS IBERICAS",
		"GRAND CARACTERE",
		"KLEIN KAROO",
		"LES OCCITANES",
		"LIONOR",
		"SOURIRES DE CAMPAGNE",
		"CLERMONT",
		"COOPERL",
		"DE FAUX FILET",
		"ELIVIA",
		"HIRUAK",
		"INDIANA JERKY",
		"LE GAULOIS",
		"LES ELEVEURS DE CHEZ NOUS",
		"ROYAL HALAL",
		"TRIPES PAILLARD",
		"VIAZUR",
		"refuge_de_marie_louise",
		"REFS.SANS MARQUE",
		"BABY COQUE",
		"COQUY",
		"L'OEUFS DE NOS VILLA",
		"COQUEN'OR",
		"LOUE",
		"COCORETTE",
		"LUSTUCRU",
		"MIELS VILLENEUVE",
		"OEUF ARRADOY",
		"COTEAUX PEYRIGNAC",
		"AVIBRESSE",
		"BISCUITERIE COMTOISE",
		"C'EST QUI LE PATRON",
		"L'OEUF GASCON",
		"LA NOUVELLE AGRICULTURE",
		"MATINES",
		"OEUFS TRADITION",
		"OVALIS",
		"PP BLANC",
		"PP NO NAME",
		"CRF CDM",
		"L'OEUF RIESTAHL",
		"LE CLOS ST JACQUES",
		"LES CAMPAGNES",
		"OEUF CHAMPAG.ARDENNE",
		"OEUF VIEUX PRESSOIR",
		"POULE HOUSE",
		"SARL ROUSSILLON OEUF",
		"SAINT AMAND",
		"VITTEL",
		"CRISTALINE",
		"EVIAN",
		"ABATILLES",
		"COURMAYEUR",
		"HEPAR",
		"PLANCOET",
		"VOLVIC",
		"planet_drinks",
		"CONTREX",
		"MONT BLANC",
		"MONT ROUCOUS",
		"OGEU",
		"PIERVAL",
		"ST GEORGES",
		"STE ALIX",
		"THONON",
		"WATTWILLER",
		"AURELE",
		"JOLIVAL",
		"PERRIER",
		"SAN PELLEGRINO",
		"BABOIT",
		"ROZANA",
		"VALS",
		"VICHY CELESTINS",
		"ARCENS",
		"QUEZAC",
		"ST-YORRE",
		"HIGHTLAND SPRING",
		"OREZZA",
		"PAROT",
		"SALVETAT",
		"ST ALBAN",
		"ST YORRE",
		"VERNIERE",
		"BADOIT",
		"CONTREX GREEN",
		"VOLVICJUICY",
		"PERRIER & JUICE",
		"VITTEL UP",
		"VOLVIC JUICY",
		"COCA-COLA",
		"COCA-COLA ZERO",
		"BREIZH COLA",
		"MEUH COLA",
		"COCA COLA",
		"CORSICA COLA",
		"GALVANINA",
		"HAMOUD BOUALEM",
		"PEPSI",
		"PEPSI MAX",
		"QUEBEC",
		"TETES BRULEES MIX & KIFF",
		"LORINA",
		"SCHWEPPES",
		"7UP",
		"BOX",
		"FEVER TREE",
		"SPRITE",
		"BREIZH",
		"BREIZH-LIMO",
		"LA GOSSE",
		"LEMONAID",
		"LIMONETTE",
		"MARIE DOLIN",
		"ORIGINAL TONIC",
		"VOSS",
		"MONSTER ENERGY",
		"RED BULL",
		"CRAZY TIGER",
		"MME GREEN",
		"PSYCHIK",
		"PUMA",
		"DIUKE",
		"HEROIC PLUS",
		"MONSTER",
		"POWERADE",
		"AUCHAN",
		"AUCHAN BIO",
		"C'EST QUI LE PATRON?",
		"POUCE",
		"AUCHAN GOURMET",
		"MADRANGE",
		"MMM!",
		"BROCELIANDE",
		"NATURE DE FRANCE",
		"POULEHOUSE",
		"NESTLE",
		"ST AMAND",
		"VICHY ST YORRE",
		"OASIS",
		"TEISSEIRE",
		"DR PEPPER",
		"CANADA DRY",
		"GINI",
		"MEGA FORCE"
	]

	groupeRayons = [
		{
			code: "R01",
			label: "Crémerie",
			slug: "cremerie",
			uri: "/r/cremerie",
			level: 1,
			resultats: 0,
			scraping: false
		},
		{
			code: "R01SR01",
			label: "Lait",
			slug: "cremerie/lait",
			uri: "/r/cremerie/lait",
			level: 2,
			resultats: 0,
			scraping: false
		},
		{
			code: "R01SR01SSR01",
			label: "Lait demi-écrémé",
			slug: "cremerie/lait/lait-demi-ecreme",
			uri: "/r/cremerie/lait/lait-demi-ecreme",
			level: 3,
			resultats: 0,
			scraping: false
		},
		{
			code: "R01SR01SSR02",
			label: "Lait écrémé",
			slug: "cremerie/lait/lait-ecreme",
			uri: "/r/cremerie/lait/lait-ecreme",
			level: 3,
			resultats: 0,
			scraping: false
		},
		{
			code: "R01SR01SSR03",
			label: "Lait entier",
			slug: "cremerie/lait/lait-entier",
			uri: "/r/cremerie/lait/lait-entier",
			level: 3,
			resultats: 0,
			scraping: false
		},
		{
			code: "R01SR02",
			label: "Oeufs",
			slug: "cremerie/oeufs",
			uri: "/r/cremerie/oeufs",
			level: 2,
			resultats: 0,
			scraping: false
		},
		{
			code: "R02",
			label: "Viandes et Poissons",
			slug: "viandes-et-poissons",
			uri: "/r/viandes-et-poissons",
			level: 1,
			resultats: 0,
			scraping: false
		},
		{
			code: "R02SR01",
			label: "Boucherie",
			slug: "viandes-et-poissons/boucherie",
			uri: "/r/viandes-et-poissons/boucherie",
			level: 2,
			resultats: 0,
			scraping: false
		},
		{
			code: "R02SR01SSR01",
			label: "Boeuf",
			slug: "viandes-et-poissons/boucherie/boeuf",
			uri: "/r/viandes-et-poissons/boucherie/boeuf",
			level: 3,
			resultats: 0,
			scraping: false
		},
		{
			code: "R02SR01SSR02",
			label: "Veau",
			slug: "viandes-et-poissons/boucherie/veau",
			uri: "/r/viandes-et-poissons/boucherie/veau",
			level: 3,
			resultats: 0,
			scraping: false
		},
		{
			code: "R02SR01SSR03",
			label: "Porc",
			slug: "viandes-et-poissons/boucherie/porc",
			uri: "/r/viandes-et-poissons/boucherie/porc",
			level: 3,
			resultats: 0,
			scraping: false
		},
		{
			code: "R02SR01SSR04",
			label: "Saucisses et grillades",
			slug: "viandes-et-poissons/boucherie/saucisses-et-grillades",
			uri: "/r/viandes-et-poissons/boucherie/saucisses-et-grillades",
			level: 3,
			resultats: 0,
			scraping: false
		},
		{
			code: "R02SR02",
			label: "Poissonnerie",
			slug: "viandes-et-poissons/poissonnerie",
			uri: "/r/viandes-et-poissons/poissonnerie",
			level: 2,
			resultats: 0,
			scraping: false
		},
		{
			code: "R02SR02SSR01",
			label: "Saumons et truites",
			slug: "viandes-et-poissons/poissonnerie/saumons-et-truites",
			uri: "/r/viandes-et-poissons/poissonnerie/saumons-et-truites",
			level: 3,
			resultats: 0,
			scraping: false
		},
		{
			code: "R02SR02SSR02",
			label: "Filets et pavés",
			slug: "viandes-et-poissons/poissonnerie/filets-et-paves",
			uri: "/r/viandes-et-poissons/poissonnerie/filets-et-paves",
			level: 3,
			resultats: 0,
			scraping: false
		},
		{
			code: "R02SR02SSR03",
			label: "Crevettes et fruits de mer",
			slug: "viandes-et-poissons/poissonnerie/crevettes-et-fruits-de-mer",
			uri: "/r/viandes-et-poissons/poissonnerie/crevettes-et-fruits-de-mer",
			level: 3,
			resultats: 0,
			scraping: false
		},
		{
			code: "R03",
			label: "Boissons sans alcool",
			slug: "boissons-sans-alcool",
			uri: "/r/boissons-sans-alcool",
			level: 1,
			resultats: 0,
			scraping: false
		},
		{
			code: "R03SR01",
			label: "Eaux",
			slug: "boissons-sans-alcool/eaux",
			uri: "/r/boissons-sans-alcool/eaux",
			level: 2,
			resultats: 0,
			scraping: false
		},
		{
			code: "R03SR01SSR01",
			label: "Eaux plates",
			slug: "boissons-sans-alcool/eaux/eaux-plates",
			uri: "/r/boissons-sans-alcool/eaux/eaux-plates",
			level: 3,
			resultats: 0,
			scraping: false
		},
		{
			code: "R03SR01SSR02",
			label: "Eaux gazeuses",
			slug: "boissons-sans-alcool/eaux/eaux-gazeuses",
			uri: "/r/boissons-sans-alcool/eaux/eaux-gazeuses",
			level: 3,
			resultats: 0,
			scraping: false
		},
		{
			code: "R03SR01SSR03",
			label: "Eaux aromatisées",
			slug: "boissons-sans-alcool/eaux/eaux-aromatisees",
			uri: "/r/boissons-sans-alcool/eaux/eaux-aromatisees",
			level: 3,
			resultats: 0,
			scraping: false
		},
		{
			code: "R03SR02",
			label: "Colas, Thés glacés et Soft drinks",
			slug: "boissons-sans-alcool/colas-thes-glaces-et-soft-drinks",
			uri: "/r/boissons-sans-alcool/colas-thes-glaces-et-soft-drinks",
			level: 2,
			resultats: 0,
			scraping: false
		},
		{
			code: "R03SR02SSR01",
			label: "Colas",
			slug: "boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/colas",
			uri: "/r/boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/colas",
			level: 3,
			resultats: 0,
			scraping: false
		},
		{
			code: "R03SR02SSR02",
			label: "Limonades, Limes et Tonics",
			slug: "boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/limonades-limes-et-tonics",
			uri: "/r/boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/limonades-limes-et-tonics",
			level: 3,
			resultats: 0,
			scraping: false
		},
		{
			code: "R03SR02SSR03",
			label: "Boissons sports et Energisantes",
			slug: "boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/boissons-sports-et-energisantes",
			uri: "/r/boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/boissons-sports-et-energisantes",
			level: 3,
			resultats: 0,
			scraping: false
		}
	]

	rayons = [
		{
			label: "lait",
			urlCarrefour: "https://www.carrefour.fr/r/cremerie/lait-boissons-lactees-et-vegetales/ecreme?noRedirect=1",
			urlAuchan: "https://www.auchan.fr/produits-laitiers-oeufs-fromages/cremerie-oeufs-laits/laits/lait-ecreme/ca-n01010102",
			rayons: [
				{
					code: "R01",
					label: "Crémerie",
					slug: "cremerie",
					uri: "/r/cremerie",
					level: 1,
					resultats: 0,
					scraping: false
				},
				{
					code: "R01SR01",
					label: "Lait",
					slug: "cremerie/lait",
					uri: "/r/cremerie/lait",
					level: 2,
					resultats: 0,
					scraping: false
				},
				{
					code: "R01SR01SSR02",
					label: "Lait écrémé",
					slug: "cremerie/lait/lait-ecreme",
					uri: "/r/cremerie/lait/lait-ecreme",
					level: 3,
					resultats: 0,
					scraping: false
				}
			]
		},
		{
			label: "lait",
			urlCarrefour: "https://www.carrefour.fr/r/cremerie/lait-boissons-lactees-et-vegetales/entier?noRedirect=1",
			urlAuchan: "https://www.auchan.fr/produits-laitiers-oeufs-fromages/cremerie-oeufs-laits/laits/lait-entier/ca-n01010103",
			rayons: [
				{
					code: "R01",
					label: "Crémerie",
					slug: "cremerie",
					uri: "/r/cremerie",
					level: 1,
					resultats: 0,
					scraping: false
				},
				{
					code: "R01SR01",
					label: "Lait",
					slug: "cremerie/lait",
					uri: "/r/cremerie/lait",
					level: 2,
					resultats: 0,
					scraping: false
				},
				{
					code: "R01SR01SSR03",
					label: "Lait entier",
					slug: "cremerie/lait/lait-entier",
					uri: "/r/cremerie/lait/lait-entier",
					level: 3,
					resultats: 0,
					scraping: false
				}
			]
		},
		{
			label: "lait",
			urlCarrefour: "https://www.carrefour.fr/r/cremerie/lait-boissons-lactees-et-vegetales/demi-ecreme?noRedirect=1",
			urlAuchan: "https://www.auchan.fr/produits-laitiers-oeufs-fromages/cremerie-oeufs-laits/laits/lait-demi-ecreme/ca-n01010101",
			rayons: [
				{
					code: "R01",
					label: "Crémerie",
					slug: "cremerie",
					uri: "/r/cremerie",
					level: 1,
					resultats: 0,
					scraping: false
				},
				{
					code: "R01SR01",
					label: "Lait",
					slug: "cremerie/lait",
					uri: "/r/cremerie/lait",
					level: 2,
					resultats: 0,
					scraping: false
				},
				{
					code: "R01SR01SSR01",
					label: "Lait demi-écrémé",
					slug: "cremerie/lait/lait-demi-ecreme",
					uri: "/r/cremerie/lait/lait-demi-ecreme",
					level: 3,
					resultats: 0,
					scraping: false
				}
			]
		},
		{
			label: "viande",
			urlCarrefour: "https://www.carrefour.fr/r/viandes-et-poissons/boucherie/boeuf?noRedirect=1",
			urlAuchan: "https://www.auchan.fr/boucherie-volaille-poissonnerie/boucherie/boeuf/ca-n020101",
			rayons: [
				{
					code: "R02",
					label: "Viandes et Poissons",
					slug: "viandes-et-poissons",
					uri: "/r/viandes-et-poissons",
					level: 1,
					resultats: 0,
					scraping: false
				},
				{
					code: "R02SR01",
					label: "Boucherie",
					slug: "viandes-et-poissons/boucherie",
					uri: "/r/viandes-et-poissons/boucherie",
					level: 2,
					resultats: 0,
					scraping: false
				},
				{
					code: "R02SR01SSR01",
					label: "Boeuf",
					slug: "viandes-et-poissons/boucherie/boeuf",
					uri: "/r/viandes-et-poissons/boucherie/boeuf",
					level: 3,
					resultats: 0,
					scraping: false
				}
			]
		},
		{
			label: "viande",
			urlCarrefour: "https://www.carrefour.fr/r/viandes-et-poissons/boucherie/veau?noRedirect=1",
			urlAuchan: "https://www.auchan.fr/boucherie-volaille-poissonnerie/boucherie/veau-agneau/ca-n020103",
			rayons: [
				{
					code: "R02",
					label: "Viandes et Poissons",
					slug: "viandes-et-poissons",
					uri: "/r/viandes-et-poissons",
					level: 1,
					resultats: 0,
					scraping: false
				},
				{
					code: "R02SR01",
					label: "Boucherie",
					slug: "viandes-et-poissons/boucherie",
					uri: "/r/viandes-et-poissons/boucherie",
					level: 2,
					resultats: 0,
					scraping: false
				},
				{
					code: "R02SR01SSR02",
					label: "Veau",
					slug: "viandes-et-poissons/boucherie/veau",
					uri: "/r/viandes-et-poissons/boucherie/veau",
					level: 3,
					resultats: 0,
					scraping: false
				}
			]
		},
		{
			label: "viande",
			urlCarrefour: "https://www.carrefour.fr/r/viandes-et-poissons/boucherie/porc?noRedirect=1",
			urlAuchan: "https://www.auchan.fr/boucherie-volaille-poissonnerie/boucherie/porc/ca-n020102",
			rayons: [
				{
					code: "R02",
					label: "Viandes et Poissons",
					slug: "viandes-et-poissons",
					uri: "/r/viandes-et-poissons",
					level: 1,
					resultats: 0,
					scraping: false
				},
				{
					code: "R02SR01",
					label: "Boucherie",
					slug: "viandes-et-poissons/boucherie",
					uri: "/r/viandes-et-poissons/boucherie",
					level: 2,
					resultats: 0,
					scraping: false
				},
				{
					code: "R02SR01SSR03",
					label: "Porc",
					slug: "viandes-et-poissons/boucherie/porc",
					uri: "/r/viandes-et-poissons/boucherie/porc",
					level: 3,
					resultats: 0,
					scraping: false
				}
			]
		},
		{
			label: "viande",
			urlCarrefour: "https://www.carrefour.fr/r/viandes-et-poissons/boucherie/saucisses-et-grillades?noRedirect=1",
			urlAuchan: "https://www.auchan.fr/boucherie-volaille-poissonnerie/boucherie/saucisses-farces/ca-n020104",
			rayons: [
				{
					code: "R02",
					label: "Viandes et Poissons",
					slug: "viandes-et-poissons",
					uri: "/r/viandes-et-poissons",
					level: 1,
					resultats: 0,
					scraping: false
				},
				{
					code: "R02SR01",
					label: "Boucherie",
					slug: "viandes-et-poissons/boucherie",
					uri: "/r/viandes-et-poissons/boucherie",
					level: 2,
					resultats: 0,
					scraping: false
				},
				{
					code: "R02SR01SSR03",
					label: "Saucisses et grillades",
					slug: "viandes-et-poissons/boucherie/saucisses-et-grillades",
					uri: "/r/viandes-et-poissons/boucherie/saucisses-et-grillades",
					level: 3,
					resultats: 0,
					scraping: false
				}
			]
		},
		{
			label: "oeufs",
			urlCarrefour: "https://www.carrefour.fr/r/cremerie/oeufs?noRedirect=1",
			urlAuchan: "https://www.auchan.fr/produits-laitiers-oeufs-fromages/cremerie-oeufs-laits/oeufs/ca-n010103",
			rayons: [
				{
					code: "R01",
					label: "Crémerie",
					slug: "cremerie",
					uri: "/r/cremerie",
					level: 1,
					resultats: 0,
					scraping: false
				},
				{
					code: "R01SR02",
					label: "Oeufs",
					slug: "cremerie/oeufs",
					uri: "/r/cremerie/oeufs",
					level: 2,
					resultats: 0,
					scraping: false
				}
			]
		},
		{
			label: "boissons",
			urlCarrefour: "https://www.carrefour.fr/r/boissons-sans-alcool/eaux/eaux-plates?noRedirect=1",
			urlAuchan: "https://www.auchan.fr/boissons/eaux-laits/eaux-plates-natures/ca-n070101",
			rayons: [
				{
					code: "R03",
					label: "Boissons sans alcool",
					slug: "boissons-sans-alcool",
					uri: "/r/boissons-sans-alcool",
					level: 1,
					resultats: 0,
					scraping: false
				},
				{
					code: "R03SR01",
					label: "Eaux",
					slug: "boissons-sans-alcool/eaux",
					uri: "/r/boissons-sans-alcool/eaux",
					level: 2,
					resultats: 0,
					scraping: false
				},
				{
					code: "R03SR01SSR01",
					label: "Eaux plates",
					slug: "boissons-sans-alcool/eaux/eaux-plates",
					uri: "/r/boissons-sans-alcool/eaux/eaux-plates",
					level: 3,
					resultats: 0,
					scraping: false
				}
			]
		},
		{
			label: "boissons",
			urlCarrefour: "https://www.carrefour.fr/r/boissons-sans-alcool/eaux/eaux-gazeuses?noRedirect=1",
			urlAuchan: "https://www.auchan.fr/boissons/eaux-laits/eaux-gazeuses-natures/ca-n070102",
			rayons: [
				{
					code: "R03",
					label: "Boissons sans alcool",
					slug: "boissons-sans-alcool",
					uri: "/r/boissons-sans-alcool",
					level: 1,
					resultats: 0,
					scraping: false
				},
				{
					code: "R03SR01",
					label: "Eaux",
					slug: "boissons-sans-alcool/eaux",
					uri: "/r/boissons-sans-alcool/eaux",
					level: 2,
					resultats: 0,
					scraping: false
				},
				{
					code: "R03SR01SSR02",
					label: "Eaux gazeuses",
					slug: "boissons-sans-alcool/eaux/eaux-gazeuses",
					uri: "/r/boissons-sans-alcool/eaux/eaux-gazeuses",
					level: 3,
					resultats: 0,
					scraping: false
				}
			]
		},
		{
			label: "boissons",
			urlCarrefour: "https://www.carrefour.fr/r/boissons-sans-alcool/eaux/eaux-aromatisees?noRedirect=1",
			urlAuchan: "https://www.auchan.fr/boissons/eaux-laits/eaux-aromatisees-fruitees/ca-n070103",
			rayons: [
				{
					code: "R03",
					label: "Boissons sans alcool",
					slug: "boissons-sans-alcool",
					uri: "/r/boissons-sans-alcool",
					level: 1,
					resultats: 0,
					scraping: false
				},
				{
					code: "R03SR01",
					label: "Eaux",
					slug: "boissons-sans-alcool/eaux",
					uri: "/r/boissons-sans-alcool/eaux",
					level: 2,
					resultats: 0,
					scraping: false
				},
				{
					code: "R03SR01SSR03",
					label: "Eaux aromatisées",
					slug: "boissons-sans-alcool/eaux/eaux-aromatisees",
					uri: "/r/boissons-sans-alcool/eaux/eaux-aromatisees",
					level: 3,
					resultats: 0,
					scraping: false
				}
			]
		},
		{
			label: "boissons",
			urlCarrefour: "https://www.carrefour.fr/r/boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/colas?noRedirect=1",
			urlAuchan: "https://www.auchan.fr/boissons/soda-boissons-jus-de-fruits-sirops/colas-boissons-gazeuses-energisants/colas/ca-n070601",
			rayons: [
				{
					code: "R03",
					label: "Boissons sans alcool",
					slug: "boissons-sans-alcool",
					uri: "/r/boissons-sans-alcool",
					level: 1,
					resultats: 0,
					scraping: false
				},
				{
					code: "R03SR02",
					label: "Colas, Thés glacés et Soft drinks",
					slug: "boissons-sans-alcool/colas-thes-glaces-et-soft-drinks",
					uri: "/r/boissons-sans-alcool/colas-thes-glaces-et-soft-drinks",
					level: 2,
					resultats: 0,
					scraping: false
				},
				{
					code: "R03SR02SSR01",
					label: "Colas",
					slug: "boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/colas",
					uri: "/r/boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/colas",
					level: 3,
					resultats: 0,
					scraping: false
				}
			]
		},
		{
			label: "boissons",
			urlCarrefour: "https://www.carrefour.fr/r/boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/limonades-limes-et-tonics?noRedirect=1",
			urlAuchan: "https://www.auchan.fr/boissons/soda-boissons-jus-de-fruits-sirops/colas-boissons-gazeuses-energisants/limonades-limes-tonic/ca-n070603",
			rayons: [
				{
					code: "R03",
					label: "Boissons sans alcool",
					slug: "boissons-sans-alcool",
					uri: "/r/boissons-sans-alcool",
					level: 1,
					resultats: 0,
					scraping: false
				},
				{
					code: "R03SR02",
					label: "Colas, Thés glacés et Soft drinks",
					slug: "boissons-sans-alcool/colas-thes-glaces-et-soft-drinks",
					uri: "/r/boissons-sans-alcool/colas-thes-glaces-et-soft-drinks",
					level: 2,
					resultats: 0,
					scraping: false
				},
				{
					code: "R03SR02SSR02",
					label: "Limonades, Limes et Tonics",
					slug: "boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/limonades-limes-et-tonics",
					uri: "/r/boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/limonades-limes-et-tonics",
					level: 3,
					resultats: 0,
					scraping: false
				}
			]
		},
		{
			label: "boissons",
			urlCarrefour: "https://www.carrefour.fr/r/boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/boissons-sports-et-energisantes?noRedirect=1",
			urlAuchan: "https://www.auchan.fr/boissons/soda-boissons-jus-de-fruits-sirops/colas-boissons-gazeuses-energisants/boissons-energisantes/ca-n070604",
			rayons: [
				{
					code: "R03",
					label: "Boissons sans alcool",
					slug: "boissons-sans-alcool",
					uri: "/r/boissons-sans-alcool",
					level: 1,
					resultats: 0,
					scraping: false
				},
				{
					code: "R03SR02",
					label: "Colas, Thés glacés et Soft drinks",
					slug: "boissons-sans-alcool/colas-thes-glaces-et-soft-drinks",
					uri: "/r/boissons-sans-alcool/colas-thes-glaces-et-soft-drinks",
					level: 2,
					resultats: 0,
					scraping: false
				},
				{
					code: "R03SR02SSR03",
					label: "Boissons sports et Energisantes",
					slug: "boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/boissons-sports-et-energisantes",
					uri: "/r/boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/boissons-sports-et-energisantes",
					level: 3,
					resultats: 0,
					scraping: false
				}
			]
		}
	]
	//endregion

	//region public functions
	/**
	 * Create providers
	 * @return Promise<void>
	 */
	Scraping() {
		puppeteer.use(StealthPlugin())

		this.puppeteer = puppeteer
	}

	public async createPrismaProvider(): Promise<void> {
		let start_time = new Date().getTime();
		console.log("Start provider...")
		for (let provider of this.providers) {
			const resProvider = await this.getPrismaProvider(provider.label)
			if (!resProvider) {
				try {
					await this.ctx.prisma.provider.create({
						data: {
							label: provider.label,
							prefix_url: provider.prefix_url
						}
					})
				} catch (e) {
					CustomError.error("Erreur lors de la création du provider.")
				}
			}
		}
		console.log("End provider in : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))
	}

	/**
	 * Create marques
	 * @return Promise<void>
	 */
	public async createPrismaMarques(): Promise<void> {
		let start_time = new Date().getTime();
		console.log("Start marque...")
		for (let marque of this.marques) {
			const resMarque = await this.getPrismaMarque(marque.toLowerCase())
			if (!resMarque) {
				try {
					await this.ctx.prisma.marque.create({
						data: {
							label: marque.toLowerCase()
						}
					})
				} catch (e) {
					CustomError.error("Erreur lors de la création de la marque.")
				}
			}
		}
		console.log("End marque in : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))
	}

	/**
	 * Create formats
	 * @return Promise<void>
	 */
	public async createPrismaFormats(): Promise<void> {
		let start_time = new Date().getTime();
		console.log("Start format...")
		for (let format of this.formats) {
			const resFormat = await this.getPrismaFormat(format)
			if (!resFormat) {
				try {
					await this.ctx.prisma.format.create({
						data: {
							label: format
						}
					})
				} catch (e) {
					console.log(e)
					CustomError.error("Erreur lors de la création du format.")
				}
			}
		}
		console.log("End format in : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))
	}

	/**
	 * Create labels qualites
	 * @return Promise<void>
	 */
	public async createPrismaLabelsQualites(): Promise<void> {
		let start_time = new Date().getTime();
		console.log("Start labels qualites...")
		for (let labelsQualite of this.labelsQualites) {
			const resLabelsQualite = await this.getPrismaLabelsQualite(labelsQualite)
			if (!resLabelsQualite) {
				try {
					await this.ctx.prisma.labelsQualite.create({
						data: {
							label: labelsQualite
						}
					})
				} catch (e) {
					CustomError.error("Erreur lors de la création du label qualité.")
				}
			}
		}
		console.log("End labels qualites in : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))
	}

	/**
	 * Create preferences alimentaires
	 * @return Promise<void>
	 */
	public async createPrismaPreferencesAlimentaires(): Promise<void> {
		let start_time = new Date().getTime();
		console.log("Start preferences alimentaires...")
		for (let preferencesAlimentaire of this.preferencesAlimentaires) {
			const resPreferencesAlimentaire = await this.getPrismaPreferencesAlimentaire(preferencesAlimentaire)
			if (!resPreferencesAlimentaire) {
				try {
					await this.ctx.prisma.preferencesAlimentaire.create({
						data: {
							label: preferencesAlimentaire
						}
					})
				} catch (e) {
					CustomError.error("Erreur lors de la création des préférences alimentaires.")
				}
			}
		}
		console.log("End preferences alimentaires in : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))
	}

	/**
	 * Create promotions
	 * @return Promise<void>
	 */
	public async createPrismaPromotions(): Promise<void> {
		let start_time = new Date().getTime();
		console.log("Start promotions...")
		for (let promotion of this.promotions) {
			const resPromotion = await this.getPrismaPromotion(promotion)
			if (!resPromotion) {
				try {
					await this.ctx.prisma.promotion.create({
						data: {
							label: promotion
						}
					})
				} catch (e) {
					console.log(e)
					CustomError.error("Erreur lors de la création des promotions.")
				}
			}
		}
		console.log("End promotions in : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))
	}

	/**
	 * Create substances controversees
	 * @return Promise<void>
	 */
	public async createPrismaSubstancesControversees(): Promise<void> {
		let start_time = new Date().getTime();
		console.log("Start substances controversees...")
		for (let substancesControversee of this.substancesControversees) {
			const resSubstancesControversee = await this.getPrismaSubstancesControversee(substancesControversee)
			if (!resSubstancesControversee) {
				try {
					await this.ctx.prisma.substancesControverse.create({
						data: {
							label: substancesControversee
						}
					})
				} catch (e) {
					console.log(e)
					CustomError.error("Erreur lors de la création des substances controversées.")
				}
			}
		}
		console.log("End substances controversees in : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))
	}

	/**
	 * Create rayons
	 * @return Promise<void>
	 */
	public async createPrismaRayons(): Promise<void> {
		let start_time = new Date().getTime();
		console.log("Start rayon...")
		for (let rayon of this.groupeRayons) {
			const resRayon = await this.getPrismaRayon(rayon.label)
			if (!resRayon) {
				try {
					await this.ctx.prisma.rayon.create({
						data: {
							label: rayon.label,
							code: rayon.code,
							slug: rayon.slug,
							uri: rayon.uri,
							level: rayon.level,
							resultats: rayon.resultats,
							scraping: rayon.scraping
						}
					})
				} catch (e) {
					console.log(e)
					CustomError.error("Erreur lors de la création des rayons.")
				}
			}
		}
		console.log("End rayon in : " + ((new Date().getTime() - start_time) / 1000).toFixed(2))
	}

	/**
	 * Get a provider
	 * @return Promise<Provider>
	 * @param provider
	 */
	public async getPrismaProvider(provider: string): Promise<Provider> {
		return this.ctx.prisma.provider.findOne({
			where: {
				label: provider
			}
		})
	}

	/**
	 * Get a marque
	 * @return Promise<Marque>
	 * @param marque
	 */
	public async getPrismaMarque(marque: string): Promise<Marque> {
		return this.ctx.prisma.marque.findOne({
			where: {
				label: marque
			}
		})
	}

	/**
	 * Get a format
	 * @return Promise<Format>
	 * @param format
	 */
	public async getPrismaFormat(format: string): Promise<Format> {
		return this.ctx.prisma.format.findOne({
			where: {
				label: format
			}
		})
	}

	/**
	 * Get a labels qualite
	 * @return Promise<LabelsQualite>
	 * @param labelsQualite
	 */
	public async getPrismaLabelsQualite(labelsQualite: string): Promise<LabelsQualite> {
		return this.ctx.prisma.labelsQualite.findOne({
			where: {
				label: labelsQualite
			}
		})
	}

	/**
	 * Get a preferences alimentaire
	 * @return Promise<PreferencesAlimentaire>
	 * @param preferencesAlimentaire
	 */
	public async getPrismaPreferencesAlimentaire(preferencesAlimentaire: string): Promise<PreferencesAlimentaire> {
		return this.ctx.prisma.preferencesAlimentaire.findOne({
			where: {
				label: preferencesAlimentaire
			}
		})
	}

	/**
	 * Get a promotion
	 * @return Promise<Promotion>
	 * @param promotion
	 */
	public async getPrismaPromotion(promotion: string): Promise<Promotion> {
		return this.ctx.prisma.promotion.findOne({
			where: {
				label: promotion
			}
		})
	}

	/**
	 * Get a substances controversee
	 * @return Promise<SubstancesControversee>
	 * @param substancesControversee
	 */
	public async getPrismaSubstancesControversee(substancesControversee: string): Promise<SubstancesControversee> {
		return this.ctx.prisma.substancesControverse.findOne({
			where: {
				label: substancesControversee
			}
		})
	}

	/**
	 * Get a rayon
	 * @return Promise<Rayon>
	 * @param rayon
	 */
	public async getPrismaRayon(rayon: string): Promise<Rayon> {
		return this.ctx.prisma.rayon.findOne({
			where: {
				label: rayon
			}
		})
	}

	public async getPrismaProduits() {
		return this.ctx.prisma.produit.findMany({
			where: {
				provider_id: this.provider?.id
			}
		})
	}

	async launchBrowser(): Promise<void> {
		this.browser = await puppeteer.launch({headless: true})
	}

	async newPage(): Promise<void> {
		this.page = await this.browser.newPage()
	}

	async getPage(url: string): Promise<any> {
		return await this.page.goto(url)
	}

	async closeBrowser(): Promise<void> {
		await this.browser.close()
	}

	async startScrapingCarrefour() {
		Apify.main(async () => {
			const browser = await Apify.launchPuppeteer({stealth: true});

			let results = []

			for (let rayon of this.rayons) {
				const page = await browser.newPage()

				await page.goto(`${rayon.urlCarrefour}&page=1`)
				let nbProduit = await page.$eval('.pagination__txt', el => {
					return el.innerText.split(" ")[4]
				})
				let nbPage = nbProduit >= 60 ? Math.ceil(nbProduit / 60) : 1

				let result = []

				for (let i = 1; i <= nbPage; i++) {
					await page.goto(`${rayon.urlCarrefour}&page=${i}`);
					let datas = await page.$eval('.product-list.product-list .pagination ~ .product-grid', el => {
						let products = []

						for (let i in el.children) {
							if (el.children[i].innerHTML && el.children[i].innerHTML.indexOf("<div class=\"ds-product-card--vertical-image\">") !== -1) {
								let marques = [
									"SANS MARQUE",
									"LA MARQUE DU CONSOMMATEUR",
									"AGRILAIT",
									"BASKALIA",
									"BEARN LAIT",
									"C'EST QUI LE PATRON ?!",
									"CANDIA",
									"CARREFOUR BIO",
									"CARREFOUR",
									"ET ALDIA",
									"FAIREFRANCE",
									"GERENTE",
									"GRANDLAIT",
									"J'AIME LE LAIT D'ICI",
									"LACTEL",
									"LACTEL BIO",
									"LAITERIE LES FAYES",
									"LAITIK",
									"LE GALL",
									"LE LAIT DE MA REGION",
									"LE LAIT EQUITABLE SARTHOIS",
									"LE PETIT VENDEEN",
									"LES FAYES",
									"LES LAITIERS RESPONSABLES",
									"MONT LAIT",
									"ONETIK",
									"VERNEUIL",
									"CHARAL",
									"SOCOPA",
									"TENDRE ET PLUS",
									"MAITRE JACQUES",
									"TENDRIADE",
									"JEMANGEFRANÇAIS.COM",
									"BIGARD",
									"HENAFF",
									"METRAS TRIPIER EN PROVENCE",
									"LE MARCHE",
									"PAILLARD",
									"LES BONS MORCEAUX",
									"LES BRASERADES",
									"JOHNSONVILLE",
									"LA BRESSE",
									"NOBLES",
									"ALDELIS",
									"DOUCE FRANCE",
									"MADRANCE",
									"MORITZ",
									"PEGASE",
									"DABIA",
									"DELICADEZAS IBERICAS",
									"GRAND CARACTERE",
									"KLEIN KAROO",
									"LES OCCITANES",
									"LIONOR",
									"SOURIRES DE CAMPAGNE",
									"CLERMONT",
									"COOPERL",
									"DE FAUX FILET",
									"ELIVIA",
									"HIRUAK",
									"INDIANA JERKY",
									"LE GAULOIS",
									"LES ELEVEURS DE CHEZ NOUS",
									"ROYAL HALAL",
									"TRIPES PAILLARD",
									"VIAZUR",
									"refuge_de_marie_louise",
									"REFS.SANS MARQUE",
									"BABY COQUE",
									"COQUY",
									"L'OEUFS DE NOS VILLA",
									"COQUEN'OR",
									"LOUE",
									"COCORETTE",
									"LUSTUCRU",
									"MIELS VILLENEUVE",
									"OEUF ARRADOY",
									"COTEAUX PEYRIGNAC",
									"AVIBRESSE",
									"BISCUITERIE COMTOISE",
									"C'EST QUI LE PATRON",
									"L'OEUF GASCON",
									"LA NOUVELLE AGRICULTURE",
									"MATINES",
									"OEUFS TRADITION",
									"OVALIS",
									"PP BLANC",
									"PP NO NAME",
									"CRF CDM",
									"L'OEUF RIESTAHL",
									"LE CLOS ST JACQUES",
									"LES CAMPAGNES",
									"OEUF CHAMPAG.ARDENNE",
									"OEUF VIEUX PRESSOIR",
									"POULE HOUSE",
									"SARL ROUSSILLON OEUF",
									"SAINT AMAND",
									"VITTEL",
									"CRISTALINE",
									"EVIAN",
									"ABATILLES",
									"COURMAYEUR",
									"HEPAR",
									"PLANCOET",
									"VOLVIC",
									"planet_drinks",
									"CONTREX",
									"MONT BLANC",
									"MONT ROUCOUS",
									"OGEU",
									"PIERVAL",
									"ST GEORGES",
									"STE ALIX",
									"THONON",
									"WATTWILLER",
									"AURELE",
									"JOLIVAL",
									"PERRIER",
									"SAN PELLEGRINO",
									"BABOIT",
									"ROZANA",
									"VALS",
									"VICHY CELESTINS",
									"ARCENS",
									"QUEZAC",
									"ST-YORRE",
									"HIGHTLAND SPRING",
									"OREZZA",
									"PAROT",
									"SALVETAT",
									"ST ALBAN",
									"ST YORRE",
									"VERNIERE",
									"BADOIT",
									"CONTREX GREEN",
									"VOLVICJUICY",
									"PERRIER & JUICE",
									"VITTEL UP",
									"VOLVIC JUICY",
									"COCA-COLA",
									"COCA-COLA ZERO",
									"BREIZH COLA",
									"MEUH COLA",
									"COCA COLA",
									"CORSICA COLA",
									"GALVANINA",
									"HAMOUD BOUALEM",
									"PEPSI",
									"PEPSI MAX",
									"QUEBEC",
									"TETES BRULEES MIX & KIFF",
									"LORINA",
									"SCHWEPPES",
									"7UP",
									"BOX",
									"FEVER TREE",
									"SPRITE",
									"BREIZH",
									"BREIZH-LIMO",
									"LA GOSSE",
									"LEMONAID",
									"LIMONETTE",
									"MARIE DOLIN",
									"ORIGINAL TONIC",
									"VOSS",
									"MONSTER ENERGY",
									"RED BULL",
									"CRAZY TIGER",
									"MME GREEN",
									"PSYCHIK",
									"PUMA",
									"DIUKE",
									"HEROIC PLUS",
									"MONSTER",
									"POWERADE",
									"AUCHAN",
									"AUCHAN BIO",
									"C'EST QUI LE PATRON?",
									"POUCE",
									"AUCHAN GOURMET",
									"MADRANGE",
									"MMM!",
									"BROCELIANDE",
									"NATURE DE FRANCE",
									"POULEHOUSE",
									"NESTLE",
									"ST AMAND",
									"VICHY ST YORRE",
									"OASIS",
									"TEISSEIRE",
									"DR PEPPER",
									"CANADA DRY",
									"GINI",
									"MEGA FORCE"
								]

								let label = el?.children[i].children[0].children[0].children[0].innerHTML
								let per_unit_label = ""
								let image = ""
								let uri = ""
								let packaging = ""

								if(label.includes("add-to-shoppinglist")) {
									label = el?.children[i].children[0].children[0].children[2].children[0].children[0].children[0].innerText
									per_unit_label = el?.children[i].children[0].children[0].children[2].children[0].children[2].innerText
									image = el?.children[i].children[0].children[0].children[2].children[1].children[0].children[0].getAttribute("src")
									uri = "https://www.carrefour.fr" + el?.children[i].children[0].children[0].children[2].children[0].children[0].children[0].getAttribute("href")
									packaging = el?.children[i].children[0].children[0].children[2].children[0].children[1].innerText
								}else {
									label = el?.children[i].children[0].children[0].children[3].children[0].children[0].children[0].innerText
									per_unit_label = el?.children[i].children[0].children[0].children[3].children[0].children[2].innerText
									image = el?.children[i].children[0].children[0].children[3].children[1].children[0].children[0].getAttribute("src")
									uri = "https://www.carrefour.fr" + el?.children[i].children[0].children[0].children[3].children[0].children[0].children[0].getAttribute("href")
									packaging = el?.children[i].children[0].children[0].children[3].children[0].children[1].innerText
								}

								let format = el?.children[i].children[0].children[0].children[3]?.children[1]
								let marqueLabel = "SANS MARQUE"

								for(let marque of marques) {
									if(label.toLowerCase().includes("carrefour bio")) {
										marqueLabel = "CARREFOUR BIO"
									}else if(label.toLowerCase().includes("carrefour")) {
										marqueLabel = "CARREFOUR"
									}else if(label.toLowerCase().includes("c'est qui le patron ?!")) {
										marqueLabel = "C'EST QUI LE PATRON ?!"
									}else if(label.toLowerCase().includes("c'est qui le patron")) {
										marqueLabel = "C'EST QUI LE PATRON"
									}else if(label.toLowerCase().includes(marque.toLowerCase())) {
										marqueLabel = marque
									}
								}

								let produit_images = [{
									largest: "https://www.carrefour.fr" + image.replace("280x280", "1500x1500"),
									size_1500x1500: "https://www.carrefour.fr" + image.replace("280x280", "1500x1500"),
									size_540x540: "https://www.carrefour.fr" + image.replace("280x280", "540x540"),
									size_380x380: "https://www.carrefour.fr" + image.replace("280x280", "380x380"),
									size_340x340: "https://www.carrefour.fr" + image.replace("280x280", "340x340"),
									size_340x240: "https://www.carrefour.fr" + image.replace("280x280", "340x240"),
									size_280x280: "https://www.carrefour.fr" + image.replace("280x280", "280x280"),
									size_195x195: "https://www.carrefour.fr" + image.replace("280x280", "195x195"),
									size_150x150: "https://www.carrefour.fr" + image.replace("280x280", "150x150"),
									size_43x43: "https://www.carrefour.fr" + image.replace("280x280", "43x43")
								}]

								products.push({
									label,
									ean: el?.children[i].children[0].getAttribute("id"),
									brand: "",
									slug: slugify(label) + "-" + el?.children[i].children[0].getAttribute("id") + "-" + slugify(packaging),
									uri,
									packaging,
									origin: "",
									format: format ? format.innerText : "",
									price: el?.children[i].children[0].children[1].children[1].children[0].innerText.replace("€", ""),
									unit_of_measure: per_unit_label.split("/")[1].trim(),
									per_unit_label,
									tax_message: "",
									per_unit: per_unit_label.split("/")[0].replace("€", "").trim(),
									provider: {
										connect: {
											label: "CARREFOUR"
										}
									},
									marque: {
										connect: {
											label: marqueLabel.toLowerCase()
										}
									},
									produit_images: {
										create: produit_images
									},
									produit_rayons: { }
								})
							}
						}

						return products
					})

					let produit_rayons = []

					for(let r of rayon.rayons) {
						produit_rayons = [...produit_rayons, {
							rayon:{
								connect: {
									slug: r.slug
								}
							}
						}]
					}

					let products = []
					for(let data of datas) {
						data.produit_rayons = {
							create: produit_rayons
						}
						products = [...products, data]
					}

					result = result.concat(products)
				}

				await page.close();

				results = results.concat(result)
			}

			await browser.close();
			await this.saveProduits(results)
		});
	}
	
	async startScrapingAuchan() {
		Apify.main(async () => {
			const browser = await Apify.launchPuppeteer({stealth: true});

			const page = await browser.newPage()
			await page.goto("https://www.auchan.fr/courses?storeReference=527&lark-b2cd=1&gclid=Cj0KCQjwg8n5BRCdARIsALxKb96rKyvvgqxQeqFUb5t4JQXV3T30PFNhn9-Su5TDZuT2CRlGRe23_ZIaAvh-EALw_wcB");

			let results = []

			for (let rayon of this.rayons) {
				await page.goto(rayon.urlAuchan)

				let datas = await page.$eval('.list__container', el => {
					let products = []

					for (let i in el.children) {
						if(el?.children[i]?.innerText) {
							let marques = [
								"SANS MARQUE",
								"LA MARQUE DU CONSOMMATEUR",
								"AGRILAIT",
								"BASKALIA",
								"BEARN LAIT",
								"C'EST QUI LE PATRON ?!",
								"CANDIA",
								"CARREFOUR BIO",
								"CARREFOUR",
								"ET ALDIA",
								"FAIREFRANCE",
								"GERENTE",
								"GRANDLAIT",
								"J'AIME LE LAIT D'ICI",
								"LACTEL",
								"LACTEL BIO",
								"LAITERIE LES FAYES",
								"LAITIK",
								"LE GALL",
								"LE LAIT DE MA REGION",
								"LE LAIT EQUITABLE SARTHOIS",
								"LE PETIT VENDEEN",
								"LES FAYES",
								"LES LAITIERS RESPONSABLES",
								"MONT LAIT",
								"ONETIK",
								"VERNEUIL",
								"CHARAL",
								"SOCOPA",
								"TENDRE ET PLUS",
								"MAITRE JACQUES",
								"TENDRIADE",
								"JEMANGEFRANÇAIS.COM",
								"BIGARD",
								"HENAFF",
								"METRAS TRIPIER EN PROVENCE",
								"LE MARCHE",
								"PAILLARD",
								"LES BONS MORCEAUX",
								"LES BRASERADES",
								"JOHNSONVILLE",
								"LA BRESSE",
								"NOBLES",
								"ALDELIS",
								"DOUCE FRANCE",
								"MADRANCE",
								"MORITZ",
								"PEGASE",
								"DABIA",
								"DELICADEZAS IBERICAS",
								"GRAND CARACTERE",
								"KLEIN KAROO",
								"LES OCCITANES",
								"LIONOR",
								"SOURIRES DE CAMPAGNE",
								"CLERMONT",
								"COOPERL",
								"DE FAUX FILET",
								"ELIVIA",
								"HIRUAK",
								"INDIANA JERKY",
								"LE GAULOIS",
								"LES ELEVEURS DE CHEZ NOUS",
								"ROYAL HALAL",
								"TRIPES PAILLARD",
								"VIAZUR",
								"refuge_de_marie_louise",
								"REFS.SANS MARQUE",
								"BABY COQUE",
								"COQUY",
								"L'OEUFS DE NOS VILLA",
								"COQUEN'OR",
								"LOUE",
								"COCORETTE",
								"LUSTUCRU",
								"MIELS VILLENEUVE",
								"OEUF ARRADOY",
								"COTEAUX PEYRIGNAC",
								"AVIBRESSE",
								"BISCUITERIE COMTOISE",
								"C'EST QUI LE PATRON",
								"L'OEUF GASCON",
								"LA NOUVELLE AGRICULTURE",
								"MATINES",
								"OEUFS TRADITION",
								"OVALIS",
								"PP BLANC",
								"PP NO NAME",
								"CRF CDM",
								"L'OEUF RIESTAHL",
								"LE CLOS ST JACQUES",
								"LES CAMPAGNES",
								"OEUF CHAMPAG.ARDENNE",
								"OEUF VIEUX PRESSOIR",
								"POULE HOUSE",
								"SARL ROUSSILLON OEUF",
								"SAINT AMAND",
								"VITTEL",
								"CRISTALINE",
								"EVIAN",
								"ABATILLES",
								"COURMAYEUR",
								"HEPAR",
								"PLANCOET",
								"VOLVIC",
								"planet_drinks",
								"CONTREX",
								"MONT BLANC",
								"MONT ROUCOUS",
								"OGEU",
								"PIERVAL",
								"ST GEORGES",
								"STE ALIX",
								"THONON",
								"WATTWILLER",
								"AURELE",
								"JOLIVAL",
								"PERRIER",
								"SAN PELLEGRINO",
								"BABOIT",
								"ROZANA",
								"VALS",
								"VICHY CELESTINS",
								"ARCENS",
								"QUEZAC",
								"ST-YORRE",
								"HIGHTLAND SPRING",
								"OREZZA",
								"PAROT",
								"SALVETAT",
								"ST ALBAN",
								"ST YORRE",
								"VERNIERE",
								"BADOIT",
								"CONTREX GREEN",
								"VOLVICJUICY",
								"PERRIER & JUICE",
								"VITTEL UP",
								"VOLVIC JUICY",
								"COCA-COLA",
								"COCA-COLA ZERO",
								"BREIZH COLA",
								"MEUH COLA",
								"COCA COLA",
								"CORSICA COLA",
								"GALVANINA",
								"HAMOUD BOUALEM",
								"PEPSI",
								"PEPSI MAX",
								"QUEBEC",
								"TETES BRULEES MIX & KIFF",
								"LORINA",
								"SCHWEPPES",
								"7UP",
								"BOX",
								"FEVER TREE",
								"SPRITE",
								"BREIZH",
								"BREIZH-LIMO",
								"LA GOSSE",
								"LEMONAID",
								"LIMONETTE",
								"MARIE DOLIN",
								"ORIGINAL TONIC",
								"VOSS",
								"MONSTER ENERGY",
								"RED BULL",
								"CRAZY TIGER",
								"MME GREEN",
								"PSYCHIK",
								"PUMA",
								"DIUKE",
								"HEROIC PLUS",
								"MONSTER",
								"POWERADE",
								"AUCHAN",
								"AUCHAN BIO",
								"C'EST QUI LE PATRON?",
								"POUCE",
								"AUCHAN GOURMET",
								"MADRANGE",
								"MMM!",
								"BROCELIANDE",
								"NATURE DE FRANCE",
								"POULEHOUSE",
								"NESTLE",
								"ST AMAND",
								"VICHY ST YORRE",
								"OASIS",
								"TEISSEIRE",
								"DR PEPPER",
								"CANADA DRY",
								"GINI",
								"MEGA FORCE"
							]

							let label = ""
							let image = ""
							let packaging = ""
							let format = ""
							let price = ""
							let unit_of_measure = ""
							let per_unit_label = ""
							let per_unit = ""
							let uri = ""

							if(el?.children[i]?.children[0]?.innerHTML !== "") {
								label = el?.children[i]?.children[1]?.children[0]?.children[1]?.children[0]?.innerText
								image = el?.children[i]?.children[1]?.children[0]?.children[0]?.children[0]?.children[1]?.children[0]?.getAttribute("src")
							}else {
								label = el?.children[i]?.children[2]?.children[0]?.children[1]?.children[0]?.innerText
								image = el?.children[i]?.children[2]?.children[0]?.children[0]?.children[0]?.children[1]?.children[0]?.getAttribute("src")
							}

							if(el?.children[i]?.children[1]?.children[0]?.children[0]?.children[0]?.children[0]?.children[0]?.getAttribute("src")) {
								image = el?.children[i]?.children[1]?.children[0]?.children[0]?.children[0]?.children[0]?.children[0]?.getAttribute("src")
							}

							if(el?.children[i]?.children[2]?.children[1]?.children[1]?.children[0]?.children[1]?.innerText.includes("€")) {
								price = el?.children[i]?.children[2]?.children[1]?.children[1]?.children[0]?.children[1]?.innerText.replace("€", "")
							}else {
								price = el?.children[i]?.children[1]?.children[1]?.children[1]?.children[0]?.innerText.replace("€", "")
							}

							if(el?.children[i]?.children[1]?.children[0]?.children[1]?.children[1]?.innerText === "France" || el?.children[i]?.children[1]?.children[0]?.children[1]?.children[1]?.innerText === "Royaume Uni") {
								packaging = el?.children[i]?.children[1]?.children[0]?.children[1]?.children[2]?.children[0]?.innerText
							}else {
								packaging = el?.children[i]?.children[1]?.children[0]?.children[1]?.children[1]?.children[0]?.innerText
							}

							if(el?.children[i]?.children[1]?.children[0]?.children[1]?.children[2]?.children[1]?.innerText.includes("€ / ")) {
								per_unit_label = el?.children[i]?.children[1]?.children[0]?.children[1]?.children[2]?.children[1]?.innerText
							}else if(el?.children[i]?.children[1]?.children[0]?.children[1]?.children[2]?.children[2]?.innerText.includes("€ / ")) {
								per_unit_label = el?.children[i]?.children[1]?.children[0]?.children[1]?.children[2]?.children[2]?.innerText
							}else if(el?.children[i]?.children[1]?.children[0]?.children[1]?.children[2]?.children[3]?.innerText.includes("€ / ")) {
								per_unit_label = el?.children[i]?.children[1]?.children[0]?.children[1]?.children[2]?.children[3]?.innerText
							}else if(el?.children[i]?.children[1]?.children[0]?.children[1]?.children[2]?.children[4]?.innerText.includes("€ / ")) {
								per_unit_label = el?.children[i]?.children[1]?.children[0]?.children[1]?.children[2]?.children[4]?.innerText
							}

							unit_of_measure = per_unit_label.split("/")[1]?.trim()
							per_unit = per_unit_label.split("/")[0]?.replace("€", "").trim()
							uri = "https://www.auchan.fr" + el.children[i]?.children[1]?.children[0]?.getAttribute("href")

							let marqueLabel = "SANS MARQUE"

							for(let marque of marques) {
								if(label?.toLowerCase().includes("auchan bio")) {
									marqueLabel = "AUCHAN BIO"
								}else if(label?.toLowerCase().includes("auchan")) {
									marqueLabel = "AUCHAN"
								}else if(label?.toLowerCase().includes(marque.toLowerCase())) {
									marqueLabel = marque
								}
							}

							let produit_images = [{
								largest: image,
								size_1500x1500: image,
								size_540x540: image,
								size_380x380: image,
								size_340x340: image,
								size_340x240: image,
								size_280x280: image,
								size_195x195: image,
								size_150x150: image,
								size_43x43: image
							}]

							products.push({
								label,
								ean: "",
								brand: "",
								slug: label?.toString().toLowerCase()
										.replace(/\s+/g, '-')           // Replace spaces with -
										.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
										.replace(/\-\-+/g, '-')         // Replace multiple - with single -
										.replace(/^-+/, '')             // Trim - from start of text
										.replace(/-+$/, ''),
								uri,
								packaging,
								origin: "",
								format,
								price,
								unit_of_measure,
								per_unit_label,
								tax_message: "",
								per_unit: per_unit,
								provider: {
									connect: {
										label: "AUCHAN"
									}
								},
								marque: {
									connect: {
										label: marqueLabel.toLowerCase()
									}
								},
								produit_images: {
									create: produit_images
								},
								produit_rayons: { }
							})
						}
					}

					return products
				})

				let produit_rayons = []

				for(let r of rayon.rayons) {
					produit_rayons = [...produit_rayons, {
						rayon:{
							connect: {
								slug: r.slug
							}
						}
					}]
				}

				let products = []
				for(let data of datas) {
					data.produit_rayons = {
						create: produit_rayons
					}
					products = [...products, data]
				}

				results = results.concat(products)
			}

			await this.saveProduits(results)
			await browser.close();
		})
	}

	async saveProduits(products) {
		for(let product of products) {
			//if(product.slug === "cubes-pour-brochette-de-gigot-sans-os-300g") {
			//	console.log(product)
			//}
			let p = await this.ctx.prisma.produit.findOne({
				where: {
					slug: product.slug
				}
			})

			if(!p) {
				await this.ctx.prisma.produit.create({
					data: product
				})
			}
		}
	}

	//endregion
}