import casaAltosPiaui from '../assets/images/casa_altos_piaui_1794690136551.jpg';
import casaDirceuClean from '../assets/images/casa_dirceu_clean_1794690147926.jpg';
import casaTimonMaranhao from '../assets/images/casa_timon_maranhao_1794702372242.jpg';
import casaZonaSulClean from '../assets/images/casa_zonasul_clean_1794690148412.jpg';
import heroLuxuryVilla from '../assets/images/hero_luxury_villa_1794686197772.jpg';
import launchFloorplanBlueprint from '../assets/images/launch_floorplan_blueprint_1794686201081.jpg';
import launchHorizonTower from '../assets/images/launch_horizon_tower_1794686200386.jpg';
import launchParqueVilleClean from '../assets/images/launch_parque_ville_clean_1794764337973.jpg';
import launchPorDoSolClean from '../assets/images/launch_por_do_sol_clean_1794764338325.jpg';
import parqueVilleNorte from '../assets/images/parque_ville_norte_1794702371479.jpg';
import propCommercialTower from '../assets/images/prop_commercial_tower_1794686199606.jpg';
import propLuxuryApartmentSuite from '../assets/images/prop_luxury_apartment_suite_1794686198842.jpg';
import propModernHouseFacade from '../assets/images/prop_modern_house_facade_1794686198698.jpg';
import propPenthouseLiving from '../assets/images/prop_penthouse_living_1794686197879.jpg';
import teamConsultantPortrait from '../assets/images/team_consultant_portrait_1794686200683.jpg';
import villageGardenLeste from '../assets/images/village_garden_leste_1794702372472.jpg';

const ASSET_MAP: Record<string, string> = {
  '/src/assets/images/hero_luxury_villa_1794686197772.jpg': heroLuxuryVilla,
  '/src/assets/images/prop_penthouse_living_1794686197879.jpg':
    propPenthouseLiving,
  '/src/assets/images/prop_modern_house_facade_1794686198698.jpg':
    propModernHouseFacade,
  '/src/assets/images/prop_luxury_apartment_suite_1794686198842.jpg':
    propLuxuryApartmentSuite,
  '/src/assets/images/prop_commercial_tower_1794686199606.jpg':
    propCommercialTower,
  '/src/assets/images/launch_horizon_tower_1794686200386.jpg':
    launchHorizonTower,
  '/src/assets/images/launch_floorplan_blueprint_1794686201081.jpg':
    launchFloorplanBlueprint,
  '/src/assets/images/team_consultant_portrait_1794686200683.jpg':
    teamConsultantPortrait,
  '/src/assets/images/casa_dirceu_clean_1794690147926.jpg': casaDirceuClean,
  '/src/assets/images/casa_zonasul_clean_1794690148412.jpg': casaZonaSulClean,
  '/src/assets/images/casa_altos_piaui_1794690136551.jpg': casaAltosPiaui,
  '/src/assets/images/parque_ville_norte_1794702371479.jpg': parqueVilleNorte,
  '/src/assets/images/village_garden_leste_1794702372472.jpg':
    villageGardenLeste,
  '/src/assets/images/casa_timon_maranhao_1794702372242.jpg': casaTimonMaranhao,
};

export const GALLERY_PRESETS = [
  {
    label: 'Parque Ville — Zona Norte (Teresina/PI)',
    url: '/src/assets/images/parque_ville_norte_1794702371479.jpg',
  },
  {
    label: 'Village Garden II — Zona Leste (Teresina/PI)',
    url: '/src/assets/images/village_garden_leste_1794702372472.jpg',
  },
  {
    label: 'Casa Moderna — Dirceu (Teresina/PI)',
    url: '/src/assets/images/casa_dirceu_clean_1794690147926.jpg',
  },
  {
    label: 'Casa Residencial — Zona Sul (Teresina/PI)',
    url: '/src/assets/images/casa_zonasul_clean_1794690148412.jpg',
  },
  {
    label: 'Casa com Varanda — Altos/PI',
    url: '/src/assets/images/casa_altos_piaui_1794690136551.jpg',
  },
  {
    label: 'Casa Moderna — Timon/MA',
    url: '/src/assets/images/casa_timon_maranhao_1794702372242.jpg',
  },
  {
    label: 'Casa em Condomínio (Jardim)',
    url: '/src/assets/images/prop_modern_house_facade_1794686198698.jpg',
  },
  {
    label: 'Apartamento Gourmet (Interior)',
    url: '/src/assets/images/prop_luxury_apartment_suite_1794686198842.jpg',
  },
  {
    label: 'Mansão Contemporânea (Fachada)',
    url: '/src/assets/images/hero_luxury_villa_1794686197772.jpg',
  },
  {
    label: 'Cobertura Duplex (Living)',
    url: '/src/assets/images/prop_penthouse_living_1794686197879.jpg',
  },
];

export const CONSULTANT_PORTRAIT = teamConsultantPortrait;
export const HERO_BANNER_IMAGE = heroLuxuryVilla;
export const CASA_DIRCEU_IMAGE = casaDirceuClean;
export const CASA_ZONA_SUL_IMAGE = casaZonaSulClean;
export const CASA_ALTOS_IMAGE = casaAltosPiaui;
export const LAUNCH_PARQUE_VILLE_IMAGE = launchParqueVilleClean;
export const LAUNCH_POR_DO_SOL_IMAGE = launchPorDoSolClean;

export function resolveAssetUrl(url: string | undefined): string {
  if (!url) return propPenthouseLiving;
  return ASSET_MAP[url] || url;
}
