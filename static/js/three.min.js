window.requestAnimFrame = (function () {
		return  window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	Math.randMinMax = function(min, max, round) {
		var val = min + (Math.random() * (max - min));

		if( round ) val = Math.round( val );

		return val;
	};
	Math.TO_RAD = Math.PI/180;
	Math.getAngle = function( x1, y1, x2, y2 ) {

		var	dx = x1 - x2,
			dy = y1 - y2;

		return Math.atan2(dy,dx);
	};
	Math.getDistance = function( x1, y1, x2, y2 ) {

		var 	xs = x2 - x1,
			ys = y2 - y1;

		xs *= xs;
		ys *= ys;

		return Math.sqrt( xs + ys );
	};

	var 	FX = {};

	(function() {

		var	canvas = document.getElementById('myCanvas'),
			ctx = canvas.getContext('2d'),
			lastUpdate = new Date(),
			mouseUpdate = new Date(),
			lastMouse = [],
			width, height;

		FX.particles = [];

		setFullscreen();
		document.getElementById('button').addEventListener('mousedown', buttonEffect);

		function buttonEffect() {

			var button = document.getElementById('button'),
				height = button.offsetHeight,
				left = button.offsetLeft,
				top = button.offsetTop,
				width = button.offsetWidth,
				x, y, degree;

			for(var i=0;i<40;i=i+1) {

				if( Math.random() < 0.5 ) {

					y = Math.randMinMax(top, top+height);

					if( Math.random() < 0.5 ) {
						x = left;
						degree = Math.randMinMax(-45,45);
					} else {
						x = left + width;
						degree = Math.randMinMax(135,225);
					}

				} else {

					x = Math.randMinMax(left, left+width);

					if( Math.random() < 0.5 ) {
						y = top;
						degree = Math.randMinMax(45,135);
					} else {
						y = top + height;
						degree = Math.randMinMax(-135, -45);
					}

				}
				createParticle({
					x: x,
					y: y,
					degree: degree,
					speed: Math.randMinMax(100, 150),
					vs: Math.randMinMax(-4,-1)
				});
			}
		}
		window.setTimeout(buttonEffect, 100);

		loop();

		window.addEventListener('resize', setFullscreen );

		function createParticle( args ) {

			var options = {
				x: width/2,
				y: height/2,
				color: 'hsla('+ Math.randMinMax(160, 290) +', 100%, 50%, '+(Math.random().toFixed(2))+')',
				degree: Math.randMinMax(0, 360),
				speed: Math.randMinMax(300, 350),
				vd: Math.randMinMax(-90,90),
				vs: Math.randMinMax(-8,-5)
			};

			for (key in args) {
			  options[key] = args[key];
			}

			FX.particles.push( options );
		}

		function loop() {

			var 	thisUpdate = new Date(),
				delta = (lastUpdate - thisUpdate) / 1000,
				amount = FX.particles.length,
				size = 2,
				i = 0,
				p;

			ctx.fillStyle = 'rgba(15,15,15,0.25)';
			ctx.fillRect(0,0,width,height);

			ctx.globalCompositeStyle = 'lighter';

			for(;i<amount;i=i+1) {

				p = FX.particles[ i ];

				p.degree += (p.vd * delta);
				p.speed += (p.vs);// * delta);
				if( p.speed < 0 ) continue;

				p.x += Math.cos(p.degree * Math.TO_RAD) * (p.speed * delta);
				p.y += Math.sin(p.degree * Math.TO_RAD) * (p.speed * delta);

				ctx.save();

				ctx.translate( p.x, p.y );
				ctx.rotate( p.degree * Math.TO_RAD );

				ctx.fillStyle = p.color;
				ctx.fillRect( -size, -size, size*2, size*2 );

				ctx.restore();
			}

			lastUpdate = thisUpdate;

			requestAnimFrame( loop );
		}

		function setFullscreen() {
			width = canvas.width = window.innerWidth;
			height = canvas.height = window.innerHeight;
		};
	})();