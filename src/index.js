import { BehaviorSubject, forkJoin, fromEvent, merge, Subject } from 'rxjs';
import { map, takeUntil, takeWhile } from 'rxjs/operators';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const isDrawingSpan = document.getElementById('isDrawing');
const xOffsetSpan = document.getElementById('xOffset');
const yOffsetSpan = document.getElementById('yOffset');

const drawing$ = new BehaviorSubject(false);
drawing$.subscribe((isDrawing) => {
  console.log(isDrawing);
});

function drawLine(context, x1, y1, x2, y2) {
  context.beginPath();
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

let x = 0;
let y = 0;

fromEvent(canvas, 'mousedown').subscribe((event) => {
  console.log(event);

  const { offsetX, offsetY } = event;
  x = offsetX;
  y = offsetY;
  drawing$.next(true);
});

fromEvent(canvas, 'mouseup').subscribe((event) => {
  const { offsetX, offsetY } = event;

  if (drawing$.value) {
    drawLine(ctx, x, y, offsetX, offsetY);
    x = 0;
    y = 0;
  }

  drawing$.next(false);
});

merge(drawing$, fromEvent(canvas, 'mousemove'))
  .pipe(
    map((event) => {
      if (!!event.type && event.type === 'mousemove') {
        const { offsetX, offsetY } = event;
        return { offsetX, offsetY, type: 'mousemove' };
      } else {
        return { isDrawing: event, type: 'isDrawing' };
      }
    })
  )
  .subscribe((event) => {
    if (event.type === 'isDrawing') {
      isDrawingSpan.innerText = event.isDrawing;
    } else {
      // get latest value of behavior subject
      if (drawing$.value) {
        const { offsetX, offsetY } = event;
        xOffsetSpan.innerText = offsetX;
        yOffsetSpan.innerText = offsetY;
        drawLine(ctx, x, y, offsetX, offsetY);
        x = offsetX;
        y = offsetY;
      } else {
        xOffsetSpan.innerText = 'not drawing';
        yOffsetSpan.innerText = 'not drawing';
      }
    }
  });
