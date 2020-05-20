import { MatrixClient, MentionPill, MessageEvent, MessageEventContent, LogService } from "matrix-bot-sdk";
import * as htmlEscape from "escape-html";

export async function runInviteCommand(roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: MatrixClient) {
    let userId = "@lucas:localhost";
    let isAgentJoined;
    LogService.info("CommandHandler", `Voy a invitar a ${userId}... ojo pues`);
    await client.inviteUser(userId, roomId)
    isAgentJoined = await checkAgentJoined(roomId, userId, client);
    console.log("Finalmente...", isAgentJoined)
    return;
}

async function checkAgentJoined(roomId: string, agentId: string, client: MatrixClient) {

  // Create a promise that rejects in <ms> milliseconds
  let timeoutId;
  let timeoutPromise = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
        console.log("PASARON 15 SEGUNDOS")
        resolve("false")
    }, 15000)
  })


  let promiseIsAgentInRoom = isAgentInRoom(roomId, agentId, client);
  // Returns a race between our timeout and the passed in promise
  return Promise.race([
    promiseIsAgentInRoom,
    timeoutPromise
  ]).then((result) => {
    console.log("Estoy en el then del RACE. DEVOLVIÓ ", result)
    clearTimeout(timeoutId);
    return result;
  });
}

async function isAgentInRoom(roomId: string, agentId: string, client: MatrixClient) {
    LogService.info("CommandHandler", `Chequeando si ${agentId} ya se unió`);
    const members = await client.getJoinedRoomMembers(roomId);
    if (members.includes(agentId)) {
        LogService.info("CommandHandler", `LISTO! ${agentId}... ya se unió`);
        return new Promise(function(resolve, reject) {
          // not taking our time to do the job
          resolve("true"); // immediately give the result: 123
        });
    }
    // else {
    //     setTimeout(() => {
    //         console.log("Intentando...")
    //         isAgentInRoom(roomId, agentId, client);
    //     }, 2000)
    //     return false
    // }
    else {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("Intentando...")
                isAgentInRoom(roomId, agentId, client);
            }, 2000)
        })
    }
}