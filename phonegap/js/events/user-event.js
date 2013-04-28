/*global define signals*/
define([], function () {
		
		var UserEvent = {
            KEY_DOWN: new signals.Signal(),
            KEY_UP: new signals.Signal(),
            MOUSE_MOVE: new signals.Signal(),
            RESIZE: new signals.Signal(),
            SCROLL: new signals.Signal(),
            NEXT: new signals.Signal(),
            PREVIOUS: new signals.Signal(),
            GOTO: new signals.Signal()
        };

		return UserEvent;
    });
