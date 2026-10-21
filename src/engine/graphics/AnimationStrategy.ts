
export enum AnimationStrategy {
    /**
     * Animation ends without displaying anything
     */
    End = 'end',
    /**
     * Animation loops to the first frame after the last frame
     */
    Loop = 'loop',
    /**
     * Animation plays to the last frame, then backwards to the first frame, then repeats
     */
    PingPong = 'pingpong',
    /**
     * Animation ends stopping on the last frame
     */
    Freeze = 'freeze'
}
