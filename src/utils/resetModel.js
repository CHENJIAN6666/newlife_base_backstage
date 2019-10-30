export function resetModel(tempModel) {
    for(let tm in tempModel ){
        if(typeof(tempModel[tm])!= 'object')
             tempModel[tm]=null;
        //Vue.set(vm.items, indexOfItem, newValue)
    }
  }
  