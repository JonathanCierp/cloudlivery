// Classes
import CustomError from "../error/CustomError"
// Types
import { GetGen } from "nexus-plugin-prisma/dist/schema/typegen"
import { Provider, Marque, Format, LabelsQualite, PreferencesAlimentaire, Promotion, SubstancesControversee, Rayon } from "../../types/scraping"

/*provider: {
	connect: {
		label: provider,
	}
}*/

export default class Scraping {

	//region Protected parameters
	/**
	 * App context
	 * @type GetGen<any> | undefined
	 * @default undefined
	 */
	ctx: GetGen<any> | undefined

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
	providers: Array<string> = [
		"CARREFOUR"
	]

	/**
	 * Marques
	 * @type Array<string>
	 * @default marques by providers
	 */
	marques: Array<string> = [
		"ABATILLES",
		"AGRILAIT",
		"ALDELIS",
		"ALSACE LAIT",
		"ANCHOIS ROQUES",
		"ANGULAS AGUINAGA",
		"APPETI' MARINE",
		"ARCENS",
		"ATELIER BLINI",
		"AURELE",
		"AUTHENTIQUE GREC BY IFANTIS",
		"BADOIT",
		"BASKALIA",
		"BIO LOGIK",
		"BIOPYRENEES",
		"BLASON D'OR",
		"BLINI",
		"BONNE MAMAN",
		"BOURGAIN",
		"BREIZH COLA",
		"BREIZH SAVEURS",
		"BRIOCHE PASQUIER",
		"CALIN",
		"CANDIA",
		"CAP OCEAN",
		"CARREFOUR",
		"CARREFOUR CLASSIC'",
		"CAVIAR DE L'ISLE",
		"CAZAUBON",
		"C'EST QUI LE PATRON",
		"CHARAL",
		"CITE MARINE",
		"COCA-COLA",
		"COCA-COLA-ZERO",
		"COMPAGNIE DES PECHES",
		"COMPTOIR SUSHI",
		"CONSERV. PROVENCALES",
		"CONTREX",
		"CORAYA",
		"CORSICA COLA",
		"COURMAYEUR",
		"CRISTALINE",
		"CULTIMER",
		"DANONE",
		"DELICADEZAS IBERICAS",
		"DELICE MORNANTAIS",
		"DELICEMER",
		"DELPEYRAT",
		"DELPIERRE",
		"DUO LOZERE",
		"ETREZ",
		"EVIAN",
		"EYGUEBELLE",
		"FAUCHON",
		"FERME COLLET",
		"FERME DE LA BAZINIERE",
		"FERMIERS DE LOUE",
		"FJORD",
		"FLEURY MICHON",
		"FORCE BIO",
		"FOURNIER ET FILS",
		"FOURNIER FILS",
		"FRUIS",
		"FRUISS",
		"FUN BLUE",
		"GALVANINA",
		"GERVITA",
		"GIRALP",
		"GU",
		"GUY SANCHES",
		"GUYADER",
		"HAMOUD BOUALEM",
		"HAPPY YOURS",
		"HENAFF",
		"HEPAR",
		"HIGHTLAND SPRING",
		"ILE BLEUE",
		"JARDIN BIO",
		"JOCKEY",
		"JOKER",
		"JOLIVAL",
		"KER RONAN",
		"KIMURA",
		"KRISTSEN",
		"LA BRESSANE",
		"LA LAITIERE",
		"LA MAISON GUIOT",
		"LA MARQUE DU CONSOMMATEUR",
		"LA MONEGASQUE",
		"LA NOUVELLE AGRICULTURE",
		"LA P'TITE SAUCE DU POISSONNIER",
		"LABEYRIE",
		"LACTER",
		"LAITERIE LES FAYES",
		"LAITIERE DE LA MOTTE",
		"LARTIGAU",
		"L'ASSIETTE BLEUE",
		"LE CRAULOIS",
		"LE DELICE MORNANTAIS",
		"LE GAULOIS",
		"LE MARCHE",
		"LE MARMITON",
		"LE MONDE DU SAUMON",
		"LE PETIT FUME",
		"LEGENDES DU POITOU",
		"LES 2 VACHE",
		"LES 300 & BIO",
		"LES BONS METS BIO",
		"LES BONS MORCEAUX",
		"LES ENTREES DE LA MER",
		"LES FAYES",
		"LES LAITIERS RESPONSABLES-YOPLAIT",
		"LES NATURELS",
		"LES VOLAILLES DE NOS REGIONS",
		"LOUE",
		"MAIRIE DOLIN",
		"MAISON BRIAU",
		"MAITRE COQ",
		"MALO",
		"MANGAJO",
		"MAREDOC",
		"MARIE-AMELIE",
		"MAXIM'S DE PARIS",
		"MISS ALGAE",
		"MITI",
		"MONIN",
		"MONT BLANC",
		"MONT ROUCOUS",
		"MORITZ",
		"MOULIN DE VALDONNE",
		"MOWI",
		"OASIS",
		"OCEALLIANCE",
		"OGEU",
		"OREO",
		"OREZZA",
		"PAC",
		"PALAIS DES METS",
		"PAROT",
		"PECHALOU",
		"PECHERIES SETOISES",
		"PECHEUR DE SAVEURS",
		"PECHEURS DES CALANQUES",
		"PEPSI MAX",
		"PÈRE DODU",
		"PERLE DE LAI",
		"PERRIER",
		"PETIT PRIX",
		"PETIT YOPLAIT",
		"PIAF",
		"PIERVAL",
		"PLANCOET",
		"PLEIN FRUIT",
		"POUSSE EN CLAIRE",
		"PREMIER",
		"PRESSADE",
		"QUEBEC",
		"QUEZAC",
		"REGHALAL",
		"REO",
		"RIANS",
		"ROLMER",
		"ROYAN FRAIS",
		"ROZANA",
		"SACRE BLEU",
		"SAINT AMAND",
		"SAINT AMOUR",
		"SALVETAT",
		"SAN PELLEGRINO",
		"SAVOI YAOURT",
		"SIGGI'S",
		"SIMON",
		"SIROP SPORT",
		"ST GEORGES",
		"ST YORRE",
		"STE ALIX",
		"ST-YORRE",
		"SUNTAT",
		"SUSHI DAILY",
		"SUSHI MARKET",
		"TEISSIERE",
		"TENDRE ET PLUS",
		"TETES BRULEES MIX & KIFF",
		"THONON",
		"TOBLERONE",
		"TRADITION BRETONNE",
		"TROPICANA",
		"VALLEE VERTE",
		"VALS",
		"VEDRENNE",
		"VELOUTE",
		"VERNIERE",
		"VICHY CELESTINS",
		"VITTEL",
		"VOLAILLE FRANCAISE",
		"VOLVIC",
		"WATTWILLER",
		"WILLIAM & JAMES",
		"YAOS",
		"YARDEN",
		"YOPLAIT",
		"VRAI"
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

	rayons: Array<Rayon> = [
		{
			label: "Crémerie",
			code: "CAR01",
			slug: "cremerie",
			uri: "cremerie",
			level: 1,
			resultats: 335,
			scraping: false
		},
		{
			label: "Oeufs",
			code: "CAR01F01",
			slug: "oeufs",
			uri: "cremerie/oeufs",
			level: 2,
			resultats: 138,
			scraping: true
		},
		{
			label: "Yaourts, desserts et spécialités végétales",
			code: "CAR01F02",
			slug: "yaourts-desserts-et-specialites-vegetales",
			uri: "cremerie/yaourts-desserts-et-specialites-vegetales",
			level: 2,
			resultats: 197,
			scraping: false
		},
		{
			label: "Yaourts et fromages blancs natures",
			code: "CAR01F02SF01",
			slug: "yaourts-et-fromages-blancs-natures",
			uri: "cremerie/yaourts-desserts-et-specialites-vegetales/yaourts-et-fromages-blancs-natures",
			level: 3,
			resultats: 152,
			scraping: true
		},
		{
			label: "Desserts pâtissiers et italiens",
			code: "CAR01F02SF02",
			slug: "desserts-patissiers-et-italiens",
			uri: "cremerie/yaourts-desserts-et-specialites-vegetales/desserts-patissiers-et-italiens",
			level: 3,
			resultats: 45,
			scraping: true
		},
		{
			label: "Viandes et Poissons",
			code: "CAR02",
			slug: "viandes-et-poissons",
			uri: "viandes-et-poissons",
			level: 1,
			resultats: 576,
			scraping: false
		},
		{
			label: "Boucherie",
			code: "CAR02F01",
			slug: "boucherie",
			uri: "viandes-et-poissons/boucherie",
			level: 2,
			resultats: 281,
			scraping: false
		},
		{
			label: "Porc",
			code: "CAR02F01SF01",
			slug: "porc",
			uri: "viandes-et-poissons/boucherie/porc",
			level: 3,
			resultats: 68,
			scraping: true
		},
		{
			label: "Porc",
			code: "CAR02F01SF01",
			slug: "porc",
			uri: "viandes-et-poissons/boucherie/porc",
			level: 3,
			resultats: 68,
			scraping: true
		},
		{
			label: "Veau",
			code: "CAR02F01SF02",
			slug: "veau",
			uri: "viandes-et-poissons/boucherie/veau",
			level: 3,
			resultats: 33,
			scraping: true
		},
		{
			label: "Boeuf",
			code: "CAR02F01SF03",
			slug: "boeuf",
			uri: "viandes-et-poissons/boucherie/boeuf",
			level: 3,
			resultats: 180,
			scraping: true
		},
		{
			label: "Poulets",
			code: "CAR02F02SF01",
			slug: "poulets",
			uri: "viandes-et-poissons/volaille-et-rotisserie/poulets",
			level: 3,
			resultats: 115,
			scraping: true
		},
		{
			label: "Dindes",
			code: "CAR02F02SF02",
			slug: "dindes",
			uri: "viandes-et-poissons/volaille-et-rotisserie/dindes",
			level: 3,
			resultats: 34,
			scraping: true
		},
		{
			label: "Poulets",
			code: "CAR02F02SF01",
			slug: "poulets",
			uri: "viandes-et-poissons/volaille-et-rotisserie/poulets",
			level: 3,
			resultats: 115,
			scraping: true
		},
		{
			label: "Poissonnerie",
			code: "CAR02F03",
			slug: "poissonnerie",
			uri: "viandes-et-poissons/poissonnerie",
			level: 2,
			resultats: 146,
			scraping: false
		},
		{
			label: "Saumons et truites",
			code: "CAR02F03SF01",
			slug: "saumons-et-truites",
			uri: "viandes-et-poissons/saumons-et-truites",
			level: 3,
			resultats: 37,
			scraping: true
		},
		{
			label: "Crevettes et Fruits de mer",
			code: "CAR02F03SF02",
			slug: "crevettes-et-fruits-de-mer",
			uri: "viandes-et-poissons/crevettes-et-fruits-de-mer",
			level: 3,
			resultats: 109,
			scraping: true
		},
		{
			label: "Boissons sans alcool",
			code: "CAR03",
			slug: "boissons-sans-alcool",
			uri: "boissons-sans-alcool",
			level: 1,
			resultats: 342,
			scraping: false
		},
		{
			label: "Laits, Boissons lactées et Végétales",
			code: "CAR03F01",
			slug: "laits-boissons-lactees-et-vegetales",
			uri: "boissons-sans-alcool/laits-boissons-lactees-et-vegetales",
			level: 2,
			resultats: 18,
			scraping: false
		},
		{
			label: "Écrémé",
			code: "CAR03F01SF01",
			slug: "ecreme",
			uri: "boissons-sans-alcool/laits-boissons-lactees-et-vegetales/ecreme",
			level: 3,
			resultats: 18,
			scraping: true
		},
		{
			label: "Eaux",
			code: "CAR03F02",
			slug: "eaux",
			uri: "boissons-sans-alcool/eaux",
			level: 2,
			resultats: 114,
			scraping: false
		},
		{
			label: "Eaux gazeuses",
			code: "CAR03F02SF01",
			slug: "eaux-gazeuses",
			uri: "boissons-sans-alcool/eaux/eaux-gazeuses",
			level: 3,
			resultats: 48,
			scraping: true
		},
		{
			label: "Eaux plates",
			code: "CAR03F02SF02",
			slug: "eaux-plates",
			uri: "boissons-sans-alcool/eaux/eaux-plates",
			level: 3,
			resultats: 66,
			scraping: true
		},
		{
			label: "Jus de fruits et de légumes",
			code: "CAR03F03",
			slug: "jus-de-fruits-et-de-legumes",
			uri: "boissons-sans-alcool/jus-de-fruits-et-de-legumes",
			level: 2,
			resultats: 54,
			scraping: false
		},
		{
			label: "Jus d'orange",
			code: "CAR03F03SF01",
			slug: "jus-d-orange",
			uri: "boissons-sans-alcool/jus-de-fruits-et-de-legumes/jus-d-orange",
			level: 3,
			resultats: 54,
			scraping: true
		},
		{
			label: "Colas, Thés glacés et Soft drinks",
			code: "CAR03F04",
			slug: "colas-thes-glaces-et-soft-drinks",
			uri: "boissons-sans-alcool/colas-thes-glaces-et-soft-drinks",
			level: 2,
			resultats: 41,
			scraping: false
		},
		{
			label: "Colas",
			code: "CAR03F04SF01",
			slug: "colas",
			uri: "boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/colas",
			level: 3,
			resultats: 41,
			scraping: true
		},
		{
			label: "Sirops et Boissons concentrées",
			code: "CAR03F05",
			slug: "sirops-et-boissons-concentrees",
			uri: "boissons-sans-alcool/sirops-et-boissons-concentrees",
			level: 2,
			resultats: 115,
			scraping: false
		},
		{
			label: "Sirops",
			code: "CAR03F05SF01",
			slug: "sirops",
			uri: "boissons-sans-alcool/sirops-et-boissons-concentrees/sirops",
			level: 3,
			resultats: 115,
			scraping: true
		}
	]
	//endregion

	//region public functions
	/**
	 * Create providers
	 * @return Promise<void>
	 */
	public async createPrismaProvider(): Promise<void> {
		for(let provider of this.providers){
			const resProvider = await this.getPrismaProvider(provider)
			if(!resProvider) {
				try {
					return await this.ctx.prisma.provider.create({
						data: {
							label: provider
						}
					})
				} catch (e) {
					CustomError.error("Erreur lors de la création du provider.")
				}
			}
		}
	}

	/**
	 * Create marques
	 * @return Promise<void>
	 */
	public async createPrismaMarques(): Promise<void> {
		for(let marque of this.marques) {
			const resMarque = await this.getPrismaMarque(marque)
			if(!resMarque) {
				try {
					await this.ctx.prisma.marque.create({
						data: {
							label: marque
						}
					})
				} catch (e) {
					CustomError.error("Erreur lors de la création de la marque.")
				}
			}
		}
	}

	/**
	 * Create formats
	 * @return Promise<void>
	 */
	public async createPrismaFormats(): Promise<void> {
		for(let format of this.formats) {
			const resFormat = await this.getPrismaFormat(format)
			if(!resFormat) {
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
	}

	/**
	 * Create labels qualites
	 * @return Promise<void>
	 */
	public async createPrismaLabelsQualites(): Promise<void> {
		for(let labelsQualite of this.labelsQualites) {
			const resLabelsQualite = await this.getPrismaLabelsQualite(labelsQualite)
			if(!resLabelsQualite) {
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
	}

	/**
	 * Create preferences alimentaires
	 * @return Promise<void>
	 */
	public async createPrismaPreferencesAlimentaires(): Promise<void> {
		for(let preferencesAlimentaire of this.preferencesAlimentaires) {
			const resPreferencesAlimentaire = await this.getPrismaPreferencesAlimentaire(preferencesAlimentaire)
			if(!resPreferencesAlimentaire) {
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
	}

	/**
	 * Create promotions
	 * @return Promise<void>
	 */
	public async createPrismaPromotions(): Promise<void> {
		for(let promotion of this.promotions) {
			const resPromotion = await this.getPrismaPromotion(promotion)
			if(!resPromotion) {
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
	}

	/**
	 * Create substances controversees
	 * @return Promise<void>
	 */
	public async createPrismaSubstancesControversees(): Promise<void> {
		for(let substancesControversee of this.substancesControversees) {
			const resSubstancesControversee = await this.getPrismaSubstancesControversee(substancesControversee)
			if(!resSubstancesControversee) {
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
	}

	/**
	 * Create rayons
	 * @return Promise<void>
	 */
	public async createPrismaRayons(): Promise<void> {
		for(let rayon of this.rayons) {
			const resRayon = await this.getPrismaRayon(rayon.label)
			if(!resRayon) {
				try {
					await this.ctx.prisma.rayon.create({
						data: {
							label: rayon.label,
							code: rayon.code,
							slug: rayon.slug,
							uri: rayon.uri,
							level: rayon.level,
							resultats: rayon.resultats,
							scraping: rayon.scraping,
							provider: {
								connect: {
									// TODO : change label for other provider
									label: "CARREFOUR",
								}
							}
						}
					})
				} catch (e) {
					console.log(e)
					CustomError.error("Erreur lors de la création des rayons.")
				}
			}
		}
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
	//endregion
}