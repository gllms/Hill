let keys = {
  w: false,
  a: false,
  s: false,
  d: false
};

let speed = .5;
let spring = .05;
let springLength = 80;

var elem = document.getElementById("myBar");
var width = 100;

// module aliases
let Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Events = Matter.Events,
  Body = Matter.Body,
  Constraint = Matter.Constraint
Mouse = Matter.Mouse
MouseConstraint = Matter.MouseConstraint,
  Vertices = Matter.Vertices,
  Svg = Matter.Svg;

// create an engine
let engine = Engine.create();

// create a renderer
let render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    background: "dodgerblue"
  }
});

// create two boxes and a ground
let car = Bodies.fromVertices(300, 100, [{ x: 160, y: 0 }, { x: 220, y: 50 }, { x: 0, y: 50 }, { x: 0, y: 100 }, { x: 32, y: 100 }, { x: 37, y: 81 }, { x: 51, y: 67 }, { x: 70, y: 62 }, { x: 89, y: 67 }, { x: 103, y: 81 }, { x: 108, y: 100 }, { x: 192, y: 100 }, { x: 197, y: 81 }, { x: 211, y: 67 }, { x: 230, y: 62 }, { x: 249, y: 67 }, { x: 263, y: 81 }, { x: 268, y: 100 }, { x: 300, y: 100 }, { x: 300, y: 50 }, { x: 240, y: 50 }, { x: 180, y: 0 }], { render: { fillStyle: "crimson", lineWidth: 1, strokeStyle: "crimson" } });
let head = Bodies.circle(275, 50, 30, { render: { fillStyle: "navajowhite" }, label: "head" });
let headSpring = Constraint.create({
  bodyA: car,
  pointA: { x: -25, y: 0 },
  bodyB: head,
  stiffness: spring,
  damping: .05,
  render: {
    visible: false
  }
});
let wheelA = Bodies.circle(200, 160, 30, { render: { fillStyle: "#111" } });
let wheelB = Bodies.circle(400, 160, 30, { render: { fillStyle: "#111" } });
let ground = Bodies.rectangle(400, 610, 810, 60, { render: { fillStyle: "forestgreen" }, isStatic: true, label: "ground" });
let springs = [createSpring(wheelA, -100, 0), createSpring(wheelA, -50, 0), createSpring(wheelB, 60, 0), createSpring(wheelB, 110, 0)];

let mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false
      }
    }
  });

// add all of the bodies to the world
World.add(engine.world, [car, head, headSpring, wheelA, wheelB, ground, ...springs, mouseConstraint]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

Events.on(engine, "beforeUpdate", function (event) {
  if (width > 0) {
    width -= .05;
    elem.style.width = width + "%";
    if (Object.values(keys).some((e) => e == true)) {
      width -= .1;
    }

    if (keys.d) {
      Body.setAngularVelocity(wheelA, speed);
      Body.setAngularVelocity(wheelB, speed);
    }
    if (keys.a) {
      Body.setAngularVelocity(wheelA, -speed);
      Body.setAngularVelocity(wheelB, -speed);
    }
  }
  if (width >= 40) {
    elem.style.background = "#4CAF50";
  }
  if (width < 40) {
    elem.style.background = "#F5E73B";
  }
  if (width < 25) {
    elem.style.background = "orange";
  }
  if (width < 10) {
    elem.style.background = "red";
  }
});

Events.on(engine, 'collisionStart', function (event) {
  let pairs = event.pairs;
  if (pairs.filter((e) => (e.bodyA.label == "head" && e.bodyB.label == "ground") || (e.bodyA.label == "ground" && e.bodyB.label == "head")).length > 0) {
    console.log("Game Over");
  }
});

document.body.addEventListener("keydown", handleKeys);
document.body.addEventListener("keyup", handleKeys);
document.body.addEventListener("keyup", function (event) {
  if (event.key == "w") Body.applyForce(car, car.position, { x: 0, y: -1 });
  if (event.key == "s") Body.applyForce(car, car.position, { x: 0, y: 1 });
});

function handleKeys(event) {
  keys[event.key] = event.type == "keydown";
}

function createSpring(wheel, x, y) {
  return Constraint.create({
    bodyA: car,
    pointA: { x, y },
    bodyB: wheel,
    stiffness: spring,
    damping: .05,
    length: springLength,
    render: {
      visible: false
    }
  });
}
