import {SeparationInfo} from "./SeparationInfo";
import {LineSegment} from "../../math/LineSegment.ts";

/**
 * Deep copies separation info out of the per frame {@apilink SeparatingAxis.SeparationPool} so it can outlive the frame
 * @param info
 */
export function cloneSeparationInfo(info: SeparationInfo): SeparationInfo {
    const copy = new SeparationInfo();
    copy.collider = info.collider;
    copy.separation = info.separation;
    copy.axis = info.axis ? info.axis.clone() : copy.axis;
    copy.localAxis = info.localAxis ? info.localAxis.clone() : undefined;
    copy.side = info.side ? new LineSegment(info.side.begin.clone(), info.side.end.clone()) : undefined;
    copy.localSide = info.localSide ? new LineSegment(info.localSide.begin.clone(), info.localSide.end.clone()) : undefined;
    copy.sideId = info.sideId;
    copy.point = info.point ? info.point.clone() : copy.point;
    copy.localPoint = info.localPoint ? info.localPoint.clone() : undefined;
    return copy;
}