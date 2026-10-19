let _ACTION_ID = 0;

export function nextActionId(): number {
    return _ACTION_ID++;
}