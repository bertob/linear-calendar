const Lang = imports.lang;
const Mainloop = imports.mainloop;
const Cairo = imports.cairo;
const Clutter = imports.gi.Clutter;
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Calendar = imports.ui.calendar;

let tick;

let events = [
		{start: 20, end: 100, a: null},
		{start: 480, end: 520, a: null},
		{start: 580, end: 640, a: null},
		{start: 760, end: 860, a: null},
		{start: 900, end: 1040, a: null}
	];

function _showTick() {

    let monitor = Main.layoutManager.primaryMonitor;
    let time = new Date();
    let w = monitor.width;
    let position = monitor.x + Math.floor(w/24 * time.getHours() +
                                          w/(24*60) * time.getMinutes());

    if (!tick) {
        tick = new St.Label({ style_class: 'tick', text: "" });
        Main.uiGroup.add_actor(tick);
    }
    tick.opacity = 200;
    tick.set_position(position - tick.width / 2,
                    monitor.y);

    Tweener.addTween(tick,
                     { opacity: 255,
                       time: 6.3,
                       transition: 'easeOutQuad',
                       onComplete: _hideTick });

    Mainloop.timeout_add_seconds(1, _showTick);
}

function _hideTick() {
    Main.uiGroup.remove_actor(tick);
}

function _drawTimeline() {

	let d = new St.DrawingArea({style_class: 'line', reactive: false});

	for (var i=0; i<events.length; i++) {
		a =events[i].a;
		a = new St.DrawingArea({style_class: 'line', reactive: false});
		a.set_size(events[i].end - events[i].start, 20);
		a.set_position(events[i].start, 0);

		a.opacity = 180;

		Main.uiGroup.add_actor(a);
	}


	Main.uiGroup.add_actor(d);
}

function init() {
	_drawTimeline();
}

function enable() {
	_showTick();
	_drawTimeline();
}

function disable() {
	_hideTick();

	for (var i=0; i<events.length; i++) {
		Main.uiGroup.remove_actor(events[i].a);
	}
}

