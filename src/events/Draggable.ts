export function useDraggable(
    el: HTMLElement,
    pointerEl?: HTMLElement,
    containerEl?: HTMLElement,
    callback?: (x: number, y: number) => void
) {
    var _x = 0,
        _y = 0,
        x = 0,
        y = 0;

    if (pointerEl) {
        pointerEl.style.cursor = 'move'
        pointerEl.onmousedown = dragMouseDown;
    } else {
        el.style.cursor = 'move'
        el.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e: MouseEvent) {
        e.preventDefault();

        _x = e.clientX - el.offsetLeft;
        _y = e.clientY - el.offsetTop;

        (containerEl || document).onmouseup = closeDragElement;
        (containerEl || document).onmousemove = elementDrag;
    }

    function elementDrag(e: MouseEvent) {
        e.preventDefault();

        x = e.clientX - _x;
        y = e.clientY - _y;

        if (containerEl) {
            const maxX = containerEl.offsetWidth - el.offsetWidth;
            if (x > maxX) {
                x = maxX;
                closeDragElement();
            }
        }

        el.style.top = y + "px";
        el.style.left = x + "px";

        callback && callback(x, y);
    }

    function closeDragElement() {
        (containerEl || document).onmouseup = null;
        (containerEl || document).onmousemove = null;
    }
}
