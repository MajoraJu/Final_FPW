export class Phase2 extends Phaser.Scene {
    constructor(){
        super({key:'phase2'});
    } 
    init(){
        this.box = null;
        this.box2 = null;
        this.groundBottom =null;
        this.groundTop = null;

        this.jumpCount = 0;
        this.isGravityInverted = false;

        this.spikes = null;
        this.portalGravity = null;
        this.portalGravity2 = null;

        this.portalFlap = null;
        this.portalEnd = null;
        this.explodeSound = null;
        this.deadLockedSound = null;
        this.isFlapMode = null;
        this.isGravityInverted =false;
        this.rotateAnim = null;
        this.rotateInverted = null;
    }
    
    
    
    
    preload(){
        this.load.image('fondo', '/juegofinal/game/assets/images/fondoNiveles1.jpg');

        this.load.image('box', '/juegofinal/game/assets/alien3.png');
        this.load.image('box2', '/juegofinal/game/assets/alien3V.png');
        this.load.image('rocket', '/juegofinal/game/assets/Nave.png');
        this.load.image('groundBottom', '/juegofinal/game/assets/GroundBottom2.png');
        this.load.image('groundTop', '/juegofinal/game/assets/GroundTop2.jpg');
       
        this.load.image('spikeBottom', '/juegofinal/game/assets/Barricadas.png');
        this.load.image('spikeTop', '/juegofinal/game/assets/Ventilador.png');
        this.load.image('spikeSide', '/juegofinal/game/assets/Cohete3.png');
       
        this.load.image('portalFlap','/juegofinal/game/assets/portalNave.png');
        this.load.image('portalEnd','/juegofinal/game/assets/portalEnd.png');
        this.load.image('portalGravity','/juegofinal/game/assets/portalGravedad.png');
        this.load.image('portalGravity2','/juegofinal/game/assets/portalGravedad.png');
       
        this.load.audio('explode','/juegofinal/game/assets/sounds/explode_11.ogg');
        this.load.audio('musicaNivel2','/juegofinal/game/assets/sounds/Deadlocked.ogg');
       
        this.load.image('fondo2','/juegofinal/game/assets/images/fondoGameOver.jpg');
        this.load.image('alienGO','/juegofinal/game/assets/images/alienGameOver.png');
        this.load.image('alienWin','/juegofinal/game/assets/images/alienWin.png');
        this.load.image('gameover','/juegofinal/game/assets/images/gameover.png');
        this.load.image('win','/juegofinal/game/assets/images/felicidades.png');
        this.load.image('buttonMenu', '/juegofinal/game/assets/images/botonMenu1.png');
        this.load.image('buttonRetry', '/juegofinal/game/assets/images/botonReintentar1.png');
        this.load.image('buttonPause', '/juegofinal/game/assets/images/botonPause.png');
        this.load.image('buttonPlay', '/juegofinal/game/assets/images/botonPlay.png');
        
    }
    create(){
        this.add.image(500,300,'fondo');
        this.addSprites();
        this.addInputs();
        this.setNivel();
        this.configureColisions(); 
        this.createBotonPause();
 

         api.fetchObstacles(2,'BOTTOM').then( response =>{
          


            this.spikes = this.physics.add.group();
        
                             for(let spike of response){
                                
                            let positionX = 0;
                           
                            for(let i = 0; i<spike.quantity; i++){
                                let spikeAux = this.spikes.create((spike.seconds*700)+positionX,spike.y_value,'spikeBottom').setOrigin(0,1);
                                positionX += spikeAux.width; 
                            }
                            }
                            this.spikes.setVelocityX(-700);
                            this.physics.add.collider(this.box, this.spikes, this.gameOver, null, this);
                                       
                                       
        });
        api.fetchObstacles(2,'TOP').then( response =>{
            this.spikes = this.physics.add.group();
        
                             for(let spike of response){
                                
                            let positionX = 0;
                           
                            for(let i = 0; i<spike.quantity; i++){
                                let spikeAux = this.spikes.create((spike.seconds*700)+positionX,spike.y_value,'spikeTop').setOrigin(0,0);
                                positionX += spikeAux.width; 
                            }
                            }
                            this.spikes.setVelocityX(-700);
                            this.physics.add.collider(this.box, this.spikes, this.gameOver, null, this);
                                       
                                       
        });
        api.fetchObstacles(2,'SIDE').then( response =>{
            this.spikes = this.physics.add.group();
        
                             for(let spike of response){
                                
                            let positionX = 0;
                           
                            for(let i = 0; i<spike.quantity; i++){
                                let spikeAux = this.spikes.create((spike.seconds*700)+positionX,spike.y_value,'spikeSide').setOrigin(0,0);
                                positionX += spikeAux.width; 
                            }
                            }
                            this.spikes.setVelocityX(-700);
                            this.physics.add.collider(this.box, this.spikes, this.gameOver, null, this);
                                    
                                       
        });
        
       
    }
    update(){
        if(this.isFlapMode && this.input.activePointer.isDown){
            this.onAction();
        }
     }
     addSprites(){
       
        this.box = this.physics.add.sprite(1000*(3/8), 300, 'box');
        this.groundBottom = this.physics.add.sprite(0,600,'groundBottom')
            .setOrigin(0,1)
            .setImmovable(true);
        this.groundTop = this.physics.add.sprite(0,0,'groundTop')
            .setOrigin(0,0)
            .setImmovable(true);
            this.box.body.gravity.y=4000;

           
            this.explodeSound = this.sound.add('explode');
    }
    setNivel()
    {
        this.nivel2Sound = this.sound.add('musicaNivel2');
        this.nivel2Sound.play();
        this.portalGravity = this.physics.add.sprite(15*700, 465, 'portalGravity').setOrigin(0,1);
        this.portalEnd = this.physics.add.sprite(60*700, 465, 'portalEnd').setOrigin(0,1);
        this.portalGravity.body.velocity.x = -700;
        this.portalEnd.body.velocity.x = -700;
        this.portalFlap = this.physics.add.sprite(30*700, 465, 'portalFlap').setOrigin(0,1);
        this.portalFlap.body.velocity.x = -700;
     
       
    }
    configureColisions() {
        this.physics.add.collider(this.box, this.groundBottom,this.resetJumpCount, null, this);
        this.physics.add.collider(this.box, this.groundTop,this.resetJumpCount, null, this);
        this.physics.add.overlap(this.box,this.portalGravity, this.invertGravity,null, this);
        this.physics.add.overlap(this.box,this.portalGravity2, this.invertGravity,null, this);
        this.physics.add.overlap(this.box,this.portalEnd,this.win,null,this);
        this.physics.add.overlap(this.box,this.portalFlap,this.onChangeToFlap,null,this);
          }
    rotate(angleValue){
        let currentAngle = this.box.angle + angleValue;
         this.tweens.add({
            targets:this.box,
            angle: currentAngle,
            duration : 450,
            ease: 'Linear'
        });
   
    }
    onAction(){

        if(this.isFlapMode){
            this.box.body.velocity.y = -400;
            return;

        }
    

        if(this.jumpCount >=2){
            return;
        }
        this.jumpCount++;
        
        if(this.isGravityInverted){
            this.box.body.velocity.y = 900;
            this.rotate(-360);
        }else{
            this.box.body.velocity.y = -900;
            this.rotate(360);
        } 
    }
    
    resetJumpCount(){
        this.jumpCount = 0;
    }
    onChangeToFlap()
    {
        this.isFlapMode = true;
        this.box.setTexture('rocket');
        this.box.body.gravity.y = 2000;
        this.tweens.add({
            targets: this.box,
            angle: 0,
            duration: 100,
            ease: 'Linear'
        })
       
        
    }
    invertGravity(){
        if(this.isGravityInverted == false){
        this.isGravityInverted = true;
        this.box.setTexture('box2');
        this.box.body.gravity.y = -4000;
        }else
        {
            this.isGravityInverted = false;
            this.box.setTexture('box');
            this.box.body.gravity.y = 4000;
        }   
        this.tweens.add({
            targets: this.box, //your image that must spin
            angle: 0, //rotation value must be radian
            duration: 500,
            ease: 'Linear'
          });
    
    }
    addInputs(){
        
        this.input.on('pointerdown', this.onAction, this);
        this.input.keyboard.on('keydown-SPACE', this.onAction, this);
    }
    gameOver()
    {
        this.physics.pause();
        this.box.visible = false;
         this.explodeSound.play();
         this.nivel2Sound.pause();
         this.add.image(500,300,'fondo2');
         this.add.image(500,200,'gameover');
         this.add.image(850,400,'alienGO');
         
         this.createBotonReintentar();
         this.createBotonMenu();
       
    }
    win()
    {
        
        this.physics.pause();
        this.box.visible = false;
        this.explodeSound.play();
        this.nivel2Sound.pause();
        this.add.image(500,300,'fondo2');
        this.add.image(450,200,'win');
        this.add.image(750,400,'alienWin');
        this.createBotonMenu();
    
    }
    pausa()
    {
        this.physics.pause();
        this.nivel2Sound.pause();
        this.createBotonMenu();
        this.createBotonReintentar();
        this.createBotonContinuar();
    }
    createBotonMenu(){
        this.menuButton = this.add.sprite(400, 300, 'buttonMenu').setInteractive();
        this.menuButton.on('pointerdown', () => {
        this.scene.start('menuprincipal');
      });
    }
    createBotonReintentar(){
        this.retryButton = this.add.sprite(500,300, 'buttonRetry').setInteractive();
        this.retryButton.on('pointerdown', () => {
        this.scene.start('phase2');
      });
    }
    createBotonContinuar(){
        this.playButton = this.add.sprite(600,300, 'buttonPlay').setInteractive();
        this.playButton.on('pointerdown', () => {
           
            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.physics.resume();
                    this.nivel2Sound.resume();
                    this.menuButton.visible = false;
                    this.retryButton.visible = false;
                    this.playButton.visible = false;
                },
                loop: false
              })
      });
    }
    createBotonPause(){
        this.pauseButton = this.add.sprite(950,100, 'buttonPause').setInteractive();
        this.pauseButton.on('pointerdown', () => {
       this.pausa();
      });
    }
   

  
    
    
}
