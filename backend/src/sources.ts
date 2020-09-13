import { ProviderInputDto } from "./modules/providers/dto/provider-input.dto"
import { RayonInputDto } from "./modules/rayons/dto/rayon-input.dto"
import { GroupInputDto } from "./modules/groups/dto/group-input.dto"

export const providers: ProviderInputDto[] = [
	{
		label: "AUCHAN",
		prefixUrl: "https://www.auchan.com"
	},
	{
		label: "CARREFOUR",
		prefixUrl: "https://www.carrefour.fr"
	},
	{
		label: "LABEL_TEST_0 ",
		prefixUrl: "PREFIX_URL_TEST_0 "
	}
]

export const rayons: RayonInputDto[] = [
	{
		code: "R01",
		label: "Crémerie",
		slug: "cremerie",
		uri: "/r/cremerie",
		level: 1
	},
	{
		code: "R01SR01",
		label: "Lait",
		slug: "cremerie/lait",
		uri: "/r/cremerie/lait",
		level: 2
	},
	{
		code: "R01SR01SSR01",
		label: "Lait demi-écrémé",
		slug: "cremerie/lait/lait-demi-ecreme",
		uri: "/r/cremerie/lait/lait-demi-ecreme",
		level: 3
	},
	{
		code: "R01SR01SSR02",
		label: "Lait écrémé",
		slug: "cremerie/lait/lait-ecreme",
		uri: "/r/cremerie/lait/lait-ecreme",
		level: 3
	},
	{
		code: "R01SR01SSR03",
		label: "Lait entier",
		slug: "cremerie/lait/lait-entier",
		uri: "/r/cremerie/lait/lait-entier",
		level: 3
	},
	{
		code: "R01SR02",
		label: "Oeufs",
		slug: "cremerie/oeufs",
		uri: "/r/cremerie/oeufs",
		level: 2
	},
	{
		code: "R02",
		label: "Viandes et Poissons",
		slug: "viandes-et-poissons",
		uri: "/r/viandes-et-poissons",
		level: 1
	},
	{
		code: "R02SR01",
		label: "Boucherie",
		slug: "viandes-et-poissons/boucherie",
		uri: "/r/viandes-et-poissons/boucherie",
		level: 2
	},
	{
		code: "R02SR01SSR01",
		label: "Boeuf",
		slug: "viandes-et-poissons/boucherie/boeuf",
		uri: "/r/viandes-et-poissons/boucherie/boeuf",
		level: 3
	},
	{
		code: "R02SR01SSR02",
		label: "Veau",
		slug: "viandes-et-poissons/boucherie/veau",
		uri: "/r/viandes-et-poissons/boucherie/veau",
		level: 3
	},
	{
		code: "R02SR01SSR03",
		label: "Porc",
		slug: "viandes-et-poissons/boucherie/porc",
		uri: "/r/viandes-et-poissons/boucherie/porc",
		level: 3
	},
	{
		code: "R02SR01SSR04",
		label: "Saucisses et grillades",
		slug: "viandes-et-poissons/boucherie/saucisses-et-grillades",
		uri: "/r/viandes-et-poissons/boucherie/saucisses-et-grillades",
		level: 3
	},
	{
		code: "R02SR02",
		label: "Poissonnerie",
		slug: "viandes-et-poissons/poissonnerie",
		uri: "/r/viandes-et-poissons/poissonnerie",
		level: 2
	},
	{
		code: "R02SR02SSR01",
		label: "Saumons et truites",
		slug: "viandes-et-poissons/poissonnerie/saumons-et-truites",
		uri: "/r/viandes-et-poissons/poissonnerie/saumons-et-truites",
		level: 3
	},
	{
		code: "R02SR02SSR02",
		label: "Filets et pavés",
		slug: "viandes-et-poissons/poissonnerie/filets-et-paves",
		uri: "/r/viandes-et-poissons/poissonnerie/filets-et-paves",
		level: 3
	},
	{
		code: "R02SR02SSR03",
		label: "Crevettes et fruits de mer",
		slug: "viandes-et-poissons/poissonnerie/crevettes-et-fruits-de-mer",
		uri: "/r/viandes-et-poissons/poissonnerie/crevettes-et-fruits-de-mer",
		level: 3
	},
	{
		code: "R03",
		label: "Boissons sans alcool",
		slug: "boissons-sans-alcool",
		uri: "/r/boissons-sans-alcool",
		level: 1
	},
	{
		code: "R03SR01",
		label: "Eaux",
		slug: "boissons-sans-alcool/eaux",
		uri: "/r/boissons-sans-alcool/eaux",
		level: 2
	},
	{
		code: "R03SR01SSR01",
		label: "Eaux plates",
		slug: "boissons-sans-alcool/eaux/eaux-plates",
		uri: "/r/boissons-sans-alcool/eaux/eaux-plates",
		level: 3
	},
	{
		code: "R03SR01SSR02",
		label: "Eaux gazeuses",
		slug: "boissons-sans-alcool/eaux/eaux-gazeuses",
		uri: "/r/boissons-sans-alcool/eaux/eaux-gazeuses",
		level: 3
	},
	{
		code: "R03SR01SSR03",
		label: "Eaux aromatisées",
		slug: "boissons-sans-alcool/eaux/eaux-aromatisees",
		uri: "/r/boissons-sans-alcool/eaux/eaux-aromatisees",
		level: 3
	},
	{
		code: "R03SR02",
		label: "Colas, Thés glacés et Soft drinks",
		slug: "boissons-sans-alcool/colas-thes-glaces-et-soft-drinks",
		uri: "/r/boissons-sans-alcool/colas-thes-glaces-et-soft-drinks",
		level: 2
	},
	{
		code: "R03SR02SSR01",
		label: "Colas",
		slug: "boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/colas",
		uri: "/r/boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/colas",
		level: 3
	},
	{
		code: "R03SR02SSR02",
		label: "Limonades, Limes et Tonics",
		slug: "boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/limonades-limes-et-tonics",
		uri: "/r/boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/limonades-limes-et-tonics",
		level: 3
	},
	{
		code: "R03SR02SSR03",
		label: "Boissons sports et Energisantes",
		slug: "boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/boissons-sports-et-energisantes",
		uri: "/r/boissons-sans-alcool/colas-thes-glaces-et-soft-drinks/boissons-sports-et-energisantes",
		level: 3
	}
]

export const groups: GroupInputDto[] = [
	{
		label: "Lait demi-écrémé",
		slug: "lait-demi-ecreme",
		type: "lait",
		urlCarrefour: "https://www.carrefour.fr/r/cremerie/lait-boissons-lactees-et-vegetales/demi-ecreme?noRedirect=1",
		urlAuchan: "https://www.auchan.fr/produits-laitiers-oeufs-fromages/cremerie-oeufs-laits/laits/lait-demi-ecreme/ca-n01010101",
		rayons: [
			{
				label: "Crémerie"
			},
			{
				label: "Lait"
			},
			{
				label: "Lait demi-écrémé"
			}
		]
	},
	{
		label: "Lait écrémé",
		slug: "lait-ecreme",
		type: "lait",
		urlCarrefour: "https://www.carrefour.fr/r/cremerie/lait-boissons-lactees-et-vegetales/ecreme?noRedirect=1",
		urlAuchan: "https://www.auchan.fr/produits-laitiers-oeufs-fromages/cremerie-oeufs-laits/laits/lait-ecreme/ca-n01010102",
		rayons: [
			{
				label: "Crémerie"
			},
			{
				label: "Lait"
			},
			{
				label: "Lait écrémé"
			}
		]
	},
	{
		label: "Lait entier",
		slug: "lait-entier",
		type: "lait",
		urlCarrefour: "https://www.carrefour.fr/r/cremerie/lait-boissons-lactees-et-vegetales/entier?noRedirect=1",
		urlAuchan: "https://www.auchan.fr/produits-laitiers-oeufs-fromages/cremerie-oeufs-laits/laits/lait-entier/ca-n01010103",
		rayons: [
			{
				label: "Crémerie"
			},
			{
				label: "Lait"
			},
			{
				label: "Lait entier"
			}
		]
	}
]