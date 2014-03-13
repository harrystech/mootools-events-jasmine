# Mootools Event Spies for Jasmine Tests

This is a Jasmine helper for testing Mootools events. It builds on the `runs()` and `waitsFor()` methods from Jasmine for handling
asynchronous code.

See our [introductory blog post](http://engineering.harrys.com/2014/03/13/async-testing-jasmine-mootools.html) for some background.

## Installation

Copy event-spies.js to your Jasmine helpers directory (e.g.
app/spec/javascripts/helpers/).

## Usage:

In your Jasmine test, set up some event spies on the object that
will trigger the events:

    spyOnEvent(object, 'eventName');

Later, call the code that should trigger the event, in a `runs` block:

    runs(function() {
        object.doSomething();
    });

Then wait for the event to have been triggered (last argument is a timeout):

    waitsForEvent(object, 'eventName', 500);

If you want to test side effects of the event, you will need to also put that in
a `runs` block:

    runs(function() {
        expect(object.state).toEqual('done');
    });


## Example:

    it("can submit to queued", function () {
        // Setup listening for the queued event
        spyOnEvent(order, 'queued');

        // Trigger a (mock) Ajax request
        runs(function() {
            jasmine.Ajax.stubRequest('/some/endpoint').andReturn({
                "status": 200,
                "contentType": 'application/json',
                "responseText": '{"status" : "queued", "job_id" : "foo"}'
            });
            order.submit();
        });

        // Expect the event to have been thrown within 500ms
        waitsForEvent(order, 'queued', 500);

        // Expect our code to have done the right thing with the event
        runs(function() {
            expect(jasmine.Ajax.requests.mostRecent().url).toEqual("/some/endpoint");
            expect(order.status).toEqual('queued');
        });
    });

## Acknowledgements:

This was <strike>shameless copy-pasted</strike> inspired by and adapted from [Luiz Ribeiro's jQuery implementation](http://luizfar.wordpress.com/2011/01/10/testing-events-on-jquery-objects-with-jasmine/).
