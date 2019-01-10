/* http://keith-wood.name/countdown.html
   Countdown for jQuery v1.5.6.
   Written by Keith Wood (kbwood{at}iinet.com.au) January 2008.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */
;(function($) {
	function Countdown() {
		this.regional = []
		this.regional[''] = {
			labels: ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'],
			labels1: ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minute', 'Second'],
			compactLabels: ['y', 'm', 'w', 'd'],
			timeSeparator: ':',
			isRTL: false,
		}
		this._defaults = {
			until: null,
			since: null,
			timezone: null,
			serverSync: null,
			format: 'dHMS',
			layout: '',
			compact: false,
			description: '',
			expiryUrl: '',
			expiryText: '',
			alwaysExpire: false,
			onExpiry: null,
			onTick: null,
		}
		$.extend(this._defaults, this.regional[''])
	}
	var w = 'countdown'
	var Y = 0
	var O = 1
	var W = 2
	var D = 3
	var H = 4
	var M = 5
	var S = 6
	$.extend(Countdown.prototype, {
		markerClassName: 'hasCountdown',
		_timer: setInterval(function() {
			$.countdown._updateTargets()
		}, 980),
		_timerTargets: [],
		setDefaults: function(a) {
			this._resetExtraLabels(this._defaults, a)
			extendRemove(this._defaults, a || {})
		},
		UTCDate: function(a, b, c, e, f, g, h, i) {
			if (typeof b == 'object' && b.constructor == Date) {
				i = b.getMilliseconds()
				h = b.getSeconds()
				g = b.getMinutes()
				f = b.getHours()
				e = b.getDate()
				c = b.getMonth()
				b = b.getFullYear()
			}
			var d = new Date()
			d.setUTCFullYear(b)
			d.setUTCDate(1)
			d.setUTCMonth(c || 0)
			d.setUTCDate(e || 1)
			d.setUTCHours(f || 0)
			d.setUTCMinutes((g || 0) - (Math.abs(a) < 30 ? a * 60 : a))
			d.setUTCSeconds(h || 0)
			d.setUTCMilliseconds(i || 0)
			return d
		},
		periodsToSeconds: function(a) {
			return (
				a[0] * 31557600 +
				a[1] * 2629800 +
				a[2] * 604800 +
				a[3] * 86400 +
				a[4] * 3600 +
				a[5] * 60 +
				a[6]
			)
		},
		_settingsCountdown: function(a, b) {
			if (!b) {
				return $.countdown._defaults
			}
			var c = $.data(a, w)
			return b == 'all' ? c.options : c.options[b]
		},
		_attachCountdown: function(a, b) {
			var c = $(a)
			if (c.hasClass(this.markerClassName)) {
				return
			}
			c.addClass(this.markerClassName)
			var d = { options: $.extend({}, b), _periods: [0, 0, 0, 0, 0, 0, 0] }
			$.data(a, w, d)
			this._changeCountdown(a)
		},
		_addTarget: function(a) {
			if (!this._hasTarget(a)) {
				this._timerTargets.push(a)
			}
		},
		_hasTarget: function(a) {
			return $.inArray(a, this._timerTargets) > -1
		},
		_removeTarget: function(b) {
			this._timerTargets = $.map(this._timerTargets, function(a) {
				return a == b ? null : a
			})
		},
		_updateTargets: function() {
			for (var i = 0; i < this._timerTargets.length; i++) {
				this._updateCountdown(this._timerTargets[i])
			}
		},
		_updateCountdown: function(a, b) {
			var c = $(a)
			b = b || $.data(a, w)
			if (!b) {
				return
			}
			c.html(this._generateHTML(b))
			c[(this._get(b, 'isRTL') ? 'add' : 'remove') + 'Class']('countdown_rtl')
			var d = this._get(b, 'onTick')
			if (d) {
				var e = b._hold != 'lap' ? b._periods : this._calculatePeriods(b, b._show, new Date())
				d.apply(a, [e])
			}
			var f =
				b._hold != 'pause' &&
				(b._since ? b._now.getTime() < b._since.getTime() : b._now.getTime() >= b._until.getTime())
			if (f && !b._expiring) {
				b._expiring = true
				if (this._hasTarget(a) || this._get(b, 'alwaysExpire')) {
					this._removeTarget(a)
					var g = this._get(b, 'onExpiry')
					if (g) {
						g.apply(a, [])
					}
					var h = this._get(b, 'expiryText')
					if (h) {
						var i = this._get(b, 'layout')
						b.options.layout = h
						this._updateCountdown(a, b)
						b.options.layout = i
					}
					var j = this._get(b, 'expiryUrl')
					if (j) {
						window.location = j
					}
				}
				b._expiring = false
			} else if (b._hold == 'pause') {
				this._removeTarget(a)
			}
			$.data(a, w, b)
		},
		_changeCountdown: function(a, b, c) {
			b = b || {}
			if (typeof b == 'string') {
				var d = b
				b = {}
				b[d] = c
			}
			var e = $.data(a, w)
			if (e) {
				this._resetExtraLabels(e.options, b)
				extendRemove(e.options, b)
				this._adjustSettings(a, e)
				$.data(a, w, e)
				var f = new Date()
				if ((e._since && e._since < f) || (e._until && e._until > f)) {
					this._addTarget(a)
				}
				this._updateCountdown(a, e)
			}
		},
		_resetExtraLabels: function(a, b) {
			var c = false
			for (var n in b) {
				if (n.match(/[Ll]abels/)) {
					c = true
					break
				}
			}
			if (c) {
				for (var n in a) {
					if (n.match(/[Ll]abels[0-9]/)) {
						a[n] = null
					}
				}
			}
		},
		_adjustSettings: function(a, b) {
			var c = this._get(b, 'serverSync')
			c = c ? c.apply(a, []) : null
			var d = new Date()
			var e = this._get(b, 'timezone')
			e = e == null ? -d.getTimezoneOffset() : e
			b._since = this._get(b, 'since')
			if (b._since != null) {
				b._since = this.UTCDate(e, this._determineTime(b._since, null))
				if (b._since && c) {
					b._since.setMilliseconds(b._since.getMilliseconds() + d.getTime() - c.getTime())
				}
			}
			b._until = this.UTCDate(e, this._determineTime(this._get(b, 'until'), d))
			if (c) {
				b._until.setMilliseconds(b._until.getMilliseconds() + d.getTime() - c.getTime())
			}
			b._show = this._determineShow(b)
		},
		_destroyCountdown: function(a) {
			var b = $(a)
			if (!b.hasClass(this.markerClassName)) {
				return
			}
			this._removeTarget(a)
			b.removeClass(this.markerClassName).empty()
			$.removeData(a, w)
		},
		_pauseCountdown: function(a) {
			this._hold(a, 'pause')
		},
		_lapCountdown: function(a) {
			this._hold(a, 'lap')
		},
		_resumeCountdown: function(a) {
			this._hold(a, null)
		},
		_hold: function(a, b) {
			var c = $.data(a, w)
			if (c) {
				if (c._hold == 'pause' && !b) {
					c._periods = c._savePeriods
					var d = c._since ? '-' : '+'
					c[c._since ? '_since' : '_until'] = this._determineTime(
						d +
							c._periods[0] +
							'y' +
							d +
							c._periods[1] +
							'o' +
							d +
							c._periods[2] +
							'w' +
							d +
							c._periods[3] +
							'd' +
							d +
							c._periods[4] +
							'h' +
							d +
							c._periods[5] +
							'm' +
							d +
							c._periods[6] +
							's',
					)
					this._addTarget(a)
				}
				c._hold = b
				c._savePeriods = b == 'pause' ? c._periods : null
				$.data(a, w, c)
				this._updateCountdown(a, c)
			}
		},
		_getTimesCountdown: function(a) {
			var b = $.data(a, w)
			return !b ? null : !b._hold ? b._periods : this._calculatePeriods(b, b._show, new Date())
		},
		_get: function(a, b) {
			return a.options[b] != null ? a.options[b] : $.countdown._defaults[b]
		},
		_determineTime: function(k, l) {
			var m = function(a) {
				var b = new Date()
				b.setTime(b.getTime() + a * 1000)
				return b
			}
			var n = function(a) {
				a = a.toLowerCase()
				var b = new Date()
				var c = b.getFullYear()
				var d = b.getMonth()
				var e = b.getDate()
				var f = b.getHours()
				var g = b.getMinutes()
				var h = b.getSeconds()
				var i = /([+-]?[0-9]+)\s*(s|m|h|d|w|o|y)?/g
				var j = i.exec(a)
				while (j) {
					switch (j[2] || 's') {
						case 's':
							h += parseInt(j[1], 10)
							break
						case 'm':
							g += parseInt(j[1], 10)
							break
						case 'h':
							f += parseInt(j[1], 10)
							break
						case 'd':
							e += parseInt(j[1], 10)
							break
						case 'w':
							e += parseInt(j[1], 10) * 7
							break
						case 'o':
							d += parseInt(j[1], 10)
							e = Math.min(e, $.countdown._getDaysInMonth(c, d))
							break
						case 'y':
							c += parseInt(j[1], 10)
							e = Math.min(e, $.countdown._getDaysInMonth(c, d))
							break
					}
					j = i.exec(a)
				}
				return new Date(c, d, e, f, g, h, 0)
			}
			var o = k == null ? l : typeof k == 'string' ? n(k) : typeof k == 'number' ? m(k) : k
			if (o) o.setMilliseconds(0)
			return o
		},
		_getDaysInMonth: function(a, b) {
			return 32 - new Date(a, b, 32).getDate()
		},
		_generateHTML: function(c) {
			c._periods = periods = c._hold ? c._periods : this._calculatePeriods(c, c._show, new Date())
			var d = false
			var e = 0
			var f = $.extend({}, c._show)
			for (var g = 0; g < c._show.length; g++) {
				d |= c._show[g] == '?' && periods[g] > 0
				f[g] = c._show[g] == '?' && !d ? null : c._show[g]
				e += f[g] ? 1 : 0
			}
			var h = this._get(c, 'compact')
			var i = this._get(c, 'layout')
			var j = h ? this._get(c, 'compactLabels') : this._get(c, 'labels')
			var k = this._get(c, 'timeSeparator')
			var l = this._get(c, 'description') || ''
			var m = function(a) {
				var b = $.countdown._get(c, 'compactLabels' + periods[a])
				return f[a] ? periods[a] + (b ? b[a] : j[a]) + ' ' : ''
			}
			var n = function(a) {
				var b = $.countdown._get(c, 'labels' + periods[a])
				return f[a]
					? '<span class="countdown_section"><span class="countdown_amount">' +
							periods[a] +
							'</span><br/>' +
							(b ? b[a] : j[a]) +
							'</span>'
					: ''
			}
			return i
				? this._buildLayout(c, f, i, h)
				: (h
						? '<span class="countdown_row countdown_amount' +
						  (c._hold ? ' countdown_holding' : '') +
						  '">' +
						  m(Y) +
						  m(O) +
						  m(W) +
						  m(D) +
						  (f[H] ? this._minDigits(periods[H], 2) : '') +
						  (f[M] ? (f[H] ? k : '') + this._minDigits(periods[M], 2) : '') +
						  (f[S] ? (f[H] || f[M] ? k : '') + this._minDigits(periods[S], 2) : '')
						: '<span class="countdown_row countdown_show' +
						  e +
						  (c._hold ? ' countdown_holding' : '') +
						  '">' +
						  n(Y) +
						  n(O) +
						  n(W) +
						  n(D) +
						  n(H) +
						  n(M) +
						  n(S)) +
						'</span>' +
						(l ? '<span class="countdown_row countdown_descr">' + l + '</span>' : '')
		},
		_buildLayout: function(c, d, e, f) {
			var g = this._get(c, f ? 'compactLabels' : 'labels')
			var h = function(a) {
				return ($.countdown._get(c, (f ? 'compactLabels' : 'labels') + c._periods[a]) || g)[a]
			}
			var j = function(a, b) {
				return Math.floor(a / b) % 10
			}
			var k = {
				desc: this._get(c, 'description'),
				sep: this._get(c, 'timeSeparator'),
				yl: h(Y),
				yn: c._periods[Y],
				ynn: this._minDigits(c._periods[Y], 2),
				ynnn: this._minDigits(c._periods[Y], 3),
				y1: j(c._periods[Y], 1),
				y10: j(c._periods[Y], 10),
				y100: j(c._periods[Y], 100),
				y1000: j(c._periods[Y], 1000),
				ol: h(O),
				on: c._periods[O],
				onn: this._minDigits(c._periods[O], 2),
				onnn: this._minDigits(c._periods[O], 3),
				o1: j(c._periods[O], 1),
				o10: j(c._periods[O], 10),
				o100: j(c._periods[O], 100),
				o1000: j(c._periods[O], 1000),
				wl: h(W),
				wn: c._periods[W],
				wnn: this._minDigits(c._periods[W], 2),
				wnnn: this._minDigits(c._periods[W], 3),
				w1: j(c._periods[W], 1),
				w10: j(c._periods[W], 10),
				w100: j(c._periods[W], 100),
				w1000: j(c._periods[W], 1000),
				dl: h(D),
				dn: c._periods[D],
				dnn: this._minDigits(c._periods[D], 2),
				dnnn: this._minDigits(c._periods[D], 3),
				d1: j(c._periods[D], 1),
				d10: j(c._periods[D], 10),
				d100: j(c._periods[D], 100),
				d1000: j(c._periods[D], 1000),
				hl: h(H),
				hn: c._periods[H],
				hnn: this._minDigits(c._periods[H], 2),
				hnnn: this._minDigits(c._periods[H], 3),
				h1: j(c._periods[H], 1),
				h10: j(c._periods[H], 10),
				h100: j(c._periods[H], 100),
				h1000: j(c._periods[H], 1000),
				ml: h(M),
				mn: c._periods[M],
				mnn: this._minDigits(c._periods[M], 2),
				mnnn: this._minDigits(c._periods[M], 3),
				m1: j(c._periods[M], 1),
				m10: j(c._periods[M], 10),
				m100: j(c._periods[M], 100),
				m1000: j(c._periods[M], 1000),
				sl: h(S),
				sn: c._periods[S],
				snn: this._minDigits(c._periods[S], 2),
				snnn: this._minDigits(c._periods[S], 3),
				s1: j(c._periods[S], 1),
				s10: j(c._periods[S], 10),
				s100: j(c._periods[S], 100),
				s1000: j(c._periods[S], 1000),
			}
			var l = e
			for (var i = 0; i < 7; i++) {
				var m = 'yowdhms'.charAt(i)
				var o = new RegExp('\\{' + m + '<\\}(.*)\\{' + m + '>\\}', 'g')
				l = l.replace(o, d[i] ? '$1' : '')
			}
			$.each(k, function(n, v) {
				var a = new RegExp('\\{' + n + '\\}', 'g')
				l = l.replace(a, v)
			})
			return l
		},
		_minDigits: function(a, b) {
			a = '' + a
			if (a.length >= b) {
				return a
			}
			a = '0000000000' + a
			return a.substr(a.length - b)
		},
		_determineShow: function(a) {
			var b = this._get(a, 'format')
			var c = []
			c[Y] = b.match('y') ? '?' : b.match('Y') ? '!' : null
			c[O] = b.match('o') ? '?' : b.match('O') ? '!' : null
			c[W] = b.match('w') ? '?' : b.match('W') ? '!' : null
			c[D] = b.match('d') ? '?' : b.match('D') ? '!' : null
			c[H] = b.match('h') ? '?' : b.match('H') ? '!' : null
			c[M] = b.match('m') ? '?' : b.match('M') ? '!' : null
			c[S] = b.match('s') ? '?' : b.match('S') ? '!' : null
			return c
		},
		_calculatePeriods: function(f, g, h) {
			f._now = h
			f._now.setMilliseconds(0)
			var i = new Date(f._now.getTime())
			if (f._since) {
				if (h.getTime() < f._since.getTime()) {
					f._now = h = i
				} else {
					h = f._since
				}
			} else {
				i.setTime(f._until.getTime())
				if (h.getTime() > f._until.getTime()) {
					f._now = h = i
				}
			}
			var j = [0, 0, 0, 0, 0, 0, 0]
			if (g[Y] || g[O]) {
				var k = $.countdown._getDaysInMonth(h.getFullYear(), h.getMonth())
				var l = $.countdown._getDaysInMonth(i.getFullYear(), i.getMonth())
				var m =
					i.getDate() == h.getDate() ||
					(i.getDate() >= Math.min(k, l) && h.getDate() >= Math.min(k, l))
				var n = function(a) {
					return (a.getHours() * 60 + a.getMinutes()) * 60 + a.getSeconds()
				}
				var o = Math.max(
					0,
					(i.getFullYear() - h.getFullYear()) * 12 +
						i.getMonth() -
						h.getMonth() +
						((i.getDate() < h.getDate() && !m) || (m && n(i) < n(h)) ? -1 : 0),
				)
				j[Y] = g[Y] ? Math.floor(o / 12) : 0
				j[O] = g[O] ? o - j[Y] * 12 : 0
				var p = function(a, b, c) {
					var d = a.getDate() == c
					var e = $.countdown._getDaysInMonth(a.getFullYear() + b * j[Y], a.getMonth() + b * j[O])
					if (a.getDate() > e) {
						a.setDate(e)
					}
					a.setFullYear(a.getFullYear() + b * j[Y])
					a.setMonth(a.getMonth() + b * j[O])
					if (d) {
						a.setDate(e)
					}
					return a
				}
				if (f._since) {
					i = p(i, -1, l)
				} else {
					h = p(new Date(h.getTime()), +1, k)
				}
			}
			var q = Math.floor((i.getTime() - h.getTime()) / 1000)
			var r = function(a, b) {
				j[a] = g[a] ? Math.floor(q / b) : 0
				q -= j[a] * b
			}
			r(W, 604800)
			r(D, 86400)
			r(H, 3600)
			r(M, 60)
			r(S, 1)
			if (q > 0 && !f._since) {
				var s = [1, 12, 4.3482, 7, 24, 60, 60]
				var t = S
				var u = 1
				for (var v = S; v >= Y; v--) {
					if (g[v]) {
						if (j[t] >= u) {
							j[t] = 0
							q = 1
						}
						if (q > 0) {
							j[v]++
							q = 0
							t = v
							u = 1
						}
					}
					u *= s[v]
				}
			}
			return j
		},
	})
	function extendRemove(a, b) {
		$.extend(a, b)
		for (var c in b) {
			if (b[c] == null) {
				a[c] = null
			}
		}
		return a
	}
	$.fn.countdown = function(a) {
		var b = Array.prototype.slice.call(arguments, 1)
		if (a == 'getTimes' || a == 'settings') {
			return $.countdown['_' + a + 'Countdown'].apply($.countdown, [this[0]].concat(b))
		}
		return this.each(function() {
			if (typeof a == 'string') {
				$.countdown['_' + a + 'Countdown'].apply($.countdown, [this].concat(b))
			} else {
				$.countdown._attachCountdown(this, a)
			}
		})
	}
	$.countdown = new Countdown()
})(jQuery)
