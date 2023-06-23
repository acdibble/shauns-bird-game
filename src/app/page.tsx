"use client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [gravity, setGravity] = useState(0.75);
  const [speed, setSpeed] = useState(5);

  const speedRef = useRef(speed);
  const gravityRef = useRef(gravity);

  useEffect(() => {
    speedRef.current = speed;
    gravityRef.current = gravity;
  }, [speed, gravity]);

  useEffect(() => {
    let backgroundImage = new Image();
    backgroundImage.src = "background.png";

    let birdImage = new Image();
    birdImage.src = "bird.svg"; // This should be the name of your SVG file

    let canvas = document.getElementById("flappyBird") as any;
    let ctx = canvas.getContext("2d");
    console.log(ctx);

    let bird = {
      x: 50,
      y: 150,
      velocity: 0,
      radius: 10,
    };

    let pipes = [] as any[];
    let jump = -9;
    let score = 0;

    document.addEventListener("keydown", function (e) {
      if (e.key === " ") {
        bird.velocity = jump;
      }
    });

    function addPipe() {
      let pipeHeight = Math.random() * (canvas.height / 2);
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
      bird.velocity += gravityRef.current;
      bird.y += bird.velocity;

      if (bird.y > canvas.height - bird.radius) {
        bird.y = canvas.height - bird.radius;
        bird.velocity = 0;
      }

      if (
        pipes.length === 0 ||
        pipes[pipes.length - 1].x < canvas.width - 150
      ) {
        addPipe();
      }

      for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= speedRef.current;

        if (pipes[i].x + pipes[i].width < 0) {
          score++;
          pipes.splice(i, 1);
        }
      }

      for (let i = 0; i < pipes.length; i++) {
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

      for (let i = 0; i < pipes.length; i++) {
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
  }, []);

  return (
    <main>
      <canvas id="flappyBird" width="480" height="320"></canvas>
      <div>
        <label htmlFor="gravity">Gravity</label>
        <input
          id="gravity"
          type="range"
          min="0"
          max="10"
          step="0.01"
          value={gravity}
          onChange={(e) => setGravity(parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="speed">Speed</label>
        <input
          id="gravity"
          type="range"
          min="0"
          max="10"
          step="0.01"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
        />
      </div>
    </main>
  );
}
