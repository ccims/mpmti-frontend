import { Action, createReducer, on } from '@ngrx/store';
import { ProjectsState } from './state';
import { DEMO_INITIAL_STATE } from './demo-state';

const projectsReducer = createReducer(
    DEMO_INITIAL_STATE.projects,
);

export function reducer(state: ProjectsState | undefined, action: Action) {
    return projectsReducer(state, action);
}
