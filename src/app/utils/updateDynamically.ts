export const updateDynamically = (
  prefix: string,
  obj: Record<string, unknown>,
  target: Record<string, unknown>,
) => {
  for (const [key, value] of Object.entries(obj)) {
    target[`${prefix}.${key}`] = value;
  }
};

/*
-> obj — the object you want to flatten one level, e.g. { firstName: "Bayazid", lastName: "Hassan" }.

-> Object.entries(obj) — turns obj into an array of pairs: [['firstName','Bayazid'], ['lastName','Hassan']].

-> for (const [key, value] of ...) — iterates each pair and destructure it into key and value.

-> target[`${prefix}.${key}`] = value; — builds a string key like "name.firstName" and assigns the value on target.
*/
