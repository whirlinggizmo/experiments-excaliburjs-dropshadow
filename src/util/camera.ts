import { Camera, BoundingBox } from 'excalibur';


export function calculateZoomCameraToBoundingBox(camera: Camera, boundingBox: BoundingBox, padding: number = 0) {

    // Get the dimensions of the bounding box
    const boxWidth = boundingBox.width + padding * 2;
    const boxHeight = boundingBox.height + padding * 2;

    // Get the dimensions of the viewport
    const viewportWidth = camera.viewport.width;
    const viewportHeight = camera.viewport.height;

    // Calculate the required zoom level to fit the bounding box within the viewport
    const zoomX = viewportWidth / boxWidth;
    const zoomY = viewportHeight / boxHeight;

    // Return the minimum of zoomX and zoomY to ensure the entire bounding box is visible
    return Math.min(zoomX, zoomY);
}

export async function zoomCameraToBoundingBox(camera: Camera, boundingBox: BoundingBox, padding: number = 0, zoomDurationMS: number = 0): Promise<void> {

    // calculate the required zoom level to fit the bounding box within the viewport
    const targetZoom = calculateZoomCameraToBoundingBox(camera, boundingBox, padding);
    camera.pos = boundingBox.center.clone();
    await camera.zoomOverTime(targetZoom, zoomDurationMS);
}