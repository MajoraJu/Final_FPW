class MainScene extends Phaser.Scene {

     constructor() {
          super("MainScene")
     }

     init() {
          //Objetos
          this.box = null;
          this.groundBottom = null;
          this.groundTop = null;
          this.portalFlap = null;
          this.portalFlap1 = null;
          //Grupo de espinas
          this.spikes = null;
          // Parametros para el método onAction
          this.jumpCount = 0;
          //Rotación del cubo al saltar
          this.rotateAnim = null;
          this.rotateAnimGI = null;
          // Sonidos y música
          this.explodeSound = null;
          this.music = null;
          // Boolean para saber si es una nave
          this.isFlapMode = false;
          

     }

     preload() {
          //Carga de imaganes
          this.load.image('box', '../assets/box.png');
          this.load.image('ground', '../assets/groundBottom.png');
          this.load.image('top', '../assets/groundTop.png')
          this.load.image('spikeBottom', '../assets/spikeBottom.png');
          this.load.image('spikeTop', '../assets/spikeTop.png');
          this.load.image('portalFlap', '../assets/portalFlap.png');
          this.load.image('rocket', '../assets/rocket.png');
          this.load.image('spikeSide', '../assets/spikeSide.png');
          //Carga de sonidos
          this.load.audio('explode', '../assets/sounds/explotion.ogg');
          this.load.audio('music', '../assets/sounds/launchbaseact2.ogg');

     }

     create() {
          // Crear caja
          this.box = this.physics.add.sprite(1000 * (2 / 8), 300, 'box');
          this.physics.add.sprite(0, 600, 'ground');
          this.groundBottom = this.physics.add.image(0, 600, 'ground')
               .setOrigin(0, 1)
               .setImmovable(true);
          this.groundTop = this.physics.add.image(0, 0, 'top')
               .setOrigin(0, 0)
               .setImmovable(true);
          this.box.body.gravity.y = 4000; // Agrega gravedad al objeto caja.
          // Colisiones entre caja/groundBottom y groundTop
          this.physics.add.collider(this.box, this.groundBottom, this.resetJumpCount, null, this);
          this.physics.add.collider(this.box, this.groundTop, this.resetJumpCount, null, this);
          // Input pointer down (click) llama al método onAction().
          this.input.on('pointerdown', this.onAction, this);
          this.input.keyboard.on('keydown-SPACE', this.onAction, this);
          //this.input.keyboard.on('keydown-I', this.invertGravity, this);
          //------------ Spikes ----------//
          // Crea objetos spikeBottom recorre con el for
          this.spikes = this.physics.add.group();
          for (let spike of spikeBottomList) {
               let positionX = 0; // Poner un pico al lado del otro
               for (let i = 0; i < spike.quantity; i++) {
                    // 700 es la velocidad
                    let spikeAux = this.spikes.create((spike.seconds * 700) + positionX, spike.y, 'spikeBottom').setOrigin(0, 1);
                    positionX += spikeAux.width;
               }
          }
          // Recorrido en los spikeTop
          for (let spike of spikeTopList) {
               let positionX = 0; // Poner un pico al lado del otro
               for (let i = 0; i < spike.quantity; i++) {
                    // 700 es la velocidad
                    let spikeAux = this.spikes.create((spike.seconds * 700) + positionX, spike.y, 'spikeTop').setOrigin(0);
                    positionX += spikeAux.width;
               }
          }
          // Recorrido en la spikeSideList
          for (let spike of spikeSideList) {
               let positionX = 0;
               for (let i = 0; i < spike.quantity; i++) {
                    let spikeAux = this.spikes.create((spike.seconds * 700) + positionX, spike.y, 'spikeSide').setOrigin(0);
                    positionX += spikeAux.width;
               }
          }
          this.spikes.setVelocityX(-700);
          // Colisión con las spikes
          this.physics.add.collider(this.box, this.spikes, this.gameOver, null, this);

          // Crear portal para transformar en cohete.
          this.portalFlap = this.physics.add.sprite(10 * 700, 465, 'portalFlap').setOrigin(0, 1);
          this.portalFlap.body.velocity.x = -700;
          this.physics.add.overlap(this.box, this.portalFlap, this.onChangeToShip, null, this);
          // Crear portal para transformar en box.
          this.portalFlap1 = this.physics.add.sprite(20 * 700, 465, 'portalFlap').setOrigin(0, 1);
          this.portalFlap1.body.velocity.x = -700;
          this.physics.add.overlap(this.box, this.portalFlap1, this.onChangeToBox, null, this);
          // Para que música aplique de fondo hay que iniciar el play() aqui.
          this.music = this.sound.add('music');
          this.music.play();
          // Iniciar sonido
          this.explodeSound = this.sound.add('explode');
     }

     update() {
          if (this.isFlapMode && this.input.activePointer.isDown) {
               this.onAction;
          }
     }

     onAction() {
          if (this.isFlapMode) {
               this.box.body.velocity.y = -450;
               return;
          }

          if (this.jumpCount >= 2) {
               return;
          }
          this.jumpCount++;
          if (this.isGravityInverted) {
               this.box.body.velocity.y = 900;
               this.rotateGI(-270);
          }
          else {
               this.box.body.velocity.y = -900;
               this.rotate(270);
          }
     }

     rotate(angleValue) {
          if (!this.rotateAnim) {
               this.rotateAnim = this.tweens.add({
                    targets: this.box, //imagen que va a girar
                    angle: angleValue, //rotacion en radianes
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
          this.music.stop();
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

     onChangeToBox() {
          this.isFlapMode = false;
          this.box.body.gravity.y = 4000;
          this.box.setTexture('box'); // Cambia textura de caja a rocket.


          this.tweens.add({
               targets: this.box,
               angle: 360,
               duration: 100,
               ease: 'Linear'
          });
     }



     onChangeToShip() {

          this.isFlapMode = true;
          this.box.body.gravity.y = 2000;
          this.box.setTexture('rocket'); // Cambia textura de caja a rocket.


          this.tweens.add({
               targets: this.box,
               angle: 360,
               duration: 100,
               ease: 'Linear'
          });
     }
}


//Configuración del juego
const config = {
     type: Phaser.AUTO,
     parent: 'game',
     width: 1000,
     height: 600,
     backgroundColor: '#72A276',
     physics: {
          default: 'arcade',
     },
     scene: MainScene
}

new Phaser.Game(config);