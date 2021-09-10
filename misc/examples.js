const draw = (corner_a, corner_b, side, scale) => {
    const maze_canvas = document.querySelector('#maze');
    const context = maze_canvas.getContext('2d');
    context.fillStyle = 'black';
    let points = 200;

    for (let i = 0; i < points; i++) {
        for (let j = 0; j < points; j++) {
            const x = corner_a + ((i * side) / points);
            const y = corner_b + ((j * side) / points);
            const c = Math.floor(x * x + y * y);
            const cIsEven = c % 2 === 0;

            if (cIsEven) {
                const scaledI = i * scale;
                const scaledJ = j * scale;
                context.fillRect(scaledI, scaledJ, scale, scale);
            }

        }
    }
}

// draw(5, 50, 31322, 4);
// draw(5, 5, 3, 4);
// draw(5, 5, 11, 4);
draw(5, 5, 322, 4);