// TODO: write a single Dashboard kind that does:
// adds option as to wether to use seperate dashboards or layers (for webOS 3, possible for html notifications that work right?)
// webOS 3: open custom dashboard as we do now
// webOS 2: open stock dashboard, as we do now, but whenever a new layer is pushed, call openDashboard again
// playbook: opens an individual webkit notification for each layer
// chrome: see if we can use the existing dashboard in chrome somehow, assuming it's custom Html Notifications actually work unlike playbook
// android: call out to the notification plugin
// TODO: fix that damned android notification plugin

if(Platform.isWebOS() && Platform.platformVersion < 3.0) {
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