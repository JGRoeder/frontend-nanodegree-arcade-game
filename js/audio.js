/* audio.js
 * Primarily outright stolen from the resources.js provided by udacity
 * Thanks Gents and/or Ladies!
 */
(function() {
    var audioCache = {};
    var loading = [];
    var readyCallbacks = [];

    /* This is the publicly accessible loading function. It accepts
     * an array of strings pointing to audio files or a string for a single
     * audio file. It will then call our private audio loading function accordingly.
     */
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            /* If the developer passed in an array of urls
             * loop through each value and call our audio
             * loader on that audio file
             */
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        } else {
            /* The developer did not pass an array to this function,
             * assume the value is a string and call our audio loader
             * directly.
             */
            _load(urlOrArr);
        }
    }

    /* This is our private audio file loader function, it is
     * called by the public audio file loader function.
     */

     function _load(url) {

         if(audioCache[url]) {
             /* If this URL has been previously loaded it will exist within
              * our resourceCache array. Just return that audio file rather
              * re-loading the audio file.
              */
             return audioCache[url];
         } else {
             /* This URL has not been previously loaded and is not present
              * within our cache; we'll need to load this audio file.
              */
            var myAudio = new Audio();
            myAudio.oncanplaythrough = function() {
              audioCache[url] = myAudio;

              // Shutting up callbacks for now
              //  if(isReady()) {
              //      readyCallbacks.forEach(function(func) { func(); });
              //  }
            };

             /* Set the initial cache value to false, this will change when
              * the oncanplaythrough event handler is called. Finally, point
              * the audio src attribute to the passed in URL.
              */

             audioCache[url] = false;
             myAudio.src = url;
         }
     }

    /* This is used by developer's to grab references to audio files they know
     * have been previously loaded. If an audio is cached, this functions
     * the same as calling load() on that URL.
     */
    function get(url) {
        return audioCache[url];
    }

    /* This function determines if all of the audio files that have been requested
     * for loading have in fact been completed loaded.
     */
    function isReady() {
        var ready = true;
        for(var k in audioCache) {
            if(audioCache.hasOwnProperty(k) &&
               !audioCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    /* This function will add a function to the callback stack that is called
     * when all requested audio files are properly loaded.
     */
    function onReady(func) {
        readyCallbacks.push(func);
    }

    /* This object defines the publicly accessible functions available to
     * developers by creating a global Resources object.
     */
    window.AudioResources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();
