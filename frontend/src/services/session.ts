class Session {
  private static _socket: WebSocket | null = null;
  private static _messageQueue = [];
  public static _history: Record<string, unknown>[] = [];
  private static _connecting = false;

  private static _disconnecting = false;

  public static restoreOrStartNewSession() {
    if (Session.isConnected()) {
      Session.disconnect();
    }
    Session._connect();
  }

  public static startNewSession() {
    Session.restoreOrStartNewSession();
  }

  static isConnected(): boolean {
    return (
      Session._socket !== null && Session._socket.readyState === WebSocket.OPEN
    );
  }

  static disconnect(): void {
    Session._disconnecting = true;
    if (Session._socket) {
      Session._socket.close();
    }
    Session._socket = null;
  }

  private static _connect(): void {
    if (Session.isConnected()) return;
    Session._connecting = true;
    let wsURL = "/ws";
    Session._socket = new WebSocket(wsURL);
    Session._setupSocket();
  }

  static send = (message: string) => {
    if (Session._socket) {
      Session._socket.send(message);
    }
  };

  private static _setupSocket(): void {
    if (!Session._socket) {
      throw new Error("no socket ");
    }

    Session._socket.onmessage = (e) => {
      let data = null;
      try {
        data = JSON.parse(e.data);
        Session._history.push(data);
      } catch (err) {
        return;
      }
    };
  }
}
