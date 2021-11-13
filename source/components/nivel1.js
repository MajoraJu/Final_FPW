class nivel1 extends Phaser.Scene {
     constructor() {
          super("nivel1")
     }

     init() {
          //Objetos
          this.box = null;
          this.groundBottom = null;
          this.groundTop = null;
          this.portalGravity= null;
          //Grupo de barricadas
          this.spikes = null;
          //Párametros para el método onAction (Saltar, flappy)
          this.jumpCount = 0;
          this.isGravityInverted = false;
          //Inclinación bochito al saltar.
          this.rotateAnim = null;
          //Sonidos y música
          this.explodeSound = null;
          this.music = null;
          //Boolean para saber si es una nave
          this.isFlapMode = false;
     }
     // Zona carga de assets.
     preload() {
          this.load.image('box', '../resources/sprites/Auto.png');
          this.load.image('ground', '../resources/sprites/groundBottom.png');
          this.load.image('top', '../resources/sprites/groundTop.png');
          this.load.image('spikeBottom', '../resources/sprites/Barricadas.png');
          this.load.image('spikeTop', '../resources/sprites/Ventilador.png');
          this.load.image('spikeSide', '../resources/sprites/Cohete 1.png');
          this.load.image('portalGravity', '../assets/portalGravity.png');
          this.load.image('portalGravity2', '../assets/portalGravity.png');
     }

     create() {
          //Crear bochito
          this.box = this.physics.add.sprite(1000*(2/8), 300, 'box');
          this.physics.add.sprite(0,600,'ground');
          //Fisicas del suelo
          this.groundBottom = this.physics.add.image(0,600,'ground')
               .setOrigin(0,1)
               .setImmovable(true);
          //Fisicas del techo
          this.groundTop = this.physics.add.image(0,0, 'top')
               .setOrigin(0,0)
               .setImmovable(true);
          this.bocho.body.gravity.y = 4000; // Gravedad del bochito.
          // Colisiones entre bochito, suelo y techo.
          this.physics.add.collider(this.box, this.groundBottom, this.resetJumpCount, null, this);
          this.physics.add.collider(this.box, this.groundTop, this.resetJumpCount, null, this);
          //Input pointerdown (Click primario) y el espacio del teclado, llaman al método onAction()
          this.input.on('pointerdown', this.onAction, this);
          this.input.keyboad.on('keydown-SPACE', this.onAction, this);
          //Para probar gravedad.
          //this.input.keyboard.on('keydown-I', this.invertGravity, this);
          //---------SPIKES || BARRICADAS---------//
          //Crea objetos spikeBottom(Barricadas), recorre con un for.
          this.spikes = this.physics.add.group();
          for (let spike of spikeBottomList) {
               let positionX = 0; // Poner una barricada al lado de la otra.
               for (let i = 0; i < spike.quantity; i++) {
                    //700 es la velocidad.
                    let spikeAux=this.spikes.create((spike.seconds * 700) + positionX, spike.y, 'spikeBottom').setOrigin(0,1);
                    positionX += spikeAux.width;
               }
          }
          // Recorrido en los spikeTop (Ventiladores)
          for (let spike of spikeTopList) {
               let positionX = 0; //Poner un pico al lado del otro
               for (let i=0; i<spike.quantity;i++) {
                    //700 es la velocidad a la que se van a mover los ventiladores.
                    let spikeAux = this.spikes.create((spike.seconds * 700) + positionX, spike.y, 'spikeTop').setOrigin(0);
                    positionX += spikeAux.width;
               }
          }
          // Recorrido en la spikeSidde (Misiles)
          for (let spike of spikeSideList) {
               let positionX = 0;
               for(let i = 0; i<spike.quantity; i++) {
                    //700 es la velocidad de los misiles
                    let spikeAux = this.spikes.create((spike.seconds * 700) + positionX, spike.y, 'spikeSide').setOrigin(0);
                    positionX += spikeAux.width;
               }
          }
          this.spikes.setVelocityX(-700);
          //Colisión con las barricadas, ventiladores y misiles.
          this.physics.add.collider(this.box, this.spikes, this.gameOver, null, this);

          //Creación de portales invertir gravedad.
          this.portalGravity = this.physics.add.sprite(10 * 700, 465, 'portalGravity').setOrigin(0,1);
          this.portalGravity.body.velocity.x = -700;
          this.physics.add.overlap(this.box, this.portalGravity, this.inverGravity, null, this);
          this.portalGravity2 = this.physics.add.sprite(20*700, 465, 'portalGravity').setOrigin(0,1);
          this.portalGravity2.body.velocity.x = -700;
          this.physics.add.overlap(this.box, this.portalGravity2, this.inverGravity,null, this);
     } // Termina corchete del método create -- Linea 35

     update() {
          if(this.isFlapMode && this.input.activePointer.isDown) {
               this.onAction;
          }
     }

     onAction(){
          if(this.isFlapMode) {
               this.box.body.velocity.y = -450;
               return;
          }

          if(this.jumpCount >=2) {
               return;
          }
          this.jumpCount++;

          if(this.isGravityInverted) {
               this.box.body.velocity.y = 900;
               this.rotateGI(-270);
          } else {
               this.box.body.velocity.y = -900;
               this.rotateAnim(270);
          }
     } // Termina corchete onAction

     rotateA(angleValue) {
          if(!this.rotateAnim) {
               this.rotateAnim = this.tweens.add({
                    targets: this.box, //Que va a girar
                    angle: angleValue, //rotación en radianes
                    duration: 400,
                    ease: 'Linear'
               });
          } else {
               this.rotateAnim.play();
          }
     }

     rotateGI(angleValue) {
          if (!this.rotateAnimGI) {
               this.rotateAnimGI = this.tweens.add({
                    targets: this.box, //imagen que va a girar
                    angle: angleValue, //rotacion en radianes
                    duration: 400,
                    ease: 'Linear'
               });
          } else {
               this.rotateAnimGI.play();
          }
     }

     invertGravity() {
          //this.isGravityInverted = true;

          if (this.isGravityInverted) {
               this.isGravityInverted = false
               this.box.body.gravity.y = 4000;
          }
          else {
               this.isGravityInverted = true
               this.box.body.gravity.y = -4000;
          }
     }

     resetJumpCount() {
          this.jumpCount = 0;
     }

     gameOver() {
          //this.music.stop();
          this.physics.pause();
          this.box.visible = false;
          this.explodeSound.play();
          // Con un segundo de retraso la escena se reinicia.
          this.time.addEvent({
               delay: 1000,
               callback: () => {
                    this.scene.restart();
               },
               loop: false
          })
     }

     onChangeToFlap() {
          this.isFlapMode = true;
          this.box.setTexture('rocket'); // Cambia textura de caja a rocket.
          this.box.body.gravity.y = 2000;

          this.tweens.add({
               targets: this.box,
               angle: 360,
               duration: 100,
               ease: 'Linear'
          });
     }

} // Termina corchete de class nivel1 extends phaser.scene ----- linea 1

const config = {
     type: Phaser.AUTO,
     parent: 'game',
     width: 1000,
     height: 600,
     backgroundColor: '#72A276',
     physics: {
          default: 'arcade',
     },
     scene: nivel1
}

new Phaser.Game(config);