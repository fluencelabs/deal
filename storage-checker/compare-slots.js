const arrayToMap = (data) => {
  const slotMap = new Map();
  for (const item of data) {
    slotMap.set(item.slot + "-" + item.offset.toString(), {
      label: item.label,
      type: item.type,
    });
  }
  return slotMap;
};

const compareSlots = (prev, curr) => {
  const results = [];
  const prevMap = arrayToMap(prev);
  const currMap = arrayToMap(curr);
  // check deleted ones
  for (const slotAndOffset of prevMap.keys()) {
    if (!currMap.has(slotAndOffset)) {
      results.push(
        `Deleted item at ${slotAndOffset}: ${prevMap.get(slotAndOffset).type} ${
          prevMap.get(slotAndOffset).label
        }`,
      );
    }
  }
  // compare others
  for (const slotAndOffset of prevMap.keys()) {
    if (currMap.has(slotAndOffset)) {
      const prevLabel = prevMap.get(slotAndOffset).label;
      const currLabel = currMap.get(slotAndOffset).label;
      if (prevLabel !== currLabel) {
        results.push(
          `Label changed for ${slotAndOffset}: ${prevLabel} -> ${currLabel}`,
        );
      }
      const prevType = prevMap.get(slotAndOffset).type;
      const currType = currMap.get(slotAndOffset).type;
      if (prevType !== currType) {
        results.push(
          `Type changed for ${slotAndOffset}: ${prevType} ${prevLabel} -> ${currType} ${currLabel}`,
        );
      }
    }
  }
  return results;
};

module.exports = {
  compareSlots,
};
