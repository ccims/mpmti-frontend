import { Action, createReducer, on } from '@ngrx/store';
import { ComponentsState } from './state';
import { DEMO_INITIAL_STATE } from './demo-state';

const componentsReducer = createReducer(
    DEMO_INITIAL_STATE.components,
);

export function reducer(state: ComponentsState | undefined, action: Action) {
    return componentsReducer(state, action);
}
