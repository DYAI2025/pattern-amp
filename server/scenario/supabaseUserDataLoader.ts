import { createClient } from '@supabase/supabase-js';

export interface SupabaseLoadResult {
  activeUserId: string;
  source: 'supabase_server';
  tables: Record<string, {
    tableName: string;
    queryColumn: string;
    rowCount: number;
    status: 'success' | 'empty' | 'missing' | 'permission_error' | 'disabled';
    data?: any;
    error?: string;
  }>;
}

export async function loadSupabaseUserData(activeUserId: string): Promise<SupabaseLoadResult> {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  const enableEve = process.env.ENABLE_EVE_TABLE_READS === 'true';

  const result: SupabaseLoadResult = {
    activeUserId,
    source: 'supabase_server',
    tables: {}
  };

  if (!supabaseUrl || !supabaseKey) {
    const defaultTables = [
      'profiles', 'birth_data', 'natal_charts', 'astro_profiles',
      'agent_conversations', 'contribution_events', 'quiz_sessions', 'user_signature_state',
      'daily_horoscope_cache', 'daily_pulses', 'daily_interpretations', 'space_weather_cache',
      'eve_narrative_profiles', 'eve_sessions', 'eve_anchors'
    ];
    for (const t of defaultTables) {
      result.tables[t] = {
        tableName: t,
        queryColumn: 'user_id',
        rowCount: 0,
        status: 'disabled',
        error: 'Supabase URL/Key environment variables are unconfigured.'
      };
    }
    return result;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Helper to fetch individual table data safely
  async function fetchTable(table: string, possibleCols: string[], forceGlobal = false) {
    if (forceGlobal) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(50);
        if (error) {
          const isMissing = error.code === '42P01' || error.message?.includes('does not exist');
          const isPermission = error.code === '42501' || error.message?.includes('permission');
          result.tables[table] = {
            tableName: table,
            queryColumn: 'none (global)',
            rowCount: 0,
            status: isMissing ? 'missing' : (isPermission ? 'permission_error' : 'disabled'),
            error: error.message
          };
          return null;
        }
        result.tables[table] = {
          tableName: table,
          queryColumn: 'none (global)',
          rowCount: data?.length || 0,
          status: data && data.length > 0 ? 'success' : 'empty',
          data: data || []
        };
        return data;
      } catch (err: any) {
        result.tables[table] = {
          tableName: table,
          queryColumn: 'none (global)',
          rowCount: 0,
          status: 'disabled',
          error: err?.message || String(err)
        };
        return null;
      }
    }

    let loadedData: any[] | null = null;
    let lastError: any = null;
    let selectedCol = 'user_id';

    for (const col of possibleCols) {
      try {
        const { data, error } = await supabase.from(table).select('*').eq(col, activeUserId);
        if (error) {
          lastError = error;
          if (error.code === '42703') { // undefined column, try next
            continue;
          }
          break;
        }
        loadedData = data;
        selectedCol = col;
        break;
      } catch (err: any) {
        lastError = err;
      }
    }

    if (lastError && !loadedData) {
      const isMissing = lastError.code === '42P01' || lastError.message?.includes('does not exist') || lastError.message?.includes('relation');
      const isPermission = lastError.code === '42501' || lastError.message?.includes('permission');
      result.tables[table] = {
        tableName: table,
        queryColumn: 'multiple',
        rowCount: 0,
        status: isMissing ? 'missing' : (isPermission ? 'permission_error' : 'disabled'),
        error: lastError.message || String(lastError)
      };
      return null;
    }

    result.tables[table] = {
      tableName: table,
      queryColumn: selectedCol,
      rowCount: loadedData?.length || 0,
      status: loadedData && loadedData.length > 0 ? 'success' : 'empty',
      data: loadedData || []
    };
    return loadedData;
  }

  // 1. Core user tables
  await fetchTable('profiles', ['id', 'user_id']);
  await fetchTable('birth_data', ['user_id', 'id']);
  await fetchTable('natal_charts', ['user_id', 'id']);
  await fetchTable('astro_profiles', ['user_id', 'id']);

  // 2. Pattern memory tables
  await fetchTable('agent_conversations', ['user_id', 'id']);
  await fetchTable('contribution_events', ['user_id', 'id']);
  await fetchTable('quiz_sessions', ['user_id', 'id']);
  await fetchTable('user_signature_state', ['user_id', 'id']);

  // 3. Temporal / daily cache tables
  await fetchTable('daily_horoscope_cache', ['user_id', 'id']);
  const dailyPulses = await fetchTable('daily_pulses', ['user_id', 'id']);
  
  // daily_interpretations depending on daily pulses
  if (dailyPulses && dailyPulses.length > 0) {
    const pulseIds = dailyPulses.map((p: any) => p.id);
    try {
      const { data, error } = await supabase
        .from('daily_interpretations')
        .select('*')
        .in('daily_pulse_id', pulseIds);

      if (error) {
        result.tables['daily_interpretations'] = {
          tableName: 'daily_interpretations',
          queryColumn: 'daily_pulse_id',
          rowCount: 0,
          status: error.code === '42P01' ? 'missing' : 'disabled',
          error: error.message
        };
      } else {
        result.tables['daily_interpretations'] = {
          tableName: 'daily_interpretations',
          queryColumn: 'daily_pulse_id',
          rowCount: data?.length || 0,
          status: data && data.length > 0 ? 'success' : 'empty',
          data: data || []
        };
      }
    } catch (err: any) {
      result.tables['daily_interpretations'] = {
        tableName: 'daily_interpretations',
        queryColumn: 'daily_pulse_id',
        rowCount: 0,
        status: 'disabled',
        error: err?.message || String(err)
      };
    }
  } else {
    // try standard user_id query fallback or mark empty
    await fetchTable('daily_interpretations', ['user_id', 'id']);
  }

  // space_weather_cache is a global cache
  await fetchTable('space_weather_cache', [], true);

  // 4. Eve tables loaded trailing explicit config ENABLE_EVE_TABLE_READS=true
  const eveTables = [
    'eve_narrative_profiles', 'eve_sessions', 'eve_anchors',
    'eve_hypotheses', 'eve_hypothesis_events', 'eve_deviation_candidates',
    'eve_planet_states', 'eve_signature_events', 'eve_follow_up_hooks', 'eve_mode_history'
  ];

  for (const table of eveTables) {
    if (!enableEve) {
      result.tables[table] = {
        tableName: table,
        queryColumn: 'none',
        rowCount: 0,
        status: 'disabled',
        error: 'Eve table reads are disabled by system settings (ENABLE_EVE_TABLE_READS=false).'
      };
    } else {
      await fetchTable(table, ['user_id', 'id']);
    }
  }

  return result;
}
