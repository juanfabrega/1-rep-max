export  const calculateOneRepMax = (weight, reps) => (
  Math.floor(weight / (1.0278 - (0.0278 * reps)))
);
