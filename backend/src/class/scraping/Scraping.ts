import { GetGen } from "nexus/dist/typegenTypeHelpers";
import CustomError from "../auth/CustomError";
import { Provider } from "@prisma/client";

export default class Scraping {

	//region Protected parameters
	/**
	 * App context
	 * @type GetGen<"context"> | undefined
	 * @default null
	 */
	protected _ctx: GetGen<"context"> | null = null

	/**
	 * Provider
	 * @type Provider | undefined
	 * @default provider
	 */
	//@ts-ignore
	protected _provider: Provider

	/**
	 * Providers
	 * @type Array<string>
	 * @default providers
	 */
	protected _providers: Array<string> = [
		"CARREFOUR"
	]

	/**
	 * Marques
	 * @type any
	 * @default marques by providers
	 */
	protected _marques: any = {
		"CARREFOUR": [
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
	}

	/**
	 * Formats
	 * @type any
	 * @default formats by providers
	 */
	protected _formats: any = {
		"CARREFOUR": [

		]
	}

	/**
	 * labels Qualites
	 * @type any
	 * @default labelsQualites by providers
	 */
	protected _labelsQualites: any = {
		"CARREFOUR": [

		]
	}

	/**
	 * Preferences Alimentaires
	 * @type any
	 * @default preferencesAlimentaires by providers
	 */
	protected _preferencesAlimentaires: any = {
		"CARREFOUR": [

		]
	}

	/**
	 * Promotions
	 * @type any
	 * @default promotions by providers
	 */
	protected _promotions: any = {
		"CARREFOUR": [

		]
	}

	/**
	 * Substances Controversees
	 * @type any
	 * @default substancesControversees by providers
	 */
	protected _substancesControversees: any = {
		"CARREFOUR": [

		]
	}
	//endregion

	//region Getters Setters
	/**
	 * Set context app
	 * @return void
	 * @param ctx
	 */
	public setCtx(ctx: GetGen<"context">): void {
		this._ctx = ctx
	}

	/**
	 * Get context app
	 * @return GetGen<"context">
	 */
	public getCtx(): GetGen<"context"> {
		//@ts-ignore
		return this._ctx
	}

	/**
	 * Set provider
	 * @return void
	 * @param provider
	 */
	public setProvider(provider: Provider): void {
		this._provider = provider
	}

	/**
	 * Get provider
	 * @return Provider
	 */
	public getProvider(): Provider {
		return this._provider
	}

	/**
	 * Set provider
	 * @return void
	 * @param provider
	 */
	public setProviders(providers: Array<string>): void {
		this._providers = providers
	}

	/**
	 * Get provider
	 * @return Array<string>
	 */
	public getProviders(): Array<string> {
		return this._providers
	}

	/**
	 * Set marques
	 * @return void
	 * @param marques
	 */
	public setMarques(marques: any): void {
		this._marques = marques
	}

	/**
	 * Get marques
	 * @return Object
	 */
	public getMarques(): any {
		return this._marques
	}

	/**
	 * Set formats
	 * @return void
	 * @param formats
	 */
	public setFormats(formats: any): void {
		this._formats = formats
	}

	/**
	 * Get marques
	 * @return Object
	 */
	public getFormats(): any {
		return this._formats
	}

	/**
	 * Set labelsQualites
	 * @return void
	 * @param labelsQualites
	 */
	public setLabelsQualites(labelsQualites: any): void {
		this._labelsQualites = labelsQualites
	}

	/**
	 * Get labelsQualites
	 * @return Object
	 */
	public getLabelsQualites(): any {
		return this._labelsQualites
	}

	/**
	 * Set preferencesAlimentaires
	 * @return void
	 * @param preferencesAlimentaires
	 */
	public setPreferencesAlimentaires(preferencesAlimentaires: any): void {
		this._preferencesAlimentaires = preferencesAlimentaires
	}

	/**
	 * Get preferencesAlimentaires
	 * @return Object
	 */
	public getPreferencesAlimentaires(): any {
		return this._preferencesAlimentaires
	}

	/**
	 * Set promotions
	 * @return void
	 * @param marques
	 */
	public setPromotions(promotions: any): void {
		this._promotions = promotions
	}

	/**
	 * Get promotions
	 * @return Object
	 */
	public getPromotions(): any {
		return this._promotions
	}

	/**
	 * Set substancesControversees
	 * @return void
	 * @param marques
	 */
	public setSubstancesControversees(substancesControversees: any): void {
		this._substancesControversees = substancesControversees
	}

	/**
	 * Get substancesControversees
	 * @return Object
	 */
	public getSubstancesControversees(): any {
		return this._substancesControversees
	}
	//endregion

	//region public functions
	public async createPrismaProvider() {
		for(let provider of this.getProviders()){
			const resProvider = await this.getPrismaProvider(provider)
			if(!resProvider) {
				try {
					return await this.getCtx().prisma.provider.create({
						data: {
							label: provider
						}
					})
				} catch (e) {
					CustomError.error("Erreur lors de la création du provider.")
				}
			}
		}

		return ""
	}

	public async createPrismaMarques() {
		for(let provider of this.getProviders()){
			const resProvider = await this.getPrismaProvider(provider)
			if(resProvider) {
				for(let marque of this.getMarques()[`${provider}`]) {
					const resMarque = await this.getPrismaMarque(marque)
					if(!resMarque) {
						try {
							await this.getCtx().prisma.marque.create({
								data: {
									label: marque,
									provider: {
										connect: {
											label: provider,
										}
									}
								}
							})
						} catch (e) {
							console.log(e)
							CustomError.error("Erreur lors de la création de la marque.")
						}
					}
				}
			}
		}

		return ""
	}

	public async createPrismaFormats() {
		for(let provider of this.getProviders()){
			const resProvider = await this.getPrismaProvider(provider)
			if(resProvider) {
				for(let format of this.getFormats()[`${provider}`]) {
					const resMarque = await this.getPrismaFormat(format)
					if(!resMarque) {
						try {
							await this.getCtx().prisma.format.create({
								data: {
									label: format,
									provider: {
										connect: {
											label: provider,
										}
									}
								}
							})
						} catch (e) {
							console.log(e)
							CustomError.error("Erreur lors de la création du format.")
						}
					}
				}
			}
		}

		return ""
	}
	
	public async createPrismaLabelsQualites() {
		for(let provider of this.getProviders()){
			const resProvider = await this.getPrismaProvider(provider)
			if(resProvider) {
				for(let labelsQualite of this.getLabelsQualites()[`${provider}`]) {
					const resMarque = await this.getPrismaLabelsQualite(labelsQualite)
					if(!resMarque) {
						try {
							await this.getCtx().prisma.labelsQualite.create({
								data: {
									label: labelsQualite,
									provider: {
										connect: {
											label: provider,
										}
									}
								}
							})
						} catch (e) {
							CustomError.error("Erreur lors de la création du label qualité.")
						}
					}
				}
			}
		}

		return ""
	}
	
	public async createPrismaPreferencesAlimentaires() {
		for(let provider of this.getProviders()){
			const resProvider = await this.getPrismaProvider(provider)
			if(resProvider) {
				for(let preferencesAlimentaire of this.getPreferencesAlimentaires()[`${provider}`]) {
					const resMarque = await this.getPrismaPreferencesAlimentaires(preferencesAlimentaire)
					if(!resMarque) {
						try {
							await this.getCtx().prisma.preferencesAlimentaire.create({
								data: {
									label: preferencesAlimentaire,
									provider: {
										connect: {
											label: provider,
										}
									}
								}
							})
						} catch (e) {
							CustomError.error("Erreur lors de la création des préférences alimentaires.")
						}
					}
				}
			}
		}

		return ""
	}
	
	public async createPrismaPromotions() {
		for(let provider of this.getProviders()){
			const resProvider = await this.getPrismaProvider(provider)
			if(resProvider) {
				for(let promotion of this.getPromotions()[`${provider}`]) {
					const resMarque = await this.getPrismaPromotion(promotion)
					if(!resMarque) {
						try {
							await this.getCtx().prisma.promotion.create({
								data: {
									label: promotion,
									provider: {
										connect: {
											label: provider,
										}
									}
								}
							})
						} catch (e) {
							console.log(e)
							CustomError.error("Erreur lors de la création des promotions.")
						}
					}
				}
			}
		}

		return ""
	}
	
	public async createPrismaSubstancesControversees() {
		for(let provider of this.getProviders()){
			const resProvider = await this.getPrismaProvider(provider)
			if(resProvider) {
				for(let substancesControversee of this.getSubstancesControversees()[`${provider}`]) {
					const resMarque = await this.getPrismaSubstancesControversee(substancesControversee)
					if(!resMarque) {
						try {
							await this.getCtx().prisma.substancesControverse.create({
								data: {
									label: substancesControversee,
									provider: {
										connect: {
											label: provider,
										}
									}
								}
							})
						} catch (e) {
							console.log(e)
							CustomError.error("Erreur lors de la création des substances controversées.")
						}
					}
				}
			}
		}

		return ""
	}

	public async getPrismaProvider(provider: string): Promise<Provider> {
		// @ts-ignore
		return this.getCtx().prisma.provider.findOne({
			where: {
				label: provider
			}
		})
	}

	public async getPrismaMarque(marque: string) {
		return this.getCtx().prisma.marque.findOne({
			where: {
				label: marque
			}
		})
	}

	public async getPrismaFormat(format: string) {
		return this.getCtx().prisma.format.findOne({
			where: {
				label: format
			}
		})
	}

	public async getPrismaLabelsQualite(format: string) {
		return this.getCtx().prisma.labelsQualite.findOne({
			where: {
				label: format
			}
		})
	}

	public async getPrismaPreferencesAlimentaires(format: string) {
		return this.getCtx().prisma.preferencesAlimentaire.findOne({
			where: {
				label: format
			}
		})
	}

	public async getPrismaPromotion(format: string) {
		return this.getCtx().prisma.promotion.findOne({
			where: {
				label: format
			}
		})
	}

	public async getPrismaSubstancesControversee(format: string) {
		return this.getCtx().prisma.substancesControverse.findOne({
			where: {
				label: format
			}
		})
	}

	public async getPrismaProduits() {
		return this.getCtx().prisma.produit.findMany({
			where: {
				provider_id: this.getProvider().id
			}
		})
	}
	//endregion
}