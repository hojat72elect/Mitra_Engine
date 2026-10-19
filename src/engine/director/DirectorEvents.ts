import {DirectorNavigationEvent} from "./DirectorNavigationEvent";

export interface DirectorEvents {
    navigationstart: DirectorNavigationEvent;
    navigation: DirectorNavigationEvent;
    navigationend: DirectorNavigationEvent;
}

export const DirectorEvents = {
    NavigationStart: 'navigationstart',
    Navigation: 'navigation',
    NavigationEnd: 'navigationend'
} as const;