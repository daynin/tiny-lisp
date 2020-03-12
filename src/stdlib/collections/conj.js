(function(array, elem){
  if(Array.isArray(array)){
    array.push(elem);
    return array;
  } else {
    throw new Error(array + ' is not an array');
  }
});
