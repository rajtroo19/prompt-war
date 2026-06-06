import { BREATHING_EXERCISES } from '../lib/constants';

describe('Yogic & Ayurvedic Therapy Constants', () => {
  it('contains authentic Indian yogic exercises', () => {
    const exerciseIds = BREATHING_EXERCISES.map(e => e.id);
    
    expect(exerciseIds).toContain('anulom_vilom');
    expect(exerciseIds).toContain('bhramari');
    expect(exerciseIds).toContain('trataka');
    expect(exerciseIds).toContain('shavasana');
  });

  it('verifies Anulom Vilom has correct phases', () => {
    const anulomVilom = BREATHING_EXERCISES.find(e => e.id === 'anulom_vilom');
    expect(anulomVilom).toBeDefined();
    expect(anulomVilom!.steps.length).toBe(6);
    expect(anulomVilom!.steps[0].phase).toBe('Inhale Left');
    expect(anulomVilom!.steps[2].phase).toBe('Exhale Right');
  });

  it('verifies Bhramari humming logic', () => {
    const bhramari = BREATHING_EXERCISES.find(e => e.id === 'bhramari');
    expect(bhramari).toBeDefined();
    const hummingStep = bhramari!.steps.find(s => s.phase === 'Humming Exhale');
    expect(hummingStep).toBeDefined();
    expect(hummingStep!.instruction).toContain('humming sound');
  });
});
