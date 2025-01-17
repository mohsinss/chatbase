import { Boom } from "@hapi/boom";
import {
  makeWASocket,
  Browsers,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  DisconnectReason,
  delay as delayin,
  generateProfilePicture,
} from "@whiskeysockets/baileys";
import { getDevice } from "./database/model.js";
import {
  Sticker,
  createSticker,
  StickerTypes,
} from "wa-sticker-formatter";
import QRCode from "qrcode";
import fs from "fs";
import { setStatus } from "./database/index.js";
import { IncomingMessage } from "./controllers/incomingMessage.js";
import {
  formatReceipt,
  getSavedPhoneNumber,
  prepareMediaMessage,
  createJid,
  delayMsg,
} from "./lib/helper.js";

/***********************************************************/
import MAIN_LOGGER from './lib/pino.js';
import NodeCache from "node-cache";
import { ulid } from "ulid";
import { formatButtonMsg, Button } from "./dto/button.js";
import { Section, formatListMsg } from "./dto/list.js";
import WAAuthStates from "./../models/AuthState.js"
import connectMongo from "./../libs/mongoose.js";

const logger = MAIN_LOGGER.child({});
const msgRetryCounterCache = new NodeCache();

let sock = [];
let qrcode = [];
let pairingCode = [];
let intervalStore = [];

const connectToWhatsApp = async (token, io = null, viaOtp = false) => {
  // await connectMongo();
  if (typeof qrcode[token] !== "undefined" && !viaOtp) {
    io?.emit("qrcode", {
      token,
      data: qrcode[token],
      message: "please scan with your Whatsapp Accountt",
    });

    return {
      status: false,
      sock: sock[token],
      qrcode: qrcode[token],
      message: "please scan",
    };
  }
  if (typeof pairingCode[token] !== "undefined" && viaOtp) {
    io?.emit("code", {
      token,
      data: pairingCode[token],
      message:
        "Go to whatsapp -> link device -> link with phone number, and pairing with this code.",
    });
    return {
      status: false,
      code: pairingCode[token],
      message: "pairing with that code",
    };
  }
  try {
    let number = sock[token].user.id.split(":");
    number = number[0] + "@s.whatsapp.net";
    const ppUrl = await getPpUrl(token, number);
    io?.emit("connection-open", {
      token,
      user: sock[token].user,
      ppUrl,
    });
    delete qrcode[token];
    delete pairingCode[token];
    return { status: true, message: "Already connected" };
  } catch (error) {
    io?.emit("message", {
      token,
      message: `Connecting.. (1)..`,
    });
  }
  //

  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(
    "You re using whatsapp gateway M Pedia v8.x.x - Contact admin if any trouble : 6292298859671"
  );
  console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);
  const existingAuth = await WAAuthStates.findOne({ token });
  console.log("existingAuth", existingAuth)
  let authState;

  if (existingAuth) {
      authState = existingAuth.creds;
  } else {
      authState = {}; // Initialize empty state if no existing auth found
  }
  // check or create credentials
  const { state, saveCreds } = await useMultiFileAuthState(
    `./credentials/${token}`
  );

  sock[token] = makeWASocket({
    // version: version,

    // browser: Browsers.ubuntu("AdiKhanOfficial"),
    // logger,
    printQRInTerminal: false,
    //  mobile: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    // auth: authState

    // msgRetryCounterCache,
    // generateHighQualityLinkPreview: true,
  });

  // sock[token] = makeWASocket({});

  if (!sock[token].authState.creds.registered) {
  // if (viaOtp && "me" in state.creds === false) {
    const phoneNumber = await getSavedPhoneNumber(token);
    try {
      const code = await sock[token].requestPairingCode(phoneNumber);
      pairingCode[token] = code;
    } catch (error) {
      io?.emit("message", {
        token,
        message: "Time out, please refresh page",
      });
    }
    io?.emit("code", {
      token,
      data: pairingCode[token],
      message:
        "Go to whatsapp -> link device -> link with phone number, and pairing with this code.",
    });
  }

  sock[token].ev.process(async (events) => {
    if (events["connection.update"]) {
      const update = events["connection.update"];
      const { connection, lastDisconnect, qr } = update;
      console.log("connection", update);

      if (connection === "close") {
        const ErrorMessage = lastDisconnect.error?.output?.payload?.message;
        const ErrorType = lastDisconnect.error?.output?.payload?.error;

        if (
          (lastDisconnect?.error instanceof Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut
        ) {
          delete qrcode[token];
          io?.emit("message", { token: token, message: "Connecting.." });
          // when refs qr attemts end
          if (ErrorMessage == "QR refs attempts ended") {
            sock[token].ws.close();
            delete qrcode[token];
            delete pairingCode[token];
            delete sock[token];
            //   clearConnection(token);
            io?.emit("message", {
              token,
              message: "Request QR ended. reload web to scan again",
            });
            return;
          }
          // ahwtsapp disconnect but still have session folder,should be delete
          if (
            ErrorType === "Unauthorized" ||
            ErrorType === "Method Not Allowed"
          ) {
            setStatus(token, "Disconnect");
            clearConnection(token);
            connectToWhatsApp(token, io);
          }
          if (ErrorMessage === "Stream Errored (restart required)") {
            connectToWhatsApp(token, io);
          }

          if (ErrorMessage === "Connection was lost") {
            delete sock[token];
          }
        } else {
          setStatus(token, "Disconnect");
          console.log("Connection closed. You are logged out.");
          io?.emit("message", {
            token,
            message: "Connection closed. You are logged out.",
          });
          clearConnection(token);
          connectToWhatsApp(token, io);
        }
      }

      if (qr) {
        // SEND TO YOUR CLIENT SIDE
        console.log("new qr", token);

        QRCode.toDataURL(qr, function (err, url) {
          if (err) console.log(err);
          qrcode[token] = url;
          connectToWhatsApp(token, io, viaOtp);
        });
      }
      if (connection === "open") {
        setStatus(token, "Connected");
        delete qrcode[token];
        delete pairingCode[token];
        let number = sock[token].user.id.split(":");
        number = number[0] + "@s.whatsapp.net";
        const ppUrl = await getPpUrl(token, number);
        console.log("connection open", ppUrl);

        io?.emit("connection-open", {
          token,
          user: sock[token].user,
          ppUrl,
        });
        delete qrcode[token];
        delete pairingCode[token];
      }
    }

    if (events["creds.update"]) {
      console.log('creds.update')
      const creds = events["creds.update"];
      saveCreds(creds);
      // await WAAuthStates.updateOne(
      //   { token },
      //   { creds },
      //   { upsert: true }
      // );
    }

    if (events["messages.upsert"]) {
      const messages = events["messages.upsert"];

      const reply = await IncomingMessage(messages, sock[token]);
      console.log(reply);
    }
  });

  sock[token].ev.on("call", async (node) => {
    // const getDeviceWa = await getDevice(sock[token].user.id.split(":")[0]);
    // const reject_call = getDeviceWa[0].reject_call;

    // if (reject_call === 1) {
    //   const { from, id, status } = node[0];
    //   if (status == "offer") {
    //     const sendresult = {
    //       tag: "call",
    //       attrs: {
    //         from: sock[token].user.id,
    //         to: from,
    //         id: sock[token].generateMessageTag(),
    //       },
    //       content: [
    //         {
    //           tag: "reject",
    //           attrs: {
    //             "call-id": id,
    //             "call-creator": from,
    //             count: "0",
    //           },
    //           content: undefined,
    //         },
    //       ],
    //     };
    //     await sock[token].query(sendresult);
    //   }
    // }
  });

  return {
    sock: sock[token],
    qrcode: qrcode[token],
  };
};
//
async function connectWaBeforeSend(token) {
  let status = undefined;
  let connect;
  connect = await connectToWhatsApp(token);

  await connect.sock.ev.on("connection.update", (con) => {
    const { connection, qr } = con;
    if (connection === "open") {
      status = true;
    }
    if (qr) {
      status = false;
    }
  });
  let counter = 0;
  while (typeof status === "undefined") {
    counter++;
    if (counter > 4) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return status;
}

//set available
const sendAvailable = async (body) => {
  const getDeviceAll = await getDevice(body);

  let sendAvailableResult;
  try {
    if (getDeviceAll[0].set_available != 1) {
      sendAvailableResult = await sock[body].sendPresenceUpdate("available");
    } else {
      sendAvailableResult = await sock[body].sendPresenceUpdate("unavailable");
    }
    return sendAvailableResult;
  } catch (error) {
    return false;
  }
};
// text message
const sendText = async (token, number, text, delay = 1) => {
  try {
    await delayMsg(delay * 1000, sock[token], number);
    const sendingTextMessage = await sock[token].sendMessage(
      formatReceipt(number),
      { text: spinText(text) }
    ); // awaiting sending message

    return sendingTextMessage;
  } catch (error) {
    console.log(error);

    return false;
  }
};

const sendMessage = async (token, number, msg, delay) => {
  try {
    await delayMsg(delay * 1000, sock[token], number);
    msg = JSON.parse(msg);
    if(msg.text){
        msg.text = spinText(msg.text);
    }
    const sendingTextMessage = await sock[token].sendMessage(
      formatReceipt(number),
      msg
    );
    return sendingTextMessage;
  } catch (error) {
    return false;
  }
};

async function sendMedia(token,destination,type,url,caption,ptt,filename,delay = 0) {
  const number = formatReceipt(destination);
  let ownerJid = sock[token].user.id.replace(/:\d+/, "");

  //for vn
  if (type == "audio") {
    return await sock[token].sendMessage(number, {
      audio: { url: url },
      ptt: true,
      mimetype: "audio/mpeg",
    });
  }
  // for send media ( document/video or image)
  const generate = await prepareMediaMessage(sock[token], {
    caption: caption ? spinText(caption) : "",
    fileName: filename,
    media: url,
    mediatype: type !== "video" && type !== "image" ? "document" : type,
  });
  const message = { ...generate.message };
  await delayMsg(delay * 1000, sock[token], number);
  return await sock[token].sendMessage(number, {
    forward: {
      key: { remoteJid: ownerJid, fromMe: true },
      message: message,
    },
  });
}

// button message
async function sendButtonMessage(token, number, button, message,footer,image = null) {
  /**
   * type is "url" or "local"
   * if you use local, you must upload into src/public/temp/[fileName]
   */
  let type = "url";
  const msg = message;
  try {
    const buttons = button.map((x, i) => {
      return new Button(x);
    });
    const message = await formatButtonMsg(
      buttons,
      footer,
      msg,
      sock[token],
      image
    );
    const msgId = ulid(Date.now());
    const sendMsg = await sock[token].relayMessage(
      formatReceipt(number),
      message,
      { messageId: msgId }
    );
    return sendMsg;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function sendTemplateMessage(token, number, button, text, footer, image) {
  try {
    if (image) {
      var buttonMessage = {
        caption: text,
        footer: footer,
        viewOnce: true,
        templateButtons: button,
        image: { url: image },
        viewOnce: true,
      };
    } else {
      var buttonMessage = {
        text: text,
        footer: footer,
        viewOnce: true,

        templateButtons: button,
      };
    }

    const sendMsg = await sock[token].sendMessage(
      formatReceipt(number),
      buttonMessage
    );
    return sendMsg;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// list message
async function sendListMessage(token, number, list, text, footer, title, buttonText, image = null ) {
  try {
    const sections = list.map((sect) => new Section(sect));

    const listMsg = await formatListMsg(
      sections,
      footer,
      text,
      sock[token],
      image
    );

    const msgId = ulid(Date.now());
    const sendMsg = await sock[token].relayMessage(
      formatReceipt(number),
      listMsg,
      { messageId: msgId }
    );
    return sendMsg;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function sendPollMessage(token, number, name, options, countable) {
  try {
    const sendmsg = await sock[token].sendMessage(formatReceipt(number), {
      poll: {
        name: name,
        values: options,
        selectableCount: countable,
      },
    });

    return sendmsg;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function sendLocation(waToken, recipient, latitude, longitude) {
  try {
    await delayMsg(1000, sock[waToken], recipient);
    const sendLocationResult = await sock[waToken].sendMessage(
      formatReceipt(recipient),
      {
        location: { degreesLatitude: latitude, degreesLongitude: longitude },
      }
    );
    return sendLocationResult;
  } catch (error) {
    return false;
  }
}

async function sendVcard(waToken, recipient, name, phone) {
  try {
    const vcard =
      "BEGIN:VCARD\n" + // metadata of the contact card
      "VERSION:3.0\n" +
      "FN:" +
      name +
      "\n" + // full name
      "TEL;type=CELL;type=VOICE;waid=" +
      phone +
      ":+" +
      phone +
      "\n" + // WhatsApp ID + phone number
      "END:VCARD";
    delayMsg(1000, sock[waToken], recipient);
    const sendLocationResult = await sock[waToken].sendMessage(
      formatReceipt(recipient),
      {
        contacts: {
          displayName: name,
          contacts: [{ vcard }],
        },
      }
    );
    return sendLocationResult;
  } catch (error) {
    return false;
  }
}

async function sendSticker(waToken,recipient,mediaType,mediaPath,message, fileName) {
  const formattedRecipient = formatReceipt(recipient);
  let userId = sock[waToken].user.id.replace(/:\d+/, "");
  const sticker = new Sticker(mediaPath, {
    pack: "",
    author: "",
    type: StickerTypes.FULL,
    quality: 50,
  });
  const buffer = await sticker.toBuffer();
  await sticker.toFile("sticker.webp");
  return await sock[waToken].sendMessage(
    formattedRecipient,
    await sticker.toMessage()
  );
}
// feetch group

async function fetchGroups(token) {
  // check is exists token
  try {
    let getGroups = await sock[token].groupFetchAllParticipating();
    let groups = Object.entries(getGroups)
      .slice(0)
      .map((entry) => entry[1]);

    return groups;
  } catch (error) {
    return false;
  }
}

// if exist
async function isExist(token, number) {
  try {
    if (typeof sock[token] === "undefined" ) {
      const status = await connectWaBeforeSend(token);
      if (!status) {
        return false;
      }
    }
    if (number.includes("@g.us")) {
      return true;
    } else {
      const [result] = await sock[token].onWhatsApp("+" + number);
      return number.length > 11 ? result : true;
    }
  } catch (error) {
    return false;
  }
}

async function superAccess(token, method, params) {
  try {
    if (typeof sock[token] === "undefined") {
      const status = await connectWaBeforeSend(token);
      if (!status) {
        return false;
      }
    }
    params = JSON.parse(params);
    if (!params || params.length === 0) {
      return await sock[token][method]();
    } 
    else {
      return await sock[token][method](...params);
    }
  }
  catch (error) {
    console.error("Error in Super Access:", error); 
    return false;
  }
}

function spinText(text) {
    const regex = /\{([^{}]*)\}/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        const options = match[1].split('|'); 
        const replacement = options[Math.floor(Math.random() * options.length)]; 
        text = text.replace(match[0], replacement); 
    }
    return text;
}

// ppUrl
async function getPpUrl(token, number, highrest) {
  let ppUrl;
  try {
    ppUrl = await sock[token].profilePictureUrl(number);
    return ppUrl;
  } catch (error) {
    return "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png";
  }
}

// close connection
async function deleteCredentials(token, io = null) {
  if (io !== null) {
    io.emit("message", { token: token, message: "Logout Progres.." });
  }
  try {
    if (typeof sock[token] === "undefined") {
      const status = await connectWaBeforeSend(token);
      if (status) {
        sock[token].logout();
        delete sock[token];
      }
    } else {
      sock[token].logout();
      delete sock[token];
    }
    delete qrcode[token];
    clearInterval(intervalStore[token]);
    setStatus(token, "Disconnect");

    if (io != null) {
      io.emit("Unauthorized", token);
      io.emit("message", {
        token: token,
        message: "Connection closed. You are logged out.",
      });
    }
    if (fs.existsSync(`./credentials/${token}`)) {
      fs.rmSync(
        `./credentials/${token}`,
        { recursive: true, force: true },
        (err) => {
          if (err) console.log(err);
        }
      );
      // fs.unlinkSync(`./sessions/session-${device}.json`)
    }

    // fs.rmdir(`credentials/${token}`, { recursive: true }, (err) => {
    //     if (err) {
    //         throw err;
    //     }
    //     console.log(`credentials/${token} is deleted`);
    // });

    return {
      status: true,
      message: "Deleting session and credential",
    };
  } catch (error) {
    console.log(error);
    return {
      status: true,
      message: "Nothing deleted",
    };
  }
}

function clearConnection(token) {
  clearInterval(intervalStore[token]);

  delete sock[token];
  delete qrcode[token];
  setStatus(token, "Disconnect");
  if (fs.existsSync(`./credentials/${token}`)) {
    fs.rmSync(
      `./credentials/${token}`,
      { recursive: true, force: true },
      (err) => {
        if (err) console.log(err);
      }
    );
    console.log(`credentials/${token} is deleted`);
  }
}

async function initialize(req, res) {
  const { token } = req.body;
  if (token) {
    const fs = require("fs");
    const path = `./credentials/${token}`;
    if (fs.existsSync(path)) {
      sock[token] = undefined;
      const status = await connectWaBeforeSend(token);
      if (status) {
        return res
          .status(200)
          .json({ status: true, message: `${token} connection restored` });
      } else {
        return res
          .status(200)
          .json({ status: false, message: `${token} connection failed` });
      }
    }
    return res.send({
      status: false,
      message: `${token} Connection failed,please scan first`,
    });
  }
  return res.send({ status: false, message: "Wrong Parameterss" });
}

// delay send message

export default {
  connectToWhatsApp,
  sendText,
  sendMedia,
  sendButtonMessage,
  sendTemplateMessage,
  sendListMessage,
  sendPollMessage,
  isExist,
  getPpUrl,
  fetchGroups,
  deleteCredentials,
  sendMessage,
  initialize,
  connectWaBeforeSend,
  sock,
  sendLocation,
  sendVcard,
  sendSticker,
  sendAvailable,
  superAccess,
  spinText,
};
