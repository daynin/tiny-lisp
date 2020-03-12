const isFun = obj => typeof obj === 'function';
const getArrayFromArgs = args => {
  const result = [];

  for(var i = 0; i < args.length; i++){
    result.push(args[i]);
  }

  return result;
}
