/**
 * Class which exposes collection of utility / helper functions to construct Json responses to the client.
 * - Constructs a template for response Json message.
 * - Constructs an error response Json message.
 *
 * @author Shashikant.
 */

 
// Dependencies.

var ResponseUtils = function() {
  // Public functions.
  this.constructResponseJson = constructResponseJson;  


  /**
   * Function to construct a placeholder template for a typical Response Json message.
   * 
   * @return JSON
   */
  function constructResponseJson() {
    return response = {
      "header": {
      },
      "payload": {
        "responseType" : "application/JSON",
        "responseCode" : "",
        "status" : "",
        "responseBody" : {
            
         }
      }
    };
  }
};


// Export Module.
module.exports = new ResponseUtils();