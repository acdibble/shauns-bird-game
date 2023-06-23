var backgroundImage = new Image();
backgroundImage.src = "background.png";

var birdImage = new Image();
birdImage.src = "bird.svg"; // This should be the name of your SVG file

document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById("flappyBird");
  var ctx = canvas.getContext("2d");

  var bird = {
    x: 50,
    y: 150,
    velocity: 0,
    radius: 10,
  };

  var pipes = [];
  var gravity = 1;
  var jump = -8;
  var score = 0;

  document.addEventListener("keydown", function (e) {
    if (e.key === " ") {
      bird.velocity = jump;
    }
  });

  function addPipe() {
    var pipeHeight = Math.random() * (canvas.height / 2);
    pipes.push({
      x: canvas.width,
      y: 0,
      width: 30,
      height: pipeHeight,
    });
    pipes.push({
      x: canvas.width,
      y: pipeHeight + 120,
      width: 30,
      height: canvas.height - pipeHeight,
    });
  }

  function update() {
    bird.velocity += gravity;
    bird.y += bird.velocity;

    if (bird.y > canvas.height - bird.radius) {
      bird.y = canvas.height - bird.radius;
      bird.velocity = 0;
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 150) {
      addPipe();
    }

    for (var i = pipes.length - 1; i >= 0; i--) {
      pipes[i].x -= 6;

      if (pipes[i].x + pipes[i].width < 0) {
        score++;
        pipes.splice(i, 1);
      }
    }

    for (var i = 0; i < pipes.length; i++) {
      if (
        bird.x + bird.radius > pipes[i].x &&
        bird.x - bird.radius < pipes[i].x + pipes[i].width &&
        bird.y + bird.radius > pipes[i].y &&
        bird.y - bird.radius < pipes[i].y + pipes[i].height
      ) {
        pipes = [];
        score = 0;
      }
    }
  }

  function draw() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      birdImage,
      bird.x - bird.radius,
      bird.y - bird.radius,
      bird.radius * 2,
      bird.radius * 2
    );

    for (var i = 0; i < pipes.length; i++) {
      ctx.beginPath();
      ctx.rect(pipes[i].x, pipes[i].y, pipes[i].width, pipes[i].height);
      ctx.fillStyle = "#0f0";
      ctx.fill();
      ctx.closePath();
    }

    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
  }

  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
});
