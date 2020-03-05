import { Component, ViewChild, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor';
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { Edge, Point } from '@ustutt/grapheditor-webcomponent/lib/edge';
import { ProjectInformation, ProjectComponent, SystemArchitectureEdgeListNode, IssueType } from 'src/app/types/types-interfaces';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Issue } from 'src/app/model/issue';
import { Rect } from '@ustutt/grapheditor-webcomponent/lib/util';
import { GroupBehaviour } from '@ustutt/grapheditor-webcomponent/lib/grouping';
import { DynamicTemplateContext, DynamicNodeTemplate } from '@ustutt/grapheditor-webcomponent/lib/dynamic-templates/dynamic-template';
import { LinkHandle } from '@ustutt/grapheditor-webcomponent/lib/link-handle';

@Component({
    selector: 'app-issue-graph',
    templateUrl: './issue-graph.component.html',
    styleUrls: ['./issue-graph.component.css']
})
export class IssueGraphComponent implements OnChanges, OnInit {

    @ViewChild('graph', { static: true }) graph;
    @ViewChild('minimap', { static: true }) minimap;

    currentVisibleArea: Rect = { x: 0, y: 0, width: 1, height: 1 };

    @Input() project: ProjectInformation;
    @Input() components: ProjectComponent[];
    @Input() issues: Issue[];
    @Input() systemArchitectureGraphEdges: SystemArchitectureEdgeListNode[];

    private graphInitialized = false;

    private saveNodePositionsSubject = new Subject<null>();
    private saveNodePositionsSubscription: Subscription;
    private nodePositions: {
        [prop: string]: Point;
    } = {};

    private issuesById: Map<string, Issue> = new Map();
    private issueToRelatedNode: Map<string, Set<string>> = new Map();
    private issueToGraphNode: Map<string, Set<string>> = new Map();

    constructor() { }

    ngOnInit() {
        this.initGraph();
    }

