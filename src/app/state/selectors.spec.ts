import { selectCity } from './selectors';

describe('selectCity', () => {
  it('should select the city from state', () => {
    const state = { LOCATION_STATE: { city: 'Paris' } };
    expect(selectCity.projector(state.LOCATION_STATE)).toBe('Paris');
  });
});
