import external from './../externalModules.js';
import BaseTool from './base/BaseTool.js';
import MouseCursor from '../util/MouseCursor.js';

/**
 * @public
 * @class PanTool
 * @memberof Tools
 *
 * @classdesc Tool for panning the image.
 * @extends Tools.Base.BaseTool
 */
export default class PanTool extends BaseTool {
  constructor(configuration = {}) {
    const defaultConfig = {
      name: 'Pan',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      configuration: {
        svgCursor: panCursor,
      },
    };
    const initialConfiguration = Object.assign(defaultConfig, configuration);

    super(initialConfiguration);

    this.initialConfiguration = initialConfiguration;
    // Touch
    this.touchDragCallback = this._dragCallback.bind(this);
    // Mouse
    this.mouseDragCallback = this._dragCallback.bind(this);
  }

  _dragCallback(evt) {
    const eventData = evt.detail;
    const { element, viewport } = eventData;

    const translation = this._getTranslation(eventData);

    this._applyTranslation(viewport, translation);
    external.cornerstone.setViewport(element, viewport);
  }

  _getTranslation(eventData) {
    const { viewport, image, deltaPoints } = eventData;

    let widthScale = viewport.scale;
    let heightScale = viewport.scale;

    if (image.rowPixelSpacing < image.columnPixelSpacing) {
      widthScale *= image.columnPixelSpacing / image.rowPixelSpacing;
    } else if (image.columnPixelSpacing < image.rowPixelSpacing) {
      heightScale *= image.rowPixelSpacing / image.columnPixelSpacing;
    }

    return {
      x: deltaPoints.page.x / widthScale,
      y: deltaPoints.page.y / heightScale,
    };
  }

  _applyTranslation(viewport, translation) {
    viewport.translation.x += translation.x;
    viewport.translation.y += translation.y;
  }
}

const panCursor = new MouseCursor(
  `<svg
    data-icon="pan" role="img" xmlns="http://www.w3.org/2000/svg"
    width="32" height="32" viewBox="0 0 1792 1792"
  >
    <path fill="#ffffff" d="M1411 541l-355 355 355 355 144-144q29-31 70-14 39 17
      39 59v448q0 26-19 45t-45 19h-448q-42 0-59-40-17-39 14-69l144-144-355-355-355
      355 144 144q31 30 14 69-17 40-59 40h-448q-26 0-45-19t-19-45v-448q0-42 40-59
      39-17 69 14l144 144 355-355-355-355-144 144q-19 19-45 19-12
      0-24-5-40-17-40-59v-448q0-26 19-45t45-19h448q42 0 59 40 17 39-14 69l-144
      144 355 355 355-355-144-144q-31-30-14-69 17-40 59-40h448q26 0 45 19t19
      45v448q0 42-39 59-13 5-25 5-26 0-45-19z"
    />
  </svg>`
);
