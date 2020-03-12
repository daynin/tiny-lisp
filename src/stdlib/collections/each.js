(function(fn, array){
  if(Array.isArray(array)){
    return array.forEach(fn);
  } else {
    throw new Error(array + ' is not an array');
  }
});
