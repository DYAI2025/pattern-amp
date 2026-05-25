import { SupabaseLoadResult } from './supabaseUserDataLoader';

export interface UserPatternStateBackend {
  activeUserId: string;
  elements: {
    wood: number;
    metal: number;
    fire: number;
    water: number;
    earth: number;
  };
  moonScorpioIntensity: number;
  alignmentIndex: number;
  lastCalculated: string;
  provenanceId: string;
}

export function buildUserPatternState(userData: SupabaseLoadResult): UserPatternStateBackend {
  // Extract data arrays from successful results
  const profile = userData.tables['profiles']?.data?.[0];
  const bd = userData.tables['birth_data']?.data?.[0];
  const ap = userData.tables['astro_profiles']?.data?.[0];
  const qs = userData.tables['quiz_sessions']?.data || [];
  const ac = userData.tables['agent_conversations']?.data || [];
  const eh = userData.tables['eve_hypotheses']?.data || [];
  const sw = userData.tables['space_weather_cache']?.data || [];

  // Determine key strength components
  const woodVal = bd?.wood_strength ?? ap?.natal_wood_strength ?? bd?.natal_wood_strength ?? 0.85;
  const metalVal = bd?.metal_strength ?? ap?.natal_metal_strength ?? bd?.natal_metal_strength ?? 0.30;
  
  // Convert fractions to standard percentages (0-100) or keep as-is with fallback
  const wood = Math.round(Number(woodVal) * 100) || 72;
  const metal = Math.round(Number(metalVal) * 100) || 18;
  const fire = bd?.fire_strength ? Math.round(Number(bd.fire_strength) * 100) : 48;
  const water = bd?.water_strength ? Math.round(Number(bd.water_strength) * 100) : 55;
  const earth = bd?.earth_strength ? Math.round(Number(bd.earth_strength) * 100) : 42;

  // Space weather count influences MoonScorpio intensity or transit pressure
  const moonIntensity = 70 + Math.min(30, sw.length * 5); // baseline 70 plus global cache adjustments
  
  // Calculate aggregate alignment index (0-10 or 0-100)
  // Counts of quiz sessions and agent reflections reinforce harmony balance
  let rawAlignment = 50 + (qs.length * 6) + (ac.length * 4) + (eh.length * 5);
  const alignmentIndex = Math.max(10, Math.min(100, rawAlignment));

  const runSeedId = Math.random().toString(36).substring(2, 8);

  return {
    activeUserId: userData.activeUserId,
    elements: {
      wood: Math.max(1, Math.min(100, wood)),
      metal: Math.max(1, Math.min(100, metal)),
      fire: Math.max(1, Math.min(100, fire)),
      water: Math.max(1, Math.min(100, water)),
      earth: Math.max(1, Math.min(100, earth))
    },
    moonScorpioIntensity: Math.max(1, Math.min(100, moonIntensity)),
    alignmentIndex: Math.max(1, Math.min(100, alignmentIndex)),
    lastCalculated: new Date().toISOString(),
    provenanceId: `prov_fused_72_${runSeedId}`
  };
}
