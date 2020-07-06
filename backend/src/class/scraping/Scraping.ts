import { GetGen } from "nexus/dist/typegenTypeHelpers";
import CustomError from "../auth/CustomError";

export default class Scraping {

	//region Protected parameters
	/**
	 * App context
	 * @type GetGen<"context"> | undefined
	 * @default null
	 */
	protected _ctx: GetGen<"context"> | null = null

	protected _provider: Array<string> = [
		"CARREFOUR"
	]

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
	public setProvider(provider: Array<string>): void {
		this._provider = provider
	}

	/**
	 * Get provider
	 * @return Array<string>
	 */
	public getProvider(): Array<string> {
		return this._provider
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
	//endregion

	//region public functions
	public async createPrismaProvider() {
		for(let provider of this.getProvider()){
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

	public async getPrismaProvider(provider: string) {
		return this.getCtx().prisma.provider.findOne({
			where: {
				label: provider
			}
		})
	}

	public async createPrismaMarques() {
		for(let provider of this.getProvider()){
			const resProvider = await this.getPrismaProvider(provider)
			if(resProvider) {
				for(let marque of this.getMarques()[`${provider}`]) {
					const resMarque = await this.getPrismaMarque(marque)
					if(!resMarque) {
						try {
							return await this.getCtx().prisma.marque.create({
								data: {
									provider_id: resProvider.id,
									label: marque
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

	public async getPrismaMarque(marque: string) {
		return this.getCtx().prisma.marque.findOne({
			where: {
				label: marque
			}
		})
	}
	//endregion
}