namespace SpriteKind {
    export const EscaleraType = SpriteKind.create()
    export const barril = SpriteKind.create()
    export const oil = SpriteKind.create()
    export const fuego = SpriteKind.create()
}
// Cada 10 barriles, sale uno azul, que cuando llegue al final creará un fuego. 
sprites.onOverlap(SpriteKind.barril, SpriteKind.oil, function (sprite, otherSprite) {
    pause(1000)
    if (contadorFuego >= 11) {
        if (fuego) {
            fuego.destroy()
        }
        fuego = sprites.create(assets.image`Fueguito`, SpriteKind.fuego)
        fuego.setPosition(24, 345)
        fuego.ay = 300
        fuego.vx = 40
        contadorFuego = 0
    }
    contadorFuego += 1
})
let fuego: Sprite = null
let barriletes: Sprite[] = []
let contadorFuego = 0
let contador = 0
let contadorAzul = 0
let azul = false
contadorFuego = 0
let aleatorio = 0
tiles.setTilemap(tilemap`level1`)
let oil = sprites.create(assets.image`OIL`, SpriteKind.oil)
oil.setPosition(24, 360)
let donkeykong = sprites.create(assets.image`DonkeyKong`, SpriteKind.Enemy)
donkeykong.setPosition(23, 65)
let mario = sprites.create(assets.image`mario`, SpriteKind.Player)
// Posición inicial
// x = 20
// y = 360
mario.setPosition(48, 360)
mario.ay = 300
controller.moveSprite(mario, 100, 100)
let barrilete = sprites.create(assets.image`barrileteJr`, SpriteKind.barril)
barrilete.setPosition(50, 73)
barriletes.push(barrilete)
barriletes[barriletes.length - 1].vx = 60
animation.runImageAnimation(
barrilete,
assets.animation`BarrileteAlante`,
100,
true
)
scene.cameraFollowSprite(mario)
// Este update lo que hace es comprobar si estamos en una escalera para poder subir o bajar por ella. 
game.onUpdate(function () {
    if (mario.tileKindAt(TileDirection.Center, assets.tile`escaleras`) || mario.tileKindAt(TileDirection.Center, assets.tile`viga`)) {
        mario.ay = 0
        controller.moveSprite(mario, 100, 80)
    } else if (controller.B.isPressed()) {
        mario.ay = 300
        if (mario.isHittingTile(CollisionDirection.Bottom)) {
            mario.vy += -100
            controller.moveSprite(mario, 100, 0)
        }
    } else {
        mario.ay = 300
        controller.moveSprite(mario, 100, 0)
    }
})
/**
 * La posición del contendedor de Oil ponerla en 24 360.
 * 
 * En esta posición se destruyen los barriles.
 * 
 * Se generan los fuegos en 35 360
 */
// Este algoritmo crea los barriles cada dos segundos añadiendolos a un array para después poder manejarlos. 
// Serían como una especie de clones.
game.onUpdateInterval(2000, function () {
    if (contadorAzul >= 10) {
        contadorAzul = 0
        barrilete = sprites.create(assets.image`barrileteJr3-Azul`, SpriteKind.barril)
        barrilete.setPosition(50, 73)
        barriletes.push(barrilete)
        barriletes[barriletes.length - 1].vx = 60
        animation.runImageAnimation(
        barrilete,
        assets.animation`BarrileteAlante-azul`,
        100,
        true
        )
        azul = true
    } else {
        barrilete = sprites.create(assets.image`barrileteJr`, SpriteKind.barril)
        contadorAzul += 1
        barrilete.setPosition(50, 73)
        barriletes.push(barrilete)
        barriletes[barriletes.length - 1].vx = 60
        animation.runImageAnimation(
        barrilete,
        assets.animation`BarrileteAlante`,
        100,
        true
        )
        azul = false
    }
})
// Este algoritmo programa los barriles para que vayan cayendo hasta llegar al bidón de gasolina y ahí se destruyen
// 
forever(function () {
    contador = barriletes.length - 1
    while (contador >= 0) {
        if (barriletes[contador].x >= 153) {
            if (!(barriletes[contador].isHittingTile(CollisionDirection.Bottom))) {
                barriletes[contador].vy = 200
            } else {
                barriletes[contador].vx = -60
                if (azul) {
                    animation.runImageAnimation(
                    barrilete,
                    assets.animation`BarrileteAlante-azul`,
                    100,
                    true
                    )
                } else {
                    animation.runImageAnimation(
                    barrilete,
                    assets.animation`BarrileteAlante`,
                    100,
                    true
                    )
                }
            }
        } else if (barriletes[contador].x <= 10) {
            if (!(barriletes[contador].isHittingTile(CollisionDirection.Bottom))) {
                barriletes[contador].vy = 200
            } else {
                barriletes[contador].vx = 60
                if (azul) {
                    animation.runImageAnimation(
                    barrilete,
                    assets.animation`BarrileteAtras-azul`,
                    100,
                    true
                    )
                } else {
                    animation.runImageAnimation(
                    barrilete,
                    assets.animation`BarrileteAtras`,
                    100,
                    true
                    )
                }
            }
        }
        if (barriletes[contador].x <= 24 && barriletes[contador].y >= 360) {
            barriletes[contador].z = -1
            barriletes[contador].destroy(effects.fire, 800)
            barriletes[contador].vx = 0
        }
        contador += -1
    }
})
forever(function () {
    if (fuego) {
        aleatorio = randint(1, 3)
    }
    pause(5000)
})
/**
 * Probar si la velocidad en x es cero, hacer que cambie al último movimiento que estuviese haciendo. Izquierda o Derecha.
 */
// Número Aleatorio movimiento Fuego
// 1 --> Izq - Derch corto
// 2 --> por toda la plattaforma
// 3 --> toda la plataforma y si toca las escaleras suba por ellas.
forever(function () {
    if (fuego) {
        fuego.sayText(fuego.vx)
        if (fuego.isHittingTile(CollisionDirection.Top)) {
            if (fuego.vx >= 0) {
                fuego.vx = 40
            }
            if (fuego.vx <= 0) {
                fuego.vx = -40
            }
            fuego.ay = 300
        }
        if (aleatorio == 1) {
            if (fuego.x >= 100) {
                fuego.setVelocity(-40, 0)
            } else if (fuego.x <= 50) {
                fuego.setVelocity(40, 0)
            }
        } else if (aleatorio == 2) {
            if (fuego.x >= 150) {
                fuego.setVelocity(-40, 0)
            } else if (fuego.x <= 10) {
                fuego.setVelocity(40, 0)
            }
        } else if (aleatorio == 3) {
            if (fuego.x >= 150) {
                fuego.setVelocity(-40, 0)
            } else if (fuego.x <= 10) {
                fuego.setVelocity(40, 0)
            }
            // Si el movimiento del fuego es de izq a drcha hacer que se centre con la escalera moviendo unos pasos más hacia la derecha
            // 
            // Si el movimiento del fuego es de drcha a izq hacer que este se mueva hacia la izquierda unos pasos.
            if (fuego.tileKindAt(TileDirection.Center, assets.tile`escaleras`)) {
                if (fuego.vx > 0) {
                    fuego.vy += -70
                    fuego.vx = 40
                }
                if (fuego.vx < 0) {
                    fuego.vy += -70
                    fuego.vx = -40
                }
            }
        }
    }
})
forever(function () {
    mario.sayText(aleatorio, 500, false)
})
