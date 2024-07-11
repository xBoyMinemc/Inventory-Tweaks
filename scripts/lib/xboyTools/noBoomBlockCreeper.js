import { world } from "@minecraft/server";


world.beforeEvents.explosion.subscribe(event=>{
    if(!event.source)return
    if(event.source.typeId!=="minecraft:creeper")return;
    event.setImpactedBlocks([])
})