export type DraggableOptions = {
  handleElement?: HTMLElement,
  dragAreaElement?: HTMLElement,
  callback?: (x: number, y: number) => void
}

export function draggable(draggableElement: HTMLElement, { handleElement, dragAreaElement, callback }: DraggableOptions) {
  const _draggableElement = draggableElement
  const _handleElement = handleElement || _draggableElement;
  const _dragAreaElement = dragAreaElement || document.documentElement;

  _draggableElement.style.position = 'absolute';
  _handleElement.style.cursor = 'move';

  _handleElement.addEventListener('mousedown', dragStart);
  _handleElement.addEventListener('touchstart', dragStart, { passive: false });

  let _x: number, _y: number;
  let x: number, y: number;

  function dragStart(e: MouseEvent | TouchEvent) {
    e.preventDefault();

    const clientX = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
    const clientY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;

    _x = clientX - _draggableElement.offsetLeft;
    _y = clientY - _draggableElement.offsetTop;

    _dragAreaElement.addEventListener('mousemove', onMove);
    _dragAreaElement.addEventListener('touchmove', onMove, { passive: false });
    _dragAreaElement.addEventListener('mouseup', dragEnd);
    _dragAreaElement.addEventListener('touchend', dragEnd);
  }

  function dragEnd() {
    _dragAreaElement.removeEventListener('mousemove', onMove);
    _dragAreaElement.removeEventListener('touchmove', onMove);
    _dragAreaElement.removeEventListener('mouseup', dragEnd);
    _dragAreaElement.removeEventListener('touchend', dragEnd);
  }

  function onMove(e: MouseEvent | TouchEvent) {
    e.preventDefault();

    const clientX = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
    const clientY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;

    x = clientX - _x;
    y = clientY - _y;

    const boundingEl = dragAreaElement || document.documentElement;
    const maxX = boundingEl.clientWidth - _draggableElement.offsetWidth;
    const maxY = boundingEl.clientHeight - _draggableElement.offsetHeight;

    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    _draggableElement.style.left = `${x}px`;
    _draggableElement.style.top = `${y}px`;
    _draggableElement.style.bottom = 'auto';
    _draggableElement.style.right = 'auto';

    callback && callback(x, y);
  }
}