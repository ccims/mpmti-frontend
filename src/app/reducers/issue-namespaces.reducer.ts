import { Action, createReducer, on } from '@ngrx/store';
import { IssueNamespacesState } from './state';
import { DEMO_INITIAL_STATE } from './demo-state';

const issueNamespacesReducer = createReducer(
    DEMO_INITIAL_STATE.issueNamespaces,
);

export function reducer(state: IssueNamespacesState | undefined, action: Action) {
    return issueNamespacesReducer(state, action);
}
