export class MenuPrincipal extends Phaser.Scene {
    constructor(){
        super({key: 'menuprincipal'});
        
    }

    preload(){
        this.load.image('background','/juegofinal/game/assets/images/fondoMP.jpg');
        this.load.image('titulo','/juegofinal/game/assets/images/titulo.png');
        //this.load.image('textSelectNivel','/juegofinal/game/assets/images/textSelectNivel1.png');
        this.load.image('button1','/juegofinal/game/assets/images/boton1.0.png');
        this.load.image('button2','/juegofinal/game/assets/images/boton2.0.png');
        this.load.image('button3','/juegofinal/game/assets/images/boton3.0.png');
        
    }
    create(){
        this.add.image(500,300,'background');
        this.add.image(300,150,'titulo');
        this.Nivel1Button = this.add.sprite(300, 300, 'button1').setInteractive();
        this.Nivel1Button.on('pointerdown', () => {
            this.scene.start('phase1');
          });

          this.Nivel2Button = this.add.sprite(300, 400, 'button2').setInteractive();
          this.Nivel2Button.on('pointerdown', () => {
            this.scene.start('phase2');
          });

          this.Nivel3Button = this.add.sprite(300, 500, 'button3').setInteractive();
          this.Nivel3Button.on('pointerdown', () => {
            this.scene.start('phase3');
          });
       
       
        

    }
}