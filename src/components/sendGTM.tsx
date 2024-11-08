function sendGTMEvent(eventName: string) {
    if (window && window.dataLayer) {
        window.dataLayer.push({
            event: eventName, // This will be 'contactClicked' in your case
            event_name: eventName, // GA4-specific parameter
        });
    }
}

export default sendGTMEvent;
