L.Edit = L.Edit || {};
/**
 * @class L.Edit.Ellipse
 * @aka Edit.Circle
 * @inherits L.Edit.Circle
 */
L.Edit.Ellipse = L.Edit.Circle.extend({
	_getResizeMarkerPoint: function (latlng) {

		var deltaX = this._shape._radius * Math.cos(Math.PI / 4);
		var deltaY = this._shape._radiusY * Math.cos(Math.PI / 4);
		var point = this._map.project(latlng);

		return this._map.unproject([point.x + deltaX, point.y + deltaY]);
	},

	_resize: function (latlng) {
		var moveLatLng = this._moveMarker.getLatLng();
		var radius;
		// Calculate the radius based on the version
		if (L.GeometryUtil.isVersion07x()) {
			radius = moveLatLng.distanceTo(latlng);
		} else {
			radius = this._map.distance(moveLatLng, latlng);
		}

		var dx = Math.abs(moveLatLng.lng - latlng.lng);
		var dy = Math.abs(moveLatLng.lat - latlng.lat);

		this._shape.setRadius(dx);
		this._shape.setRadiusY(dy);

		if (this._map.editTooltip) {
			this._map._editTooltip.updateContent({
				text: L.drawLocal.edit.handlers.edit.tooltip.subtext + '<br />' + L.drawLocal.edit.handlers.edit.tooltip.text,
				subtext: L.drawLocal.draw.handlers.circle.radius + ': ' +
					L.GeometryUtil.readableDistance(radius, true, this.options.feet, this.options.nautic)
			});
		}

		this._shape.setRadius(dx);
		this._shape.setRadiusY(dy);

		this._map.fire(L.Draw.Event.EDITRESIZE, { layer: this._shape });
	}
})
L.Ellipse.addInitHook(function () {
	if (L.Edit.Ellipse) {
		this.editing = new L.Edit.Ellipse(this);

		if (this.options.editable) {
			this.editing.enable();
		}
	}

	this.on('add', function () {
		if (this.editing && this.editing.enabled()) {
			this.editing.addHooks();
		}
	});

	this.on('remove', function () {
		if (this.editing && this.editing.enabled()) {
			this.editing.removeHooks();
		}
	});
});
