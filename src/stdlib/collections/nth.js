(function(array, index){
  if(Array.isArray(array)){
    return array[index];
  } else if(typeof array === "string"){
    return array.substring(index, index + 1);
  } else {
    throw new Error(array + ' is not an array or string');
  }
});
