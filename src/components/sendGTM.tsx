function sendGTMEvent(data: { [key: string]: any }) {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push(data);
    }
  }
  
  export default sendGTMEvent;
  