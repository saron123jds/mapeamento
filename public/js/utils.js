
export function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

function getActiveRect(container){
  const img = container.querySelector('.map-wrap__img');
  if (img && img.style.display !== 'none'){
    const rect = img.getBoundingClientRect();
    if (rect.width && rect.height){
      return rect;
    }
  }
  return container.getBoundingClientRect();
}

export function pointerToPercent(container, clientX, clientY){
  const rect = getActiveRect(container);
  const x = ((clientX - rect.left) / rect.width) * 100;
  const y = ((clientY - rect.top) / rect.height) * 100;
  return { x: clamp(x, 0, 100), y: clamp(y, 0, 100) };
}

export function percentToPx(container, xy){
  const rect = getActiveRect(container);
  const base = container.getBoundingClientRect();
  return {
    x: (xy.x / 100) * rect.width + (rect.left - base.left),
    y: (xy.y / 100) * rect.height + (rect.top - base.top)
  };
}

export function arrowHead(a, b){
  const angle = Math.atan2(b.y - a.y, b.x - a.x);
  const len = 10, w = 6;
  const x1 = b.x, y1 = b.y;
  const x2 = x1 - len*Math.cos(angle) + w*Math.sin(angle);
  const y2 = y1 - len*Math.sin(angle) - w*Math.cos(angle);
  const x3 = x1 - len*Math.cos(angle) - w*Math.sin(angle);
  const y3 = y1 - len*Math.sin(angle) + w*Math.cos(angle);
  return `${x1},${y1} ${x2},${y2} ${x3},${y3}`;
}
