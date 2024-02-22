const canvas = document.querySelector("canvas")
if (!canvas) throw new Error("Canvas not found")

const CAMERA_SIZE = 100

const PLAYER_WIDTH = 3
const PLAYER_HEIGHT = 8

const TURN_SPEED = 4

type Vector2d = { x: number, y: number }
const PLAYER_SIZE = { x: PLAYER_WIDTH, y: PLAYER_HEIGHT }

let player = {
  angle: 0,
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
}

let previousTime = performance.now()
requestAnimationFrame(function gameLoop() {
  const now = performance.now()
  const deltaTime = (now - previousTime) / 1000
  previousTime = now

  {
    const { width, height } = canvas.getBoundingClientRect()
    canvas.width = width * devicePixelRatio
    canvas.height = height * devicePixelRatio
  }

  // update game
  if (keysDown.has("ArrowLeft")) {
    player.angle -= TURN_SPEED * deltaTime
  }

  if (keysDown.has("ArrowRight")) {
    player.angle += TURN_SPEED * deltaTime
  }

  function rotate(point: Vector2d, angle: number) {
    return {
      x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
      y: point.x * Math.sin(angle) + point.y * Math.cos(angle)
    }
  }

  if (keysDown.has("ArrowUp")) {
    const PROPULSION_FORCE = 2
    const direction = rotate({ x: 0, y: 1 }, player.angle)
    player.velocity.x += PROPULSION_FORCE * direction.x * deltaTime
    player.velocity.y += PROPULSION_FORCE * direction.y * deltaTime
  }

  const GRAVITY_FORCE = 1
  player.velocity.y -= GRAVITY_FORCE * deltaTime

  // apply drag
  // const speed = Math.sqrt(player.velocity.y ** 2 + player.velocity.x ** 2)
  const DRAG_FACTOR = 0
  player.velocity.y -= player.velocity.y * DRAG_FACTOR * deltaTime
  player.velocity.x -= player.velocity.x * DRAG_FACTOR * deltaTime

  player.position.y += player.velocity.y
  player.position.x += player.velocity.x

  // draw game
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Ctx could not be initialized")

  ctx.scale(canvas.width / CAMERA_SIZE, canvas.height / CAMERA_SIZE)
  ctx.translate(CAMERA_SIZE / 2, CAMERA_SIZE / 2)
  ctx.scale(1, -1)

  ctx.fillStyle = "black"
  ctx.fillRect(-50, -50, 100, 100)

  ctx.fillStyle = "blue"
  {
    ctx.save()
    ctx.translate(-player.position.x, player.position.y)
    ctx.rotate(-player.angle)
    ctx.fillRect(-PLAYER_SIZE.x / 2, -PLAYER_SIZE.y / 2, PLAYER_SIZE.x, PLAYER_SIZE.y)
    ctx.restore()
  }

  requestAnimationFrame(gameLoop)
})

const keysDown = new Set<string>()

document.onkeydown = (e) => {
  keysDown.add(e.key)
  console.log(e.key)
}

document.onkeyup = (e) => {
  keysDown.delete(e.key)
}
