import { world } from "@minecraft/server";
//https://github.com/xBoyMinemc/Inventory-Tweaks/blob/main/scripts/lib/xboyTools/r.js

world.getDimension("overworld").runCommand("me rrrr")

;world
.afterEvents
.blockPlace
.subscribe(({player:xboy,block:block}) => {
    // typeId
    xboy.sendMessage("blockPlace=>selectedSlot=>"+xboy.selectedSlot+" amount==>"+xboy.getComponent("inventory").container.getItem(xboy.selectedSlot).amount)

})

;world
.afterEvents
.itemUseOn
.subscribe(({source:xboy,itemStack:item}) => {
    // typeId
    xboy.sendMessage("itemUseOn=>selectedSlot=>"+xboy.selectedSlot+" amount==>"+xboy.getComponent("inventory").container.getItem(xboy.selectedSlot).amount)
    xboy.sendMessage("itemUseOn=>amount"+item.amount)
})

;world
.afterEvents
.itemUse
.subscribe(({source:xboy,itemStack:item}) => {
    // typeId
    xboy.sendMessage("itemUse=>selectedSlot=>"+xboy.selectedSlot+" amount==>"+xboy.getComponent("inventory").container.getItem(xboy.selectedSlot).amount)
    xboy.sendMessage("itemUse=>amount"+item.amount)

})

;world
.afterEvents
.blockBreak
.subscribe(({player:xboy,block:block}) => {
    // typeId
    xboy.sendMessage("blockBreak=>selectedSlot=>"+xboy.selectedSlot+" amount==>"+xboy.getComponent("inventory").container.getItem(xboy.selectedSlot).amount)
    // xboy.sendMessage("blockBreak=>amount"+item.amount)

})

