import {Phase3} from '/juegofinal/game/components/phase3.js';
import {Phase2} from '/juegofinal/game/components/phase2.js';
import {Phase1} from '/juegofinal/game/components/phase1.js';
import {MenuPrincipal} from '/juegofinal/game/scenes/menuprincipal.js';
  
  const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1000,
    height: 600,
    scene: [MenuPrincipal,Phase1,Phase2,Phase3],
    //backgroundColor: "#03e3fc",
    physics: {
      default: 'arcade',
    
    },
    
  }
  
  new Phaser.Game(config);
  