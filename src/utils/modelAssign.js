// 对象合并，把sources对象中value不为null的添加到target
export function assign(target, sources){
    if(sources == null){
        return
    }
    for(let k in sources){
        //值为空或者是一个object 不合并
        if(sources[k] == null){
            continue
        }else if(typeof target[k] == 'object'){
            continue
        }
        target[k] = sources[k]==null ? '':sources[k]
    }
}