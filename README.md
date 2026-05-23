# Bazodiac Scenario Lab Cockpit

An adaptive, reflective pattern-awareness cockpit built in React with TypeScript and Tailwind CSS.

---

## 1. Product Purpose
The Bazodiac Scenario Lab is designed to serve as a reflective dashboard for astrologically calibrated pattern awareness. It moves away from fortune-telling or objective forecasts to present counterfactual trajectories representing tendencies (such as Wood growth expansion, Scorpio hermit isolation, or Metal structure deficiency).

---

## 2. Dynamic Features List
- **Scenario Fan SVG**: Draws dynamic quadratic Bezier curves representing 6 different scenario outputs. Includes:
  - Branch thickness mapping probability weight
  - Opacity mapping confidence
  - Core glowing auras for high-coherence paths
  - Vibrating red-edge tension grids for high-conflict channels
  - Symbolic mid-point glyphs (SUN, MOON, TRASH, PILARS) reflecting contributing sources
- **Seven Hypotheses Map Constellation**: Visualizes 7 working hypothese arrays arranged in a 2D solar grid. Stars render confidence (radial boundaries) and temporal activation (bright neon centers). Links show reinforcement or contradictions.
- **Pattern Calibration Memory**: Includes Quiz Vectors (12 sectors and trait axes sliders), Dialog observations (Eve/Levi comments), and Snapshot Drifts (discrepancy trackers).
- **Consensus Ward**: Evaluates consensus, agreement, and displays obtrusive comments from the Skeptic Agent.
- **Data Provenance Developer Drawer**: Houses raw markdown and JSON seeds, missing connection warnings, and Supabase RLS policies.
- **Epistemic warning triggers**: Places specific limiting labels (Calculated, Observed, Inferred, Simulated) on all elements.

---

## 3. What the Prototype Does NOT Do
- It does **not** provide deterministic predictions of external tomorrow events.
- It does **not** replace medical, clinical, or psychological diagnosis tools.
- It does **not** expose private database keys or API endpoints to client browsers.

---

## 4. Setup Commands
```bash
# Install package dependencies
npm install

# Run Vite dev server (runs default on Port 3000)
npm run dev

# Run TypeScript linter
npm run lint

# Build production assets
npm run build
```

---

## 5. Mock Mode and Connection Toggles
The application starts in a robust, high-fidelity mock state with pre-populated datasets. Clicking **"SIMULATE MIROSHARK"** runs a 1200ms API computation loader representing remote calculations.

---

## 6. Real-time API Integration Plan & Expected Contracts

### A. expected Supabase Tables Schema
```sql
CREATE TABLE profile_vectors (
  profile_id UUID PRIMARY KEY REFERENCES auth.users(id),
  sector_vector_12 INTEGER[] DEFAULT '{0,0,0,0,0,0,0,0,0,0,0,0}',
  trait_momentum JSONB,
  calibration_strength DECIMAL DEFAULT 0.88,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Row-Level Security Policy Check
ALTER TABLE profile_vectors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only read own vector metadata" 
  ON profile_vectors FOR SELECT USING (auth.uid() == profile_id);
```

### B. Expected FuFirE Baseline Endpoint (`GET /api/fufire/baseline`)
Returns:
```json
{
  "birth_time": "1994-05-12T14:30:00Z",
  "calibration_strength": "High",
  "dominant_element_weight": 0.64,
  "deficient_element_weight": 0.12,
  "active_hypotheses_count": 5
}
```

### C. Expected MiroShark API Runner (`POST /api/miroshark/simulate`)
Accepts:
```json
{
  "profile_id": "usr_fufire_9921",
  "active_mode": "field",
  "horizon_days": 7
}
```
Returns:
```json
{
  "run_id": "miro_run_55219_abc",
  "branches_projected": [
    {
      "id": "br-1",
      "title": "Resilient Coherent Progression",
      "coherence_delta": 4.8,
      "tension_delta": 0.2
    }
  ]
}
```

---

## 7. Safety Language Rules
- Present branches strictly as **scaffolds for imagination and reflection**.
- Emphasize "What the model sees" and "Why it appears" rather than definitive destiny states.
- Always include "What not to conclude" (Critical limiter warnings) for every scenario.
