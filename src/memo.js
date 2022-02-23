export function memoize(fn) {

  //cache here
  const cache = {}

  //This function will receive an object and return a new object with properties alpabetically ordered
  const reorderObj = (obj) => {

    //This will be the returned ordered object
    let orderedObj = {} 

    //Here i just sorted the object properties and set all inside the orderedObj
    //Im just using the name of the iteration as "keyAux" just to 
    Object.keys(obj).sort().forEach((objPropertie)=>{
      orderedObj[objPropertie] = obj[objPropertie]
    });

    return orderedObj

  }

  return (...args) => {

    //I'm using the args as a key inside cache
    let key = args;

    //Here i reorder if the parameter is an object
    //And then set the key with the object stringified (this may work like a "fingerprint"
    //of the object based on content and not the object itself)
    if(typeof args[0] === "object") 
      key = reorderObj(args[0]);

    //So here i just find if the the "fingeprint" exists inside cache
    //If it exists, just return the value using "object[propertie]"
    if(cache[JSON.stringify(key)]) 
      return cache[JSON.stringify(key)]

    //If it doesnt exists, this part will be reached and the fucntion will run with its original parameters
    //Then the value should be stored inside the cache using the "key"/"fingerprint" based on the args contents
    const result = fn.apply(this, args)
    cache[JSON.stringify(key)] = result

    //Finally return the Value
    return result

  }
  
}


export function cache(fn) {
  
  //So this time i used this approach just to keep cache as a const
  //While it allows me to "clear" de data through the clear function
  const cache = {data : {}}
  
  //This function will search inside cache looking for the parameters as the key
  const hitCount = (key) => {
    
    //If it exists, return the HITCOUNT
    if(cache.data[JSON.stringify([key])])
      return cache.data[JSON.stringify([key])].hitCount

    //Else return 0
    return 0
  }

  //Clearing cache data
  const clear = () => {
    cache.data = {};
  }

 
  const memoize = (...args) => {

    //I'm using the args as a key inside cache
    let key = args;
    
    //So here i just find if the the "fingeprint" exists inside cache
    //If it exists, just return the value using "object[propertie]"
    if(cache.data[JSON.stringify(key)]) {
      //Here is where i increase the HITCOUNT
      cache.data[JSON.stringify(key)].hitCount++
      //And since this is now an object, i have to return just the "result", not the entire object
      return cache.data[JSON.stringify(key)].result
    }

    //If it doesnt exists, this part will be reached and the fucntion will run with its original parameters
    //Then the value should be stored inside the cache using the "key"/"fingerprint" based on the args contents
    const result = fn.apply(this, args)
    //So here, instead of just saving the value, i'm saving a new object with the hitCount propertie
    //This way i can increase the propertie (+1) everytime before i return the value from cache
    cache.data[JSON.stringify(key)] = {result, hitCount: 0}

    //Finally return the Value
    return result

  }

  return {
    fn: memoize, //returned like this so the desestructuration inside the tests cant work
    hitCount,
    clear  
  };

}




