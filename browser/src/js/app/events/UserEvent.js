/**
 *
 * Copyright (c) [year] Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

define([], function(require) {
	
	var UserEvent = {
		KEY_DOWN: new signals.Signal(),
		KEY_UP: new signals.Signal(),
		SCROLL: new signals.Signal(),
		RESIZE: new signals.Signal(),
		MOUSE_DOWN: new signals.Signal(),
		MOUSE_UP: new signals.Signal(),
		MOUSE_MOVE: new signals.Signal(),
		TOUCH_START: new signals.Signal(),
		TOUCH_END: new signals.Signal(),
		DEVICE_MOTION: new signals.Signal(),
		DEVICE_ORIENTATION: new signals.Signal(),
        POPUP_CLOSE: new signals.Signal()
	}
	
	return UserEvent;
});
