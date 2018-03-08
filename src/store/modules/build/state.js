export function initialState() {
  return {
    ascendancy: 0,
    indexes: [],
    techs: [-1, -1, -1, -1, -1], // [weap, neck, ear, ring, ring]
    crestTech: -1,
    crests: {},
    mode: 0,
    active: -1,
    activeAlt: -1,
    related: {},
  };
}

export default initialState();
