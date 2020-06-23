import { State, ProjectsState, IssuesState } from './state';
import { selectProjects } from './projects.selector';
import { createSelector } from '@ngrx/store';

export const selectIssues = (state: State) => state.issues;

export const selectIssuesState = createSelector(
    selectIssues,
    (issues: IssuesState) => {
        return issues;
    }
);
