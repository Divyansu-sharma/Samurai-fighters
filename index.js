const canvas=document.querySelector('canvas')
const c=canvas.getContext('2d')
canvas.width=1024
canvas.height=576
c.fillRect(0,0,canvas.width,canvas.height)

const background=new Sprite({
    position:{
    x:0,
    y:0
},
imageSrc: './img/background.png'

}
)

const shop=new Sprite({
    position:{
    x:610,
    y:128
},

imageSrc: './img/shop.png',
scale:2.75,
framesMax:6


}
)

const player=new Fighter({
    position:{
    x:225,
    y:0
},
velocity:{
    x:0,
    y:0
},
offset:{
    x:0,
    t:0
},
imageSrc: './img/samuraiMack/idle.png',
framesMax:8,
scale:2.5,
offset:{
    x:215,
    y:157},
sprites:{
    idle:{
        imageSrc:'./img/samuraiMack/idle.png',
        framesMax:8
    },
    run:{
        imageSrc:'./img/samuraiMack/Run.png',
        framesMax:8
    },
    jump:{
        imageSrc:'./img/samuraiMack/Jump.png',
        framesMax:2
    },
    fall:{
        imageSrc:'./img/samuraiMack/Fall.png',
        framesMax:2
    },
    attack1:{
        imageSrc:'./img/samuraiMack/Attack1.png',
        framesMax:6
    },
    takeHit: {
        imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
        framesMax: 4
      },
    death:{
        imageSrc:'./img/samuraiMack/Death.png',
        framesMax:6
    }
    },
    attackBox:{
        offset:{
            x:100,
            y:50
        },
        width:160,
        height:50
    }
})

const enemy=new Fighter({
    position:{
    x:750,
    y:100
},
velocity:{
    x:0,
    y:0
},
color:'blue',
offset:{
    x:-50,
    t:0
},
imageSrc: './img/kenji/idle.png',
framesMax:4,
scale:2.5,
offset:{
    x:215,
    y:169
},
sprites:{
    idle:{
        imageSrc:'./img/kenji/idle.png',
        framesMax:4
    },
    run:{
        imageSrc:'./img/kenji/Run.png',
        framesMax:8
    },
    jump:{
        imageSrc:'./img/kenji/Jump.png',
        framesMax:2
    },
    fall:{
        imageSrc:'./img/kenji/Fall.png',
        framesMax:2
    },
    attack1:{
        imageSrc:'./img/kenji/Attack1.png',
        framesMax:4
    },
    takeHit: {
        imageSrc: './img/kenji/Take hit.png',
        framesMax: 3
    },
    death:{
        imageSrc:'./img/kenji/Death.png',
        framesMax:7
    }
    },
    attackBox:{
        offset:{
            x:-170,
            y:50
        },
        width:170,
        height:50
    }
})


console.log(player)

const keys={
    a:{
        pressed:false
    },
    d:{
        pressed:false
    },
    w:{
        pressed:false
    },l:{
        pressed:false
    },
    j:{
        pressed:false
    },
    i:{
        pressed:false
    }
}



decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle='black'
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    shop.update()
    c.fillStyle='rgba(255,255,255,0.15)'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update()
    enemy.update()

    player.velocity.x=0


    
    if(keys.a.pressed&&player.lastkey==='a'){
        player.velocity.x=-5
    player.switchSprite('run')
        
    }
    else if(keys.d.pressed&&player.lastkey==='d'){
        player.velocity.x=5
        player.switchSprite('run')
    }else{
        player.switchSprite('idle')
    }

    if(player.velocity.y<0){
        player.switchSprite('jump')
    }else if(player.velocity.y>0){
        player.switchSprite('fall')

    }

    enemy.velocity.x=0
    if(keys.l.pressed&&enemy.lastkey==='l'){
        enemy.velocity.x=5
        enemy.switchSprite('run')
    }else if(keys.j.pressed&&enemy.lastkey==='j'){
        enemy.velocity.x=-5
        enemy.switchSprite('run')
    }else{
        enemy.switchSprite('idle')
    }

    if(enemy.velocity.y<0){
        enemy.switchSprite('jump')
    }else if(enemy.velocity.y>0){
        enemy.switchSprite('fall')

    }

    if(rectangularCollision({
        rectangle1:player,
        rectangle2:enemy
    })&&player.isAttacking&&player.framesCurrent===4
    ){
            enemy.takeHit()
            player.isAttacking=false
        gsap.to('#enemyHealth',{
            width:enemy.health +'%'
        })
    }

    if(player.isAttacking&&player.framesCurrent===4){
        player.isAttacking=false
    }

    if(rectangularCollision({
        rectangle1:enemy,
        rectangle2:player
    })&&enemy.isAttacking&&enemy.framesCurrent===2
    ){
            player.takeHit()
            enemy.isAttacking=false
            gsap.to('#playerHealth',{
                width:player.health +'%'
            })
    }

    if(enemy.isAttacking&&enemy.framesCurrent===2){
        enemy.isAttacking=false
    }
    // end game based on health
    if(enemy.health<=0||player.health<=0){
        determineWinner({player,enemy,timerID})
    }
}
animate()
window.addEventListener('keydown',(event)=>{
    if(!player.dead){
    switch(event.key){
        case 'd':
            keys.d.pressed=true
            player.lastkey='d'
            break
        case 'a':
            keys.a.pressed=true
            player.lastkey='a'
            break
        case 'w':
            if (player.velocity.y === 0) {
            player.velocity.y=-20
            }
            break
        case 'e':
            player.attack()
            break
        
    }
}
    if(!enemy.dead){
    switch(event.key){
        case 'u':
        enemy.attack()
        break    
    case 'l':
        keys.l.pressed=true
        enemy.lastkey='l'
        break
    case 'j':
        keys.j.pressed=true
        enemy.lastkey='j'
        break
    case 'i':
        if (enemy.velocity.y === 0) {
        enemy.velocity.y=-20
        }
        break
    }
}
    
})
window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'd':
            keys.d.pressed=false
            break
        case 'a':
            keys.a.pressed=false
            break
        case 'w':
            keys.w.pressed=false
            break
        case 'l':
            keys.l.pressed=false
            break
        case 'j':
            keys.j.pressed=false
            break
        case 'i':
            keys.i.pressed=false
            break
    }
   
})