    initGraph() {
        if (this.graphInitialized) {
            return;
        }
        this.graphInitialized = true;
        const graph: GraphEditor = this.graph.nativeElement;
        const minimap: GraphEditor = this.minimap.nativeElement;
        const classSetter = (className, node) => {
            if (className === node.type) {
                return true;
            }
            return false;
        };
        graph.setNodeClass = classSetter;
        minimap.setNodeClass = classSetter;

        graph.dynamicTemplateRegistry.addDynamicTemplate('issue-group-container', {
            renderInitialTemplate(g, grapheditor: GraphEditor, context: DynamicTemplateContext<Node>): void {
                // template is empty
                g.append('circle').attr('x', 0).attr('y', 0).attr('r', 1).style('opacity', 0);
            },
            updateTemplate(g, grapheditor: GraphEditor, context: DynamicTemplateContext<Node>): void {
                // template is empty
            },
            getLinkHandles(g, grapheditor: GraphEditor): LinkHandle[] {
                return []; // template has no link handles
            }
        } as DynamicNodeTemplate);

        graph.addEventListener('nodedragend', (event: CustomEvent) => {
            const node = event.detail.node;
            // store node positioning information
            this.nodePositions[node.id] = {
                x: node.x,
                y: node.y,
            };
            this.saveNodePositionsSubject.next();
        });

        graph.addEventListener('nodeadd', (event: CustomEvent) => {
            if (event.detail.node.type === 'issue-group-container') {
                return;
            }
            const node = event.detail.node;
            minimap.addNode(node);
        });
        graph.addEventListener('noderemove', (event: CustomEvent) => {
            const node = event.detail.node;
            minimap.removeNode(node);
            // clear stored information
            delete this.nodePositions[node.id];
            this.saveNodePositionsSubject.next();
        });

        graph.addEventListener('edgeadd', (event: CustomEvent) => {
            minimap.addEdge(event.detail.edge);
        });
        graph.addEventListener('edgeremove', (event: CustomEvent) => {
            minimap.removeEdge(event.detail.edge);
        });
        graph.addEventListener('render', (event: CustomEvent) => {
            if (event.detail.rendered === 'complete') {
                minimap.completeRender();
                minimap.zoomToBoundingBox();
            } else if (event.detail.rendered === 'text') {
                // ignore for minimap
            } else if (event.detail.rendered === 'classes') {
                minimap.updateNodeClasses();
            } else if (event.detail.rendered === 'positions') {
                minimap.updateGraphPositions();
                minimap.zoomToBoundingBox();
            }
        });
        graph.addEventListener('zoomchange', (event: CustomEvent) => {
            this.currentVisibleArea = event.detail.currentViewWindow;
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initGraph();
        // tslint:disable-next-line: max-line-length
        if (changes.project?.previousValue?.generalInformation?.projectName !== changes.project?.currentValue?.generalInformation?.projectName) {
            this.loadProjectSettings(changes.project?.currentValue?.generalInformation?.projectName);
        }

        const graph: GraphEditor = this.graph.nativeElement;
        const minimap: GraphEditor = this.minimap.nativeElement; // TODO remove once minimap works with events only...

        let needRender = false;

        if (changes.components != null) {
            needRender = true;
            this.components.forEach(comp => {
                const position: Point = this.nodePositions?.[comp.uuid] ?? {x: 0, y: 0};
                const componentNode = {
                    id: comp.uuid,
                    ...position,
                    title: comp.componentName,
                    type: 'component',
                    data: comp,
                    relatedIssues: new Set<string>(),
                };
                graph.addNode(componentNode);
                this.addIssueGroupContainer(graph, componentNode);
                comp.interfaces.forEach(inter => {
                    const position: Point = this.nodePositions?.[inter.uuid] ?? {x: 150, y: 0};
                    const interfaceNode = {
                        id: inter.uuid,
                        ...position,
                        title: inter.interfaceName,
                        type: 'interface',
                        data: inter,
                        relatedIssues: new Set<string>(),
                    };
                    graph.addNode(interfaceNode);
                    this.addIssueGroupContainer(graph, interfaceNode);
                    const edge = {
                        source: comp.uuid,
                        target: inter.uuid,
                        type: 'interface',
                        dragHandles: []
                    };
                    graph.addEdge(edge);
                    minimap.addEdge(edge);
                });
            });
        }

        if (changes.systemArchitectureGraphEdges != null) {
            needRender = true;
            this.systemArchitectureGraphEdges.forEach(graphEdges => {
                graphEdges.edgesToInterfaces.forEach(toInterface => {
                    const edge = {
                        source: graphEdges.componentUuid,
                        target: toInterface,
                        type: 'interface-connect',
                        markerEnd: {
                            template: 'interface-connector',
                            relativeRotation: 0,
                        }
                    };
                    graph.addEdge(edge);
                    minimap.addEdge(edge);
                });
                graphEdges.edgesToComponents.forEach(toComponent => {
                    const edge = {
                        source: graphEdges.componentUuid,
                        target: toComponent,
                        type: 'component-connect',
                        markerEnd: {
                            template: 'arrow',
                            relativeRotation: 0,
                        }
                    };
                    graph.addEdge(edge);
                    minimap.addEdge(edge);
                });
            });
        }

        if (changes.issues != null) {
            this.updateIssueNodes();
        }

        if (needRender) {
            graph.completeRender();
            graph.zoomToBoundingBox();
        }
    }

    private unsubscribe() {
        this.saveNodePositionsSubscription?.unsubscribe();
    }

    private loadProjectSettings(project) {
        const key = `MPMTI-Project_${project}`;
        this.unsubscribe();
        const data = project != null ? localStorage.getItem(key) : null;
        if (data != null && data !== '') {
            this.nodePositions = JSON.parse(data);
        } else {
            this.nodePositions = {};
        }
        if (project != null) {
            this.saveNodePositionsSubscription = this.saveNodePositionsSubject.pipe(
                debounceTime(300)
            ).subscribe(() => {
                if (this.nodePositions != null) {
                    const newData = JSON.stringify(this.nodePositions);
                    localStorage.setItem(key, newData);
                }
            });
        }

        this.issuesById = new Map();
        this.issueToRelatedNode = new Map();
        this.issueToGraphNode = new Map();
    }


    private updateIssueNodes() {
        const relatedNodesToIssues = new Map<string, Set<string>>();
        this.issues.forEach(issue => {
            this.issuesById.set(issue.id, issue);
            const relatedNodes = new Set<string>();
            issue.getLocations().forEach(loc => {
                const relatedNode = loc.interfaceID ?? loc.componentID;
                relatedNodes.add(relatedNode);
                if (!relatedNodesToIssues.has(relatedNode)) {
                    relatedNodesToIssues.set(relatedNode, new Set());
                }
                relatedNodesToIssues.get(relatedNode).add(issue.id);
            });
            this.issueToRelatedNode.set(issue.id, relatedNodes);
        });

        const graph: GraphEditor = this.graph.nativeElement;
        const minimap: GraphEditor = this.minimap.nativeElement; // TODO remove once minimap works with events only...

        relatedNodesToIssues.forEach((issueSet, nodeId) => {
            const node = graph.getNode(nodeId);
            node.relatedIssues = issueSet;
            const undecided = new Set<string>();
            const bugs = new Set<string>();
            const features = new Set<string>();
            issueSet.forEach(issueId => {
                const issue = this.issuesById.get(issueId);
                if (issue.getType() === IssueType.BUG) {
                    bugs.add(issueId);
                } else if (issue.getType() === IssueType.FEATURE_REQUEST) {
                    features.add(issueId);
                } else {
                    undecided.add(issueId);
                }
            });
            this.updateIssueGroupNode(graph, `${nodeId}__undecided`, nodeId, 'issue-undecided', undecided);
            this.updateIssueGroupNode(graph, `${nodeId}__bug`, nodeId, 'issue-bug', bugs);
            this.updateIssueGroupNode(graph, `${nodeId}__feature`, nodeId, 'issue-feature', features);

            const issueGroupNodes = [];
            if (undecided.size > 0) {
                issueGroupNodes.push(`${nodeId}__undecided`);
            }
            if (bugs.size > 0) {
                issueGroupNodes.push(`${nodeId}__bug`);
            }
            if (features.size > 0) {
                issueGroupNodes.push(`${nodeId}__feature`);
            }

            graph.completeRender();
        });
    }

    private addIssueGroupContainer(graph: GraphEditor, node: Node) {
        const gm = graph.groupingManager;
        gm.markAsTreeRoot(node.id);
        const groupBehaviour = graph.groupingManager.getGroupBehaviourOf(node.id);
        groupBehaviour.moveChildrenAlongGoup = true;
        groupBehaviour.childNodePositions = new Map();

        const distance = (x, y, x2, y2) => {
            return ((x - x2) ** 2) + ((y - y2) ** 2);
        };

        groupBehaviour.beforeNodeMove = function (this: GroupBehaviour, group: string, childGroup: string, groupNode: Node, childNode: Node, newPosition: Point, graphEditor: GraphEditor) {            // calculate groupNode dimensions
            const width = groupNode.type === 'interface' ? 10 : 100;
            const height = groupNode.type === 'interface' ? 10 : 60;
            // find nearest side
            let best = 'bottom';
            if (newPosition != null && (newPosition.x !== 0 || newPosition.y !== 0)) {
                let bestDistance = distance(newPosition.x, newPosition.y, groupNode.x, groupNode.y + (height / 2) + 25);
                const rightDistance = distance(newPosition.x, newPosition.y, groupNode.x + (width / 2) + 30, groupNode.y);
                const leftDistance = distance(newPosition.x, newPosition.y, groupNode.x - (width / 2) - 30, groupNode.y);
                const topDistance = distance(newPosition.x, newPosition.y, groupNode.x, groupNode.y - (height / 2) - 25);
                if (rightDistance < bestDistance) {
                    bestDistance = rightDistance;
                    best = 'right';
                }
                if (leftDistance < bestDistance) {
                    bestDistance = leftDistance;
                    best = 'left';
                }
                if (topDistance < bestDistance) {
                    bestDistance = topDistance;
                    best = 'top';
                }
            }
            // set position
            if (best === 'bottom') {
                this.childNodePositions.set(childGroup, {x: 0, y: (height / 2) + 25});
                if (childNode != null && (newPosition == null || (newPosition.x === 0 && newPosition.y === 0))) {
                    childNode.x = groupNode.x;
                    childNode.y = groupNode.y + (height / 2) + 25;
                }
            }
            if (best === 'top') {
                this.childNodePositions.set(childGroup, {x: 0, y: -(height / 2) - 25});
                if (childNode != null && (newPosition == null || (newPosition.x === 0 && newPosition.y === 0))) {
                    childNode.x = groupNode.x;
                    childNode.y = groupNode.y - (height / 2) - 25;
                }
            }
            if (best === 'right') {
                this.childNodePositions.set(childGroup, {x: (width / 2) + 30, y: 0});
                if (childNode != null && (newPosition == null || (newPosition.x === 0 && newPosition.y === 0))) {
                    childNode.x = groupNode.x + (width / 2) + 30;
                    childNode.y = groupNode.y;
                }
            }
            if (best === 'left') {
                this.childNodePositions.set(childGroup, {x: -(width / 2) - 30, y: 0});
                if (childNode != null && (newPosition == null || (newPosition.x === 0 && newPosition.y === 0))) {
                    childNode.x = groupNode.x - (width / 2) - 30;
                    childNode.y = groupNode.y;
                }
            }
            if (childNode != null) {
                childNode.position = best;
                // FIXME use better function once the group behaviour interface allows other functions...
                graphEditor.groupingManager.getGroupBehaviourOf(childGroup)?.afterNodeJoinedGroup(childGroup, null, childNode, null, graphEditor);
            }
        };

        const issueGroupContainerNode = {
            id: `${node.id}__issue-group-container`,
            type: 'issue-group-container',
            dynamicTemplate: 'issue-group-container',
            x: 0,
            y: 0,
            position: 'bottom',
            issueGroupNodes: new Set<string>(),
        };
        graph.addNode(issueGroupContainerNode);
        gm.addNodeToGroup(node.id, issueGroupContainerNode.id);
        const containerGroupBehaviour = gm.getGroupBehaviourOf(issueGroupContainerNode.id);
        containerGroupBehaviour.captureChildMovement = true;
        containerGroupBehaviour.moveChildrenAlongGoup = true;
        containerGroupBehaviour.childNodePositions = new Map();

        containerGroupBehaviour.afterNodeJoinedGroup = function(this: GroupBehaviour, group: string, childGroup: string, groupNode: Node, childNode: Node, graphEditor: GraphEditor) {
            const parent = graphEditor.groupingManager.getTreeParentOf(group);
            const children = graphEditor.groupingManager.getChildrenOf(group);

            const places = children.size - 1;
            const startOffset = places > 0 ? (places / 2) : 0;
            let xOffset = 0;
            let yOffset = 0;

            if (groupNode.position === 'bottom' || groupNode.position === 'top') {
                xOffset = startOffset * 45;
            }
            if (groupNode.position === 'right' || groupNode.position === 'left') {
                yOffset = -startOffset * 35;
            }

            // pre sorted list
            [
                `${parent}__undecided`,
                `${parent}__bug`,
                `${parent}__feature`,
            ].forEach(childId => {
                if (!children.has(childId)) {
                    return;
                }
                this.childNodePositions.set(childId, {x: xOffset, y: yOffset});
                const child = graphEditor.getNode(childId);
                if (child != null) {
                    child.x = groupNode.x + xOffset;
                    child.y = groupNode.y + yOffset;
                }
                if (groupNode.position === 'bottom' || groupNode.position === 'top') {
                    xOffset -= 45;
                }
                if (groupNode.position === 'right' || groupNode.position === 'left') {
                    yOffset += 35;
                }
            });
        };
    }

    private updateIssueGroupNode(graph: GraphEditor, nodeId: string, relatedNodeId: string, issueType: string, issueSet: Set<string>) {
        const gm = graph.groupingManager;
        let issueGroupNode = graph.getNode(nodeId);
        const issueGroupContainer = graph.getNode(`${relatedNodeId}__issue-group-container`);
        if (issueSet.size > 0) {
            if (issueGroupNode == null) {
                issueGroupNode = {
                    id: nodeId,
                    type: issueType,
                    x: 0,
                    y: 0,
                };
                graph.addNode(issueGroupNode);
                gm.addNodeToGroup(issueGroupContainer.id, nodeId);
            }
            issueGroupNode.issues = issueSet;
            issueGroupNode.issueCount = issueSet.size > 99 ? '99+' : issueSet.size;
        } else {
            if (issueGroupNode != null) {
                gm.removeNodeFromGroup(issueGroupContainer.id, nodeId);
                graph.removeNode(issueGroupNode);
            }
        }
    }
}
