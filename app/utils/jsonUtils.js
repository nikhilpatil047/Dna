/**
 * Class which exposes collection of utility / helper functions to work with JSON objects.
 * - Validates whether a path exists in a Json Object hierarchy.
 * - Returns a value from a Json Object at specified path.
 *
 * @author Nikhil.
 */

'use strict';
var JsonUtils = function() {
  // Public functions.
  this.isPath = isPath;
  this.getPath = getPath;


  /**
   * Check if the specified path exists under the given Json Object.
   * Navigates through the dot-separated path in the Json Object tree.
   * 
   * @param jsonObject
   * @param path
   * @return Boolean
   */
  function isPath(jsonObject, path) {
    // Check whether Json Object is null or not.
    if(jsonObject === null) {
      return false;
    }

    // Separate path by splitting it from '.' and collect into an array.
    var pathArray = path.split('.');

    var curr = jsonObject;

    for (var i in pathArray) {
      var component = pathArray[i];

      if (curr[component] === null) {
        return false;
      } else {
        curr = curr[component];
      }
    }

    return true;
  }


  /**
   * Navigate through the Json Object using the specified dot-separated path.
   * 
   * @param jsonObject
   * @param path
   * @returns jsonObject
   */
  function getPath(jsonObject, path) {
    // Check whether Json Object is null or not.
    if (jsonObject === null) {
      return null;
    }

    // Separate path by splitting it from '.' and collect into an array.
    var pathArray = path.split('.');
    
    var current = jsonObject;

    for (var i in pathArray) {
      var component = pathArray[i];

      if (current[component] === null) {
        return null;
      }
      else {
        current = current[component];
      }
    }

    return current;
  }
};


// Export Module.
module.exports = new JsonUtils();