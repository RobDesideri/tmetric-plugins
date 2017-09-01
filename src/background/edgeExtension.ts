﻿class EdgeExtension extends ExtensionBase {

    constructor() {
        super();
    }

    /**
     * @override
     */
    getExtensionUUID() {
        console.log('ms-browser-extension://' + chrome.runtime.id + '/popup/popup.html?tab=true');
        return chrome.runtime.id;
    }

    /**
     * @override
     * @param sender
     */
    isPopupRequest(sender: chrome.runtime.MessageSender) {
        console.log(sender);
        console.log('isPopupReq', !sender.url || !!sender.url.match(/^ms-browser-extension:\/\/.+popup.html[?]tab=true$/g));
        return !sender.url || !!sender.url.match(/^ms-browser-extension:\/\/.+popup.html[?]tab=true$/g);
    }

    /**
     * Show push notification (Does not support through web extension by Edge right now)
     * @override
     * @param message
     * @param title
     */
    showNotification(message: string, title?: string) {

        this.getActiveTabId().then(id => {
            title = title || 'TMetric';

            this.sendToTabs({
                action: 'notify',
                data: {
                    message: message,
                    title: title
                }
            }, id);
        });
    }

    /**
     * Create popup window
     * @override
     * @param width
     * @param height
     * @param left
     * @param top
     */
    createPopupWindow(width: number, height: number, left: number, top: number) {
        chrome.windows.create(<chrome.windows.CreateData>{
            left,
            top,
            width,
            height,
            focused: true,
            url: this.getLoginUrl(),
            type: 'popup'
        }, popupWindow => {

            var popupTab = popupWindow.tabs[0];

            this.loginWinId = popupWindow.id;
            this.loginTabId = popupTab.id;
            this.loginWindowPending = false;
        });
    }
}

new EdgeExtension();