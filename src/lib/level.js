function indexOf(level) {
  if (level < 1) {
    return null;
  }

  return level - 1;
}

function valueOf(indexes, skill) {
  const starter = skill.levelReq[0] === 1;
  const index = skill.index;
  const val = indexes[index];

  if (typeof val === 'undefined' || val === null) {
    return starter ? 1 : 0;
  }

  return val + 1;
}


export default {
  indexOf,
  valueOf,
};
