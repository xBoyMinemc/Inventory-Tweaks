import { world } from "@minecraft/server";


function xbLang(){
    let msg = world.getDimension("overworld").runCommand("list").statusMessage;
    if(msg.indexOf("在线")) return "zh_CN";
    if(msg.indexOf("在線上")) return "zh_TW";
    if(msg.indexOf("online")) return "en_GB";
    return "en_US";
}

export {xbLang};