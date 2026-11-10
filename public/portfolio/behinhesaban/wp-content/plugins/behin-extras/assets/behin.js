(function () {
	var STEP = 12;

	function norm(s) {
		return (s || '')
			.replace(/[يى]/g, 'ی').replace(/ك/g, 'ک')
			.replace(/[‌‏ً-ٟ]/g, '')
			.replace(/[۰-۹]/g, function (d) { return String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)); })
			.replace(/\s+/g, ' ').trim().toLowerCase();
	}
	function shuffle(a) {
		for (var i = a.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var t = a[i]; a[i] = a[j]; a[j] = t;
		}
		return a;
	}

	// FAQ page: random order + load more on scroll.
	document.querySelectorAll('[data-bh-faq]').forEach(function (root) {
		var list = root.querySelector('.bh-faq__list');
		var input = root.querySelector('[data-bh-faq-search]');
		var empty = root.querySelector('[data-bh-faq-empty]');
		var more = root.querySelector('[data-bh-faq-more]');
		var items = shuffle(Array.prototype.slice.call(root.querySelectorAll('.bh-qa')));
		items.forEach(function (el) {
			el._t = norm(el.textContent);
			list.insertBefore(el, more);
		});
		var matches = items;
		var shown = 0;

		function reveal(n, animate) {
			var end = Math.min(matches.length, shown + n);
			for (var i = shown; i < end; i++) {
				matches[i].classList.remove('is-later');
				if (animate) {
					matches[i].classList.add('is-new');
				}
			}
			shown = end;
			if (more) { more.hidden = shown >= matches.length; }
		}
		function apply() {
			var q = norm(input ? input.value : '');
			var terms = q ? q.split(' ') : [];
			matches = items.filter(function (el) {
				return terms.every(function (t) { return el._t.indexOf(t) !== -1; });
			});
			items.forEach(function (el) {
				el.hidden = matches.indexOf(el) === -1;
				el.classList.add('is-later');
				el.classList.remove('is-new');
			});
			shown = 0;
			reveal(STEP, false);
			if (empty) { empty.hidden = matches.length !== 0; }
		}

		if (more && 'IntersectionObserver' in window) {
			new IntersectionObserver(function (entries) {
				if (entries[0].isIntersecting && shown < matches.length) {
					reveal(STEP, true);
				}
			}, { rootMargin: '300px 0px' }).observe(more);
		} else if (more) {
			more.hidden = true;
			STEP = items.length;
		}
		if (input) {
			var t;
			input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(apply, 150); });
		}
		apply();
	});

	// Homepage teaser: show a random subset on every visit (page itself may be cached).
	document.querySelectorAll('[data-bh-shuffle]').forEach(function (ul) {
		var n = parseInt(ul.getAttribute('data-bh-shuffle'), 10) || 4;
		var lis = shuffle(Array.prototype.slice.call(ul.children));
		lis.forEach(function (li, i) {
			ul.appendChild(li);
			li.classList.toggle('is-hidden', i >= n);
		});
	});
})();
