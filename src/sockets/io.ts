import { Socket } from "socket.io"
import { io } from "../app"

export const handleSocketConnection = (client: Socket) => {
  // Join room based on user's region/role
  client.on('joinRoom', (data: { role: string; region: string; userId: string }) => {
    const { role, region, userId } = data;
    if (role === 'defense') {
      client.join(`defense-${region}`);
    } else {
      client.join(`attacker-${userId}`);
    }
  });

  // Attack launch event
  client.on('attackLaunched', (data) => {
    const { targetRegion, attackDetails, timer } = data;
    // Broadcast to all defenders in the target region
    io.to(`defense-${targetRegion}`).emit('newAlert', {
      ...attackDetails,
      timeRemaining: timer,
      status: 'incoming'
    });
    // Send to attacker
    io.to(`attacker-${data.attackerId}`).emit('attackStatus', {
      status: 'launched',
      attackId: attackDetails.id
    });
  });

  // Interception attempt event
  client.on('interceptAttempt', (data) => {
    const { attackId, defenderInfo, missileType } = data;
    // Broadcast status update to all defenders in region
    io.to(`defense-${defenderInfo.region}`).emit('interceptStatus', {
      attackId,
      status: 'interception-attempted',
      defender: defenderInfo
    });
    // Notify attacker
    io.to(`attacker-${data.attackerId}`).emit('attackStatus', {
      attackId,
      status: 'interception-attempted'
    });
  });

  // Attack outcome event
  client.on('attackOutcome', (data) => {
    const { outcome, region, attackId } = data;
    // Broadcast final result to all relevant parties
    io.to(`defense-${region}`).emit('attackResult', {
      attackId,
      outcome
    });
    io.to(`attacker-${data.attackerId}`).emit('attackResult', {
      attackId,
      outcome
    });
  });
};