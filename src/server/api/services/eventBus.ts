import { EventEmitter } from "events";

class GenericEventBus extends EventEmitter {
  emitUserRegistered(userData: any) {
    this.emit("user:registered", userData);
  }

  emitOrderPlaced(orderData: any) {
    this.emit("order:placed", orderData);
  }
}

export const eventBus = new GenericEventBus();
