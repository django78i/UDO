import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';

/**
 * @hidden
 * This class overrides the default Angular gesture config.
 */
@Injectable()
export class IonicGestureConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    let mc;
    if (window) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
       mc = new (<any>window).Hammer(element);

      for (const eventName in this.overrides) {
        if (eventName) {
          mc.get(eventName).set(this.overrides[eventName]);
        }
      }
    }

    return mc;
  }
}
