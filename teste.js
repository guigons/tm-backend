function deepMatchArray(obj, path) {
  const paths = path.split('.');
  let refObj = obj;
  let i;

  console.log('TYPEOF', obj.root.c instanceof Array);

  for (i = 0; i < paths.length - 1; i += 1) {
    console.log('REF', i, paths[i], refObj);

    if (!refObj[paths[i]] || refObj[paths[i]] === undefined) {
      console.log(
        'DEU RUIM!',
        !refObj[paths[i]],
        refObj[paths[i]] === undefined,
      );
      return false;
    }

    if (refObj[paths[i]] instanceof Array) {
      return refObj[paths[i]];
    }
    refObj = refObj[paths[i]];
  }
  return refObj;
}

const TP = {
  root: {
    a: 'a',
    b: 'b',
    c: [
      { d: 'd', e: 'e' },
      { f: 'f', g: 'g' },
    ],
  },
};

const match = deepMatchArray(TP, 'root.c.d').some(m => m.d === 'd');

console.log(match);
