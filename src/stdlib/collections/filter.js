(function(fn, array){
  if(Array.isArray(array)){
    return array.filter(fn);
  } else {
    throw new Error(array + ' is not an array');
  }
});
