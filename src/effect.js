export const Effect = {
  create(definition) {
    let { name: effectName, operations: { initialize, ...operators } } = definition;

    let effect = mapObject(operators, (operation, operatorName) => (...args) => (control) => {

      for (let context = control.context; context; context = context.parent) {
        if (context.effects.has(effect)) {
          let state = context.effects.get(effect);
          operation(...args)(control, state);
          return;
        }
      }

      throw new Error(`Tried to use the ${operatorName}() operator, but there is no corresponding ${effectName} used anywhere`);
    });

    if (!initialize) {
      effect.initialize = ({ resume }) => resume();
    } else {
      effect.initialize = initialize;
    }

    return effect;
  }
};

export const use = effect => ({ call, resume, context: { parent } }) => {
  call(effect.initialize, {
    resume: state => {
      parent.effects.set(effect, state);
      resume();
    },
  });
};

function mapObject(object, fn) {
  return Object.getOwnPropertyNames(object).reduce((acc, name) => {
    return {...acc, [name]: fn(object[name], name) };
  }, Object.create(Object.getPrototypeOf(object)));
}
