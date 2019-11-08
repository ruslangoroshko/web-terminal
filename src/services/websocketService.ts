class WebSocketService {
  ws: WebSocket;
  constructor(connectionString: string) {
    this.ws = new WebSocket(connectionString);
    this.ws.onopen = this.onopen;
    this.ws.onerror = this.onerror;
    this.ws.onmessage = this.onmessage;
    this.ws.onclose = this.onclose;
  }

  onopen = (e: Event) => {
    console.log(e);
  };

  onmessage = (e: MessageEvent) => {
    console.log(e);
  };

  onerror = (e: Event) => {
    console.log(e);
  };

  onclose = (e: Event) => {
    console.log(e);
  };

  sendMessage = (
    message: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView
  ) => {
    this.ws.send(message);
  };
}

export default WebSocketService;
