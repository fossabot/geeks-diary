import { animate, state, style, transition, trigger } from '@angular/animations';


export class AnimationCurves {
    static STANDARD_CURVE = 'cubic-bezier(0.4,0.0,0.2,1)';
    static DECELERATION_CURVE = 'cubic-bezier(0.0,0.0,0.2,1)';
    static ACCELERATION_CURVE = 'cubic-bezier(0.4,0.0,1,1)';
    static SHARP_CURVE = 'cubic-bezier(0.4,0.0,0.6,1)';
}


export class AnimationDurations {
    static COMPLEX = '375ms';
    static ENTERING = '275ms';
    static EXITING = '245ms';
}

export const flyInFromBottomAnimation = trigger('flyInFromBottom', [
    state('active', style({
        transform: 'translateY(0)',
        opacity: 1
    })),
    transition('disable => active', [
        animate(`${AnimationDurations.ENTERING} ${AnimationCurves.DECELERATION_CURVE}`)
    ]),
    transition('active => disable', [
        animate(`${AnimationDurations.EXITING} ${AnimationCurves.ACCELERATION_CURVE}`)
    ])
]);
