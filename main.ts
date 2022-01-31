namespace SpriteKind {
    export const EscaleraType = SpriteKind.create()
    export const barril = SpriteKind.create()
    export const oil = SpriteKind.create()
}
/**
 * La posición del contendedor de Oil ponerla en 20 360.
 * 
 * En esta posición se destruyen los barriles.
 */
let barriletes: Sprite[] = []
let contador = 0
tiles.setTilemap(tilemap`level1`)
let oil = sprites.create(assets.image`OIL`, SpriteKind.oil)
oil.setPosition(24, 360)
let donkeykong = sprites.create(assets.image`DonkeyKong`, SpriteKind.Enemy)
donkeykong.setPosition(23, 65)
let mario = sprites.create(assets.image`mario`, SpriteKind.Player)
// Posición inicial
// x = 20
// y = 360
mario.setPosition(81, 73)
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
game.onUpdateInterval(2000, function () {
    barrilete = sprites.create(assets.image`barrileteJr`, SpriteKind.barril)
    barrilete.setPosition(50, 73)
    barriletes.push(barrilete)
    barriletes[barriletes.length - 1].vx = 60
})
forever(function () {
    contador = barriletes.length - 1
    while (contador >= 0) {
        mario.sayText(contador)
        if (barriletes[contador].x >= 153) {
            if (!(barriletes[contador].isHittingTile(CollisionDirection.Bottom))) {
                barriletes[contador].vy = 200
            } else {
                barriletes[contador].vx = -60
                animation.runImageAnimation(
                barriletes[contador],
                assets.animation`BarrileteAlante`,
                100,
                true
                )
            }
        } else if (barriletes[contador].x <= 10) {
            if (!(barriletes[contador].isHittingTile(CollisionDirection.Bottom))) {
                barriletes[contador].vy = 200
            } else {
                barriletes[contador].vx = 60
                animation.runImageAnimation(
                barriletes[contador],
                assets.animation`BarrileteAlante`,
                100,
                true
                )
            }
        }
        if (barriletes[contador].x <= 24 && barriletes[contador].y >= 360) {
            barriletes[contador].z = -1
            barriletes[contador].destroy(effects.fire, 1000)
            barriletes[contador].vx = 0
        }
        contador += -1
    }
})
