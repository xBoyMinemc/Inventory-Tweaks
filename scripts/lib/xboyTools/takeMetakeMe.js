import { GameMode, system, world } from "@minecraft/server";
//https://github.com/xBoyMinemc/Inventory-Tweaks/blob/main/scripts/lib/xboyTools/r.js



// world.beforeEvents.itemUse.subscribe(({source:xboy})=>{
    
//     xboy.sendMessage("布腻布腻=>itemUse")
// })


// world.afterEvents.itemStartUse.subscribe(({source:xboy})=>{
    
//     xboy.sendMessage("布腻布腻=>itemStartUse")
// })
// world.afterEvents.itemStartUseOn.subscribe(({source:xboy})=>{
    
//     xboy.sendMessage("布腻布腻=>itemStartUseOn")
// })


// world.afterEvents.itemUseOn.subscribe(({source:xboy})=>{
    
//     xboy.sendMessage("布腻布腻=>itemUseOn")
// })

// world.afterEvents.itemUse.subscribe(({source:xboy})=>{
    
//     xboy.sendMessage("布腻布腻=>itemUse")
// })

// world.afterEvents.itemCompleteUse.subscribe(({source:xboy})=>{
    
//     xboy.sendMessage("布腻布腻=>itemCompleteUse")
// })

// world.afterEvents.itemReleaseUse.subscribe(({source:xboy})=>{
    
//     xboy.sendMessage("布腻布腻=>itemReleaseUse")
// })


// ;world
// .beforeEvents
// .itemUseOn
// .subscribe(({source:xboy,itemStack}) => {

//     if(!itemStack)
//         xboy.sendMessage("itemStopUseOn=> 没了#")
//     else
//         xboy.sendMessage("itemUseOn=> selectedSlot=> " + xboy.selectedSlot + " amount==> " +itemStack.amount)

//         // const s = xboy.getComponent("minecraft:inventory").container;
        
//         // let i = s.size;
        
//         // xboy.sendMessage("#amount "+itemStack?.amount)
//         // if(!itemStack)
//         //     system.run(()=>{
//         //         while(i--){
//         //             const _item = s.getItem(i)
//         //             if(!_item)continue
                    
//         //             if(_item.isStackableWith(itemStack)){
//         //                 s.swapItems(i,xboy.selectedSlot,s), s.setItem(i, null)
//         //                 break
//         //             }
//         //             xboy.sendMessage("#捏")
//         //             "捏"
//         //         }})




//     // 方块放置
//     // typeId
//     // xboy.sendMessage("itemStopUseOn=> #")
//     // xboy.getComponent("inventory").container.getItem(xboy.selectedSlot)
//     // xboy.sendMessage("itemUseOn=> amount "+item.amount)
// })


// // /give @s wooden_axe 3 64
// ;world
// .afterEvents
// .itemStopUse
// .subscribe(({source:xboy,itemStack:item}) => {
//     xboy.sendMessage("itemStopUse=>")
//     // typeId
//     xboy.sendMessage("itemUse=>selectedSlot=>"+xboy.selectedSlot+" amount==>"+xboy.getComponent("inventory").container.getItem(xboy.selectedSlot).amount)
//     xboy.sendMessage("itemUse=>amount"+item.amount)

// })




// 尝试实现方块放置的替换

// ;world
// .afterEvents
// .playerPlaceBlock
// .subscribe(({player:xboy,block:block,}) => {
//     // typeId

//     if(xboy.getComponent("inventory").container.getItem(xboy.selectedSlot).amount===1)

//     xboy.sendMessage("afterEvents =>blockPlace=>selectedSlot=>"+xboy.selectedSlot+" amount==>"+xboy.getComponent("inventory").container.getItem(xboy.selectedSlot).amount)

// })




// ######################################################################################################################################

// 处理放置方块引起的需要替补物品的场景


