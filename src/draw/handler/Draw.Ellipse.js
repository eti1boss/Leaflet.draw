/**
 * @class L.Draw.Ellipe
 * @aka Draw.Ellipse
 * @inherits L.Draw.SimpleShape
 */
L.Draw.Ellipse = L.Draw.SimpleShape.extend({
	statics: {
		TYPE: 'ellipse'
	},

	options: {
		shapeOptions: {
			stroke: true,
			color: '#3388ff',
			weight: 4,
			opacity: 0.5,
			fill: true,
			fillColor: null, //same as color by default
			fillOpacity: 0.2,
			clickable: true
		},
		showRadius: true,
		metric: true, // Whether to use the metric measurement system or imperial
		feet: true, // When not metric, use feet instead of yards for display
		nautic: false // When not metric, not feet use nautic mile for display
	},
	// @method initialize(): void
	initialize: function (map, options) {
		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = L.Draw.Ellipse.TYPE;

		this._initialLabelText = L['drawLocal'].draw.handlers.ellipse.tooltip.start;

		L.Draw.SimpleShape.prototype.initialize.call(this, map, options);
	},

	_drawShape: function (latlng) {
		// Calculate the distance based on the version
		if (L.GeometryUtil.isVersion07x()) {
			var distance = this._startLatLng.distanceTo(latlng);
		} else {
			var distance = this._map.distance(this._startLatLng, latlng);
		}

		this.options = {
			shapeOptions: {
				stroke: true,
				color: '#3388ff',
				weight: 4,
				opacity: 0.5,
				fill: true,
				fillColor: null, //same as color by default
				fillOpacity: 0.2,
				clickable: true
			},
			showRadius: true,
			metric: true, // Whether to use the metric measurement system or imperial
			feet: true, // When not metric, use feet instead of yards for display
			nautic: false // When not metric, not feet use nautic mile for display
		};

		var radius = Math.abs(latlng.lng - this._startLatLng.lng);
		var radiusY = Math.abs(latlng.lat - this._startLatLng.lat);

		if (!this._shape) {

			this._shape = new L.Ellipse(this._startLatLng, { radius: radius, radiusY: radiusY }, this.options.shapeOptions);
			this._map.addLayer(this._shape);
		} else {
			this._shape.setRadius(radius);
			this._shape.setRadiusY(radiusY);
		}
	},

	_fireCreatedEvent: function () {
		var radius = this._shape.getRadius();
		var radiusY = this._shape.getRadiusY();
		var ellipse = new L.Ellipse(this._startLatLng, { radius: radius, radiusY: radiusY }, this.options.shapeOptions);
		L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this, ellipse);
	},

	_onMouseMove: function (e) {
		var latlng = e.latlng,
			showRadius = this.options.showRadius,
			useMetric = this.options.metric,
			radius;

		this._tooltip.updatePosition(latlng);
		if (this._isDrawing) {
			this._drawShape(latlng);

			// Get the new radius (rounded to 1 dp)
			radius = this._shape.getRadius().toFixed(1);

			var subtext = '';
			if (showRadius) {
				subtext = L['drawLocal'].draw.handlers.circle.radius + ': ' +
					L.GeometryUtil.readableDistance(radius, useMetric, this.options.feet, this.options.nautic);
			}
			this._tooltip.updateContent({
				text: this._endLabelText,
				subtext: subtext
			});
		}
	}
});