import { world } from "@minecraft/server";
// import { xbLang } from "../xpackage/lang-test.js";
//https://github.com/xBoyMinemc/Inventory-Tweaks/blob/main/scripts/lib/xboyTools/r.js


const xboyList = {
    " c": "amount",
    " count": "amount",
    " a": "amount",
    " amount": "amount",
    // " d": "data",
    // " data": "data",
    " n": "nameTag",
    " name": "nameTag",
    " nametag": "nameTag",
    " n": "typeId",
    " name": "typeId",
    " nametag": "typeId",
    // " d": "data",
    // " durability": "data"
}

const color = {
    valueOf : ()=>Math.floor(Math.random() * 9) + 1
};

const xInventoryTweaks = function (msg) {
    
    let { message, sender } = msg

    let inv = sender

    let mm = message.toLowerCase();

    if (!(mm.startsWith("r") || mm.startsWith("c"))) return;
    let mmm = mm.slice(1);
    if (!(mmm == "" || mmm.startsWith(" "))) return;
    msg.cancel = true;
    let a = 1
    let z = -1
    if (message.startsWith('r')) { a = 1; z = -1; inv = sender; }
    if (message.startsWith('R')) { a = -1; z = 1; inv = sender; }
    if (message.startsWith('c')) { a = 1; z = -1; inv = sender.getBlockFromViewDirection().block; }
    if (message.startsWith('C')) { a = -1; z = 1; inv = sender.getBlockFromViewDirection().block; }

    let xboy = "xboy"

    if(!inv.getComponent("minecraft:inventory")?.container){
        inv = sender.getEntitiesFromViewDirection({maxDistance:8})?.[0]?.entity;
        if(!sender.hasTag("op") && inv.typeId === "minecraft:player")
        return sender.sendMessage(Math.random()>0.95 ? "# 带有": "# 你没对准容器方块或实体" )
    }


    if (mmm == "" ) { xboy = "typeId" } else {
        xboy = xboyList[mmm]
    }

    if (mmm == " help" || mmm == " h") {
        let CMD = "cmd"    ; let By = "By"
        sender.sendMessage(`|_____§r§l§更新# OP更新：可以使用c整理面向的生物的背包，带有op这个tag的玩家可以整理玩家的背包 `)

        if (true)   {    
            CMD = "命令示例";     By = "分类依据"}
            Object.keys(xboyList).forEach((key) => {
                sender.sendMessage(`|_____§r§l§${+color}#${CMD}：${mm.slice(0, 1) + key} # ${By}：${xboyList[key]} `)
                // msg.sender.runCommand(`tellraw @s {"rawtext":[{"text":"|_____§r§l§${color}#${CMD}：${mm.slice(0, 1) + key} # ${By}：${xboyList[key]} "}]}`)
        })
        return;
    }
    if (xboy == "xboy") return;   //if err then stop



    let items = []
    const size = inv.getComponent("minecraft:inventory").container.size
    const air = undefined;//new ItemStack(MinecraftItemTypes.deny,33)
    for (let i = 0; i < size; i++) {
        let item = inv.getComponent("minecraft:inventory").container.getItem(i)
        if (!item) { /*items.push(air);*/ continue; }
        //
        items.push(item)
    }

    while(items.length<size)
        items.push(undefined);

    let xboySort = function () {
        let l = 0;
        items
        =items
        .reduce((acc,v)=>(v?acc.push(v):0,acc),[])  //item!=null
        .sort((x, y) => x[xboy] > y[xboy] ? a : z); //sort
        
        while(items.length<size)
            items.push(undefined);

        for (let i = 1; i < size; i++) {
            let itemx = items[i - 1]
            let itemy = items[i]
            if(!itemx || !itemy)continue;

            if (itemx.amount >= itemx.maxAmount || itemy.amount >= itemy.maxAmount || itemx.amount == 0 || itemy.amount == 0 || itemx.typeId == "" || itemy.typeId == "") { continue; }
            // if (!(itemx.data == itemy.data && itemx.typeId == itemy.typeId)) { continue; }
            if(!itemx.isStackableWith(itemy))continue;
            // if (itemx.amount + itemy.amount >= 128) continue;
            if (itemx.amount + itemy.amount <= itemx.maxAmount) {
                l++;
                // console.error(items[i].typeId)
                items[i].amount = itemx.amount + itemy.amount;
                items[i - 1] = air;
            
                continue;
            };
          //if (itemx.amount + itemy.amount <= 2*itemx.maxAmount)   and   (itemx.amount + itemy.amount >= 1*itemx.maxAmount)
          //then
            l++;
            items[i - 1].amount = itemx.amount + itemy.amount - 64;
            items[i].amount = 64;
        }
        if (l == 0 || l >32) { return; }
        xboySort()
    }

    xboySort()
    let diff = 0;

    items.sort((x, y) => newSort(x[xboy] , y[xboy],sender) ?a:z)
        .forEach((item, i) => {
            if(mm.startsWith("r"))
                inv.getComponent("inventory").container.setItem(i>=(size-9)?i-(size-9):i+9, item) // 9==> hotSlotCount
            else
                inv.getComponent("inventory").container.setItem(i, item)
            if(!item)diff++;
        })

}

const newSort =(x,y,sender)=>{
    // sender.runCommand("me "+x+">"+y+"===>"+(x>y))
    if(typeof x === typeof y && typeof x === "string" && x.length !== y.length){
        let poi = 0;
        while(x[poi] == y[poi])
            poi++;
        y=y.slice(poi);
        x=x.slice(poi);
        /*
        掐头
        */
        while(x.length > y.length)
            y=" "+y
        while(x.length < y.length)
            x=" "+x
        /*
        补中
        */
        
        while(x[x.length-1] == y[y.length-1])
        {
            x=x.slice(0,x.length-1)
            y=y.slice(0,y.length-1)
        /*
        去尾
        */
        }

        if(!isNaN(Number(x))&&!isNaN(Number(y)))
        {
            x=Number(x)
            y=Number(y)
        }

        return x > y;
    }
    return x > y;
}

;world
.afterEvents
.chatSend
.subscribe(msg => {
    xInventoryTweaks(msg)
})


// //@core


// {
//     ///inv : entity or chest and so on
//     let items = []
//     let air = new ItemStack(MinecraftItemTypes.air, 0, 0)
//     for (let i = 0; i < size; i++) {    //get inventory item
//         let item = inv.getComponent("inventory").container.getItem(i)
//         if (!item) { items.push(air); continue; }
//         //
//         items.push(item)
//     }

//     items.sort((x, y) => x.typeId > y.typeId ? 1 : -1)
//     .forEach((item, i) => {
//         inv.getComponent("inventory").container.setItem(i, item)
//     })
// }





//code shit
//code work
