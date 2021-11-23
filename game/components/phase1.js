export class Phase1 extends Phaser.Scene {
    constructor(){
        super({key:'phase1'});
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
        
        //fondo que tendra el nivel
        this.load.image('fondo', '/juegofinal/game/assets/images/fondoNiveles1.jpg');
       //assets del pj, suelo y techo
        this.load.image('box', '/juegofinal/game/assets/alien3.png');
        this.load.image('box2', '/juegofinal/game/assets/alien3V.png');
        this.load.image('rocket', '/juegofinal/game/assets/Nave.png');
        this.load.image('groundBottom', '/juegofinal/game/assets/GroundBottom2.png');
        this.load.image('groundTop', '/juegofinal/game/assets/GroundTop2.jpg');
       //assets de los obstaculos
        this.load.image('spikeBottom', '/juegofinal/game/assets/Barricadas.png');
        this.load.image('spikeTop', '/juegofinal/game/assets/Ventilador.png');
        this.load.image('spikeSide', '/juegofinal/game/assets/Cohete3.png');
        //assets de los portales
        this.load.image('portalFlap','/juegofinal/game/assets/portalNave.png');
        this.load.image('portalEnd','/juegofinal/game/assets/portalEnd.png');
        this.load.image('portalGravity','/juegofinal/game/assets/portalGravedad.png');
        this.load.image('portalGravity2','/juegofinal/game/assets/portalGravedad.png');
        //sonido de muerte y musica de fondo
        this.load.audio('explode','/juegofinal/game/assets/sounds/explode_11.ogg');
        this.load.audio('musica1','/juegofinal/game/assets/sounds/nivel1.ogg');
        //imagenes para escena de game over, win y png del alien   
        this.load.image('fondo2','/juegofinal/game/assets/images/fondoGameOver.jpg');
        this.load.image('alienGO','/juegofinal/game/assets/images/alienGameOver.png');
        this.load.image('alienWin','/juegofinal/game/assets/images/alienWin.png');
       //png del texto para win, gameover
        this.load.image('gameover','/juegofinal/game/assets/images/gameover.png');
        this.load.image('win','/juegofinal/game/assets/images/felicidades.png');
        //botones
        this.load.image('buttonMenu', '/juegofinal/game/assets/images/botonMenu1.png');
        this.load.image('buttonRetry', '/juegofinal/game/assets/images/botonReintentar1.png');
        this.load.image('buttonPause', '/juegofinal/game/assets/images/botonPause.png');
        this.load.image('buttonPlay', '/juegofinal/game/assets/images/botonPlay.png');
    }
    create(){
        //creamos el fondo
        this.add.image(500,300,'fondo');
        //seteamos el nivel con sus sprites, sus entradas por teclado
        this.addSprites();
        this.addInputs();
       //seteamos los portales del nivel y el sonido
        this.setNivel();
        //configuramos las colisiones con portales, suelo y techo
        this.configureColisions();
        //creamos el boton de pausa
        this.createBotonPause();
 
        //aplicacion de tipo cliente que solicitara la informacion de los obstaculos del nivel 1 de tipo BOTTOM
        api.fetchObstacles(1,'BOTTOM').then( response =>{
   
        
            
            this.spikes = this.physics.add.group(); //agrega fisica al grupo de spikes
        
                             for(let spike of response){
                                
                            let positionX = 0;
                           
                            for(let i = 0; i<spike.quantity; i++){
                                //crea cada obstaculo en una variable auxiliar , tomando los segundos*700 como x, y_value como posicion en y, finalmente el tipo de spike
                                let spikeAux = this.spikes.create((spike.seconds*700)+positionX,spike.y_value,'spikeBottom').setOrigin(0,1);
                               
                                positionX += spikeAux.width; 
                            }
                            }
                           //velocidad de spikes
                            this.spikes.setVelocityX(-700);
                            //colision de spikes con el pj
                           this.physics.add.collider(this.box, this.spikes, this.gameOver, null, this);
                                       
                                       
        });

        //aplicacion de tipo cliente que solicitara la informacion de los obstaculos del nivel 1 de tipo TOP
        api.fetchObstacles(1,'TOP').then( response =>{
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
        //aplicacion de tipo cliente que solicitara la informacion de los obstaculos del nivel 1 de tipo SIDE
        api.fetchObstacles(1,'SIDE').then( response =>{
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
        this.nivel1Sound = this.sound.add('musica1');
        this.nivel1Sound.play();
        this.portalGravity = this.physics.add.sprite(20*700, 465, 'portalGravity').setOrigin(0,1);
        this.portalGravity2 = this.physics.add.sprite(40*700, 465, 'portalGravity2').setOrigin(0,1);
        this.portalGravity.body.velocity.x = -700;
        this.portalGravity2.body.velocity.x = -700;
        this.portalEnd = this.physics.add.sprite(62*700, 465, 'portalEnd').setOrigin(0,1);
        this.portalEnd.body.velocity.x = -700;
      
      
       
    }
    configureColisions() {
        this.physics.add.collider(this.box, this.groundBottom,this.resetJumpCount, null, this);
        this.physics.add.collider(this.box, this.groundTop,this.resetJumpCount, null, this);
        this.physics.add.collider(this.box, this.spikes, this.gameOver, null, this);
        this.physics.add.overlap(this.box,this.portalGravity, this.invertGravity,null, this);
        this.physics.add.overlap(this.box,this.portalGravity2, this.invertGravity,null, this);
        this.physics.add.overlap(this.box,this.portalEnd,this.win,null,this);
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
    invertGravity()
    {
        if(this.isGravityInverted == false)
        {
        this.isGravityInverted = true;
        this.box.setTexture('box2');
        this.box.body.gravity.y = -4000;
        }else
        {
            this.isGravityInverted = false;
            this.box.setTexture('box');
            this.box.body.gravity.y = 4000;
        }   
     
    
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
         this.nivel1Sound.pause();
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
        this.nivel1Sound.pause();
        this.add.image(500,300,'fondo2');
        this.add.image(450,200,'win');
        this.add.image(750,400,'alienWin');
        this.createBotonMenu();
       

    }
    pausa()
    {
        this.physics.pause();
        this.nivel1Sound.pause();
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
        this.scene.start('phase1');
      });
    }
    createBotonContinuar(){
        this.playButton = this.add.sprite(600,300, 'buttonPlay').setInteractive();
        this.playButton.on('pointerdown', () => {
           
            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.physics.resume();
                    this.nivel1Sound.resume();
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



