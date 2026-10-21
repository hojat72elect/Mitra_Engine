import {Transform} from '../math';

export function blendGlobalTransform(oldTx: Transform, newTx: Transform, blend: number, target?: Transform): Transform {
    let interpolatedPos = newTx.globalPos;
    let interpolatedScale = newTx.globalScale;
    let interpolatedRotation = newTx.globalRotation;

    interpolatedPos = newTx.globalPos.scale(blend).add(oldTx.globalPos.scale(1.0 - blend));
    interpolatedScale = newTx.globalScale.scale(blend).add(oldTx.globalScale.scale(1.0 - blend));
    // Rotational lerp https://stackoverflow.com/a/30129248
    const cosine = (1.0 - blend) * Math.cos(oldTx.globalRotation) + blend * Math.cos(newTx.globalRotation);
    const sine = (1.0 - blend) * Math.sin(oldTx.globalRotation) + blend * Math.sin(newTx.globalRotation);
    interpolatedRotation = Math.atan2(sine, cosine);

    const tx = target ?? new Transform();
    tx.setTransform(interpolatedPos, interpolatedRotation, interpolatedScale);
    return tx;
}