// {
//     'tick-01':{
//         'player-01':ItemStack,
//         'player-02':ItemStack,
//         'player-03':ItemStack,
//     }, // padding removed
//     'tick-02':{
//         'player-01':ItemStack,
//         'player-02':ItemStack,
//         'player-03':ItemStack,
//     }
// }
const playerPlaceBlockMap = new Map();
const playerSurvivalList = new Set();
system.runInterval(()=>{
    playerPlaceBlockMap.forEach((v,k,m)=>k<(system.currentTick-1)?m.delete(k):0)
    playerPlaceBlockMap.has(system.currentTick)?0:playerPlaceBlockMap.set(system.currentTick,new Map())
    playerPlaceBlockMap.has(system.currentTick+1)?0:playerPlaceBlockMap.set(system.currentTick+1,new Map())
})


world.beforeEvents.playerPlaceBlock.subscribe(({player,itemStack})=>{

    // player in Survival,List
    playerSurvivalList.clear()
    world.getPlayers({gameMode:GameMode.survival}).forEach(player=>playerSurvivalList.add(player.id))


    // player.sendMessage("beforeEvents system.currentTick "+system.currentTick)
    playerPlaceBlockMap.get(system.currentTick).set(player.id,itemStack)
})


;world
.afterEvents
.playerPlaceBlock
.subscribe(({player,block:block}) => {
    if(!playerSurvivalList.has(player.id))return
    // player.sendMessage("afterEvents system.currentTick "+system.currentTick)

    const s = player.getComponent("minecraft:inventory").container;
    // const item = player.getComponent("inventory").container.getItem(player.selectedSlot);
    let i = s.size;
    const itemStack = playerPlaceBlockMap.get(system.currentTick).get(player.id);
    // player.sendMessage("#amount "+itemStack?.amount)
    if(itemStack.amount === 1)
        system.run(()=>{
            while(i--){
                const _item = s.getItem(i)
                if(!_item)continue
                // player.sendMessage("#1")
                // player.sendMessage("#2 withOutData "+block.getItemStack().typeId)
                // withOutData
                if(_item.isStackableWith(itemStack)){
                    // player.sendMessage("#2")
                    s.swapItems(i,player.selectedSlot,s), s.setItem(i, null)
                    break
                }
                // player.sendMessage("#捏")
                "捏"
            }})

    // typeId
    // if(player.getComponent("inventory").container.getItem(player.selectedSlot).amount===1)
    //     player.sendMessage("方块要用完了")
    // if(player.getComponent("inventory").container.getItem(player.selectedSlot).amount===1)
    // player.sendMessage("beforeEvents =>blockPlace=>selectedSlot=>"+player.selectedSlot+" amount==>"+player.getComponent("inventory").container.getItem(player.selectedSlot).amount)

})
// ######################################################################################################################################

// 处理使用工具挖掘导致工具损坏的场景
;world
.afterEvents
.playerBreakBlock
.subscribe(({player,block,itemStackBeforeBreak,itemStackAfterBreak}) => {
    if(!playerSurvivalList.has(player.id))return

    // 挖爆了
    if(!itemStackAfterBreak && itemStackBeforeBreak){
        
        const s = player.getComponent("minecraft:inventory").container;
        let i = s.size;
        
            system.run(()=>{
                while(i--){
                    const _item = s.getItem(i)
                    if(!_item)continue
                    if(_item.typeId === itemStackBeforeBreak.typeId){
                        s.swapItems(i,player.selectedSlot,s), s.setItem(i, null)
                        break
                    }
                    // player.sendMessage("break")
                    "捏"
                }})
    }


    // typeId
    // player.sendMessage("blockBreak=>selectedSlot=>"+player.selectedSlot+" amount==>"+player.getComponent("inventory").container.getItem(player.selectedSlot).amount)
    // player.sendMessage("blockBreak=>itemStackAfterBreak  "+itemStackAfterBreak?.typeId)
    // player.sendMessage("blockBreak=>itemStackBeforeBreak  "+itemStackBeforeBreak?.typeId)

})

// 仅限于两种情况，并且可能有bug
// 放置方块导致的物品需要替补，挖掘导致的工具损毁
// 会替换一样的方块或工具，未来可能支持替换同类工具，以及保留最后一点耐久
// world.sendMessage("自动替换开发中")