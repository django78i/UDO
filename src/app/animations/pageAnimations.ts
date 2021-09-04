import { AnimationController, Animation } from '@ionic/angular';

export const enterAnimation = (baseEl: HTMLElement, opts?: any): Animation => {
    const DURATION = 1000;
    const animCtrl = new AnimationController();
    if (opts.direction === 'forward') {
        console.log(opts.direction);
        // Fade in the next page
        return animCtrl.create()
            .addElement(opts.enteringEl)
            .duration(DURATION)
            .easing('ease-in')
            .fromTo('opacity', 0, 1);
    } else if (opts.direction === 'back') {
        // Fade in the previous page
        const rootAnimation = animCtrl.create()
            .addElement(opts.enteringEl)
            .duration(DURATION)
            .easing('ease-out')
            .fromTo('opacity', 0, 1);

        // Fade out the current top page
        const leavingAnim = animCtrl.create()
            .addElement(opts.leavingEl)
            .duration(DURATION)
            .easing('ease-out')
            .fromTo('opacity', 1, 0);

        // Chain both animations
        return animCtrl.create().addAnimation([rootAnimation, leavingAnim]);
    }
};