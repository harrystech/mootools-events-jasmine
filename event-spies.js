// http://github.com/harrystech/mootools-events-jasmine
//
//describe("my object events", function() {
//    it("should trigger 'complete'", function() {
//        var form = new MyForm();
//        spyOnEvent(form, 'complete');
//
//        runs(function() {
//          form.execute();
//        });
//
//        waitsForEvent(form, 'complete', 750);
//
//        // optional check for other stuff
//        runs(function() {
//          expect(form).toHaveTriggered('submit');
//        });
//    });
//});

var jasmineExtensions = {
    eventSpies: {},
    spyOnEvent: function(object, eventName) {
        var control = {
            triggered: false,
            data: {}
        };
        object.addEvent(eventName, function(data) {
            console.log("Detected event " + eventName);
            control.triggered = true;
            control.data = data;
        });
        jasmineExtensions.eventSpies[object] = jasmineExtensions.eventSpies[object] || {};
        jasmineExtensions.eventSpies[object][eventName] = control;
    },
    hasBeenTriggered: function(object, eventName) {
      var control = jasmineExtensions.eventSpies[object][eventName];
      return control.triggered;
    },
    waitsForEvent: function(object, eventName, timeout) {
        var msg = "event '" + eventName + "' to have been triggered";
        waitsFor(function() {
            return hasBeenTriggered(object, eventName);
        }, msg, timeout);
    },
    lastEventData: function(object, eventName) {
      var control = jasmineExtensions.eventSpies[object][eventName];
      return control.data;
    }
};

var spyOnEvent = jasmineExtensions.spyOnEvent;
var hasBeenTriggered = jasmineExtensions.hasBeenTriggered;
var lastEventData = jasmineExtensions.lastEventData;
var waitsForEvent = jasmineExtensions.waitsForEvent;

beforeEach(function() {
    this.addMatchers({
        toHaveTriggered: function(eventName) {
            return hasBeenTriggered(this.actual, eventName);
        },
        toNotHaveTriggered: function(eventName) {
            return !hasBeenTriggered(this.actual, eventName);
        }
    });
});


