/*global define signals*/
define([], function () {
		
    var AppEvent = {
        INTRO_COMPLETE: new signals.Signal(),
        GOTO_VIEW: new signals.Signal()
    };

    return AppEvent;
});
