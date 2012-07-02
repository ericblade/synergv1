if(window.PalmSystem && Platform.platformVersion < 3.0) {
	enyo.kind({ name: "gvoice.Dashboard", kind: "enyo.Dashboard" });
} else {
	enyo.kind({
		name: "gvoice.Dashboard",
		kind: "enyo.Dashboard",
		indexPath: "mainApp/dashboard/dashboard.html",
		
		updateWindow: function() {
			// Note that closed windows may get their js bindings snipped, so 'w.closed' may actually be undefined instead of true.
			var windowValid = this.window && this.window.closed === false;
			// If we have items to display, then create the window if we don't already have one.
			if(this.layers.length) {
				var params = {layers:this.layers, docPath:document.location.pathname, dashboardId:this.dashboardId};
				if(!windowValid) {
					var attributes = {
						webosDragMode:"manual",
						window:"dashboard",
						doubleheightdash:true,
						_enyoOpener:window,					
					};
					if(this.smallIcon) {
						attributes.icon = this.smallIcon;
					}
					attributes = JSON.stringify(attributes);
					this.window = enyo.windows.openDashboard(enyo.path.rewrite(this.indexPath), this.name, params, attributes);
				} else {
					enyo.windows.activate(undefined, this.name, params);
				}
			} else {
				if(windowValid) {
					this.window.close();
				}
				this.window = undefined;
			}
		},    
	});
}