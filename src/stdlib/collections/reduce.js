(function(fn, array){
  if(Array.isArray(array)){
    return array.reduce(fn);
  } else {
    throw new Error(array + ' is not an array');
  }
});
