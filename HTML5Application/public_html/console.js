/* 
 * JNeeds expanding on to make the game more diverse
 */


console = (function($) {
    var output;

    var init = function(outname) {
        output = $('#'+outname);
        output.attr('disabled', 'disabled');
    };
    
    var write = function(text) {
        output.append(text + "\n");
        output.scrollTop(9999999999);
    };

    return {
        init: init,
        write: write
    };
})(jQuery);

$(document).ready(function() {
    console.init('console_out');
});