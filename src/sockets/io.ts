import { Socket } from "socket.io";
import { io } from "../app";

export const handleSocketConnection = (client: Socket) => {
  console.log(`[socket.io] New Connection ${client.id}`);

  client.on('disconnect', () => {
    console.log("Bye bye client");
  });

  // Listen for attackLaunched event
  client.on('attackLaunched', (data) => {
    io.emit('attackLaunched', data);
  });

  // Listen for missileIntercepted event
  client.on('missileIntercepted', (data) => {
    io.emit('missileIntercepted', data);
  });
  client.on('attackHit', (data) =>{
    io.emit('attackHit', data)
  })
};