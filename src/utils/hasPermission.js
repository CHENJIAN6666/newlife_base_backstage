import store from '../store'

export function hasPermission(permission) {
  let myPermissions = store.getters.permissions;
  let has = false
  permission.split(',').forEach((item)=>{
  	if(!has){
  		has = myPermissions.indexOf(item) > -1;
  	}
  });
  return has;
}

export function hasRole(roleID) {
  let roleIds = store.getters.roleIds;
  // console.log(roleIds)
  let has = false
  roleID.split(',').forEach((item)=>{
    if(!has)
      has = roleIds.indexOf(item) > -1;
  })
  return has;
}

// export function hasAdminRole(){
//   return hasRole("1,2,3,4")
// }