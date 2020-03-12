const compare = (arr, pred) => {
  let res = true;

  for(var i = 0; i < arr.length; i++){
    if(arr[i + 1] != null && res){
      res = res && pred(arr[i], arr[i + 1]);
    } else {
      break;
    }
  }

  return res;
}

