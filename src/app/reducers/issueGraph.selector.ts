import { State, ProjectsState, ComponentsState } from './state';
import { selectProjects } from './projects.selector';
import { createSelector } from '@ngrx/store';
import { selectComponents } from './components.selector';

export const selectIssueGraphs = (state: State) => state.issueGraphs;

const idenititySelector = (state: State) => state;

export const selectIssueGraphData = createSelector(
    idenititySelector,
    (state: State, props: {projectId: string, issueGraphId: string}) => {
        const projectId = props.projectId;
        const issueGraphId = props.issueGraphId;
        const proj = state.projects[projectId];
        if (proj == null) {
            return {
                components: [],
                issues: [],
                graph: {},
            };
        }
        const componentsList = [];
        const componentIds: string[] = proj.components ?? [];
        const locationIdSet = new Set(componentIds);
        componentIds.forEach((componentId) => {
            const component = state.components[componentId];
            if (component != null) {
                componentsList.push(component);
                // add interface ids as issue locations
                Object.keys(component.interfaces).forEach(interfaceId => locationIdSet.add(interfaceId));
            }
        });

        const issueList = [];
        const issueNamespace = state.issueNamespaces[proj.issueNamespace] ?? {};
        Object.keys(issueNamespace).forEach(issueId => {
            const issue = issueNamespace[issueId];
            if (!issue.locations.some(loc => locationIdSet.has(loc.locationId))) {
                return; // No location matches a interface or component id
            }
            // TODO filter relevant issues
            issueList.push(issue);
        });

        return {
            components: componentsList,
            issues: issueList,
            graph: state.issueGraphs[issueGraphId] ?? {},
        };
    }
);
