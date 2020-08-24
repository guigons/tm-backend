import Template from '@modules/charts/infra/typeorm/schemas/Template';
import { ObjectId } from 'mongodb';
import TemplatesFilterCondition from '../infra/typeorm/schemas/TemplatesFilterCondition';

export function deepMatch(
  obj: any,
  condition: TemplatesFilterCondition,
): boolean {
  const paths = condition.key.split('.');
  let refObj = obj;

  for (let i = 0; i < paths.length; i += 1) {
    if (!refObj[paths[i]] || refObj[paths[i]] === undefined) {
      return false;
    }
    if (refObj[paths[i]] instanceof Array) {
      return refObj[paths[i]].some((m: any) => {
        if (condition.operador === 'equals') {
          return m[paths[i + 1]] === condition.value;
        }
        if (condition.operador === 'exists') {
          return !!m[paths[i + 1]];
        }
        if (condition.operador === 'regex') {
          return m[paths[i + 1]].match(new RegExp(condition.value, 'i'));
        }
        return false;
      });
    }
    refObj = refObj[paths[i]];
  }
  if (condition.operador === 'equals') {
    return refObj === condition.value;
  }
  if (condition.operador === 'exists') {
    return !!refObj;
  }
  if (condition.operador === 'regex') {
    return refObj.match(new RegExp(condition.value, 'i'));
  }
  return false;
}

export function deepFindValue(
  obj: any,
  path: string,
): string | string[] | undefined {
  const paths = path.split('.');
  let refObj = obj;

  for (let i = 0; i < paths.length; i += 1) {
    if (!refObj[paths[i]] || refObj[paths[i]] === undefined) {
      return undefined;
    }
    if (refObj[paths[i]] instanceof Array) {
      return refObj[paths[i]].map((m: any) => {
        return m[paths[i + 1]];
      });
    }
    refObj = refObj[paths[i]];
  }
  return refObj;
}

export function deepFindObj(
  obj: any,
  path: string,
): string | string[] | undefined {
  const paths = path.split('.');
  let refObj = obj;

  for (let i = 0; i < paths.length; i += 1) {
    if (!refObj[paths[i]] || refObj[paths[i]] === undefined) {
      return undefined;
    }
    if (refObj[paths[i]] instanceof Array) {
      return refObj[paths[i]];
    }
    refObj = refObj[paths[i]];
  }
  return refObj;
}

export function deepSetObj(obj: any, path: string, value: any): void {
  const paths = path.split('.');
  let refObj = obj;

  for (let i = 0; i < paths.length; i += 1) {
    if (!refObj[paths[i]] || refObj[paths[i]] === undefined) {
      return;
    }
    if (refObj[paths[i]] instanceof Array) {
      refObj[paths[i]] = value;
    }
    refObj = refObj[paths[i]];
  }
  refObj = value;
}

export function groupArray<T, Z>(array: T[], key: string): Z {
  const obj: any = {};
  const fields = array.reduce(
    (acc: string[], cur: T) => acc.concat(deepFindValue(cur, key) as string[]),
    [],
  );
  fields.forEach(f => {
    if (!obj[f]) {
      obj[f] = array.filter(tp =>
        deepMatch(tp, {
          _id: new ObjectId(),
          key,
          operador: 'equals',
          value: f,
        }),
      );
    }
  });

  return obj;
}

export function filterByTemplate<T>(array: T[], template: Template): T[] {
  const filtered = array.filter(i => {
    return template.filters.every(f => {
      return f.conditions.some(c => {
        return deepMatch(i, c);
      });
    });
  });

  return filtered.map(i => {
    template.filters.forEach(filter => {
      filter.conditions.forEach(condition => {
        const ref = deepFindObj(i, condition.key);
        if (ref instanceof Array) {
          const field = condition.key.split('.').pop();
          if (field) {
            deepSetObj(
              i,
              condition.key,
              ref.filter((r: any) => {
                if (condition.operador === 'equals') {
                  return r[field] === condition.value;
                }
                if (condition.operador === 'exists') {
                  return !!r[field];
                }
                if (condition.operador === 'regex') {
                  return r[field].match(new RegExp(condition.value, 'i'));
                }
                return false;
              }),
            );
          }
        }
      });
    });
    return i;
  });
}
