/**
 * Add an event to the calendar DOM
 * @param {[type]} width  [description]
 * @param {[type]} height [description]
 * @param {[type]} top    [description]
 * @param {[type]} left   [description]
 */
function addEvent(width, height, top, left) {
    // Now, the easy part.
    var div = document.createElement("div");
    div.style.width = width + "px";
    div.style.height = height + "px";
    div.style.top = top + "px";
    div.style.left = left + "px";
    div.style.position = "absolute";
    div.style.background = "white";
    div.style.borderLeft = "solid #43A047";
    div.style.marginLeft = "10px";
    div.style.marginRight = "10px";

    // Add Dummy Info
    var eventString = '<div style="margin-left: 15px;margin-top: 5px;"><span style="color:#43A047;font-size:20px;">Sample Item</span><div><span><span style="color:#757575;font-size:14px;">Sample Location</span></span></div></div>';

    div.insertAdjacentHTML('beforeend', eventString);

    // Append Event to Calendar
    document.getElementById("calander").appendChild(div);
}


/**
 * Calculate Events dimensions and updates margins
 * @param  {[type]} events [description]
 * @return {[type]}        [description]
 */
function layOutDay(events) {
    if (!events) {
        // No events have been submitted - clear calendar
        document.getElementById('calander').innerHTML = '';
        return;
    }

    var eventsLength = events.length;
    var timeslots = [];
    var event, i, j;

    // Sort events by start time.
    events = events.sort(function(a, b) {
        return a.start - b.start;
    });

    events.map(function(item, idx){
        return item.id = idx + 1;
    })

    // Initialize timeslots.
    for (i = 0; i < 720; i++) {
        timeslots[i] = [];
    }

    // Arrange the events by timeslot.
    for (i = 0; i < eventsLength; i++) {
        event = events[i];

        // Check start and end times and invert if necessary
        if (event.start > event.end) {
            var temp = event.start;
            event.start = event.end;
            event.end = temp;
        }

        for (j = event.start; j < event.end; j++) {
            timeslots[j].push(event.id);
        }
    }

    // Get horizontal position for each event
    for (i = 0; i < 720; i++) {
        var next_hindex = 0;
        var timeslotLength = timeslots[i].length;

        // If there's at least one event in the timeslot,
        // we know how many events we will have going across for that slot.
        if (timeslotLength > 0) {
            // Store the greatest concurrent event count (cevc) for each event.
            for (j = 0; j < timeslotLength; j++) {
                event = events[timeslots[i][j] - 1];
                //console.log('Event: ' + JSON.stringify(event));
                if (event) {
                    if (!event.cevc || event.cevc < timeslotLength) {
                        event.cevc = timeslotLength;
                        // Now is also a good time to coordinate horizontal ordering.
                        // If this is our first conflict, start at the current index.
                        if (!event.hindex) {
                            event.hindex = next_hindex;

                            // We also want to boost the index,
                            // so that whoever we conflict with doesn't get the same one.
                            next_hindex++;
                        }
                    }
                }
            }
        }
    }

    // Calculate event coordinates and dimensions
    for (i = 0; i < events.length; i++) {
        event = events[i];

        // Height and y-coordinate are already known.
        event.pxh = event.end - event.start;
        event.pxy = event.start;

        // Width is based on calendar width and the cevc.
        event.pxw = 600 / event.cevc;

        // Height uses the same calendar/cevc figure,
        // multiplied by the horizontal index to prevent overlap.
        event.pxx = event.hindex * event.pxw;

        // Add event to the calendar
        addEvent(event.pxw, event.pxh, event.pxy, event.pxx);
    }
};

var events = [
    { id: 1, start: 30, end: 150 }, // an event from 9:30am to 11:30am
    { id: 2, start: 540, end: 600 }, // an event from 6pm to 7pm
    { id: 3, start: 560, end: 620 }, // an event from 6:20pm to 7:20pm
    { id: 4, start: 610, end: 670 } // an event from 7:10pm to 8:10pm
];

// Update Event
//layOutDay(events);
