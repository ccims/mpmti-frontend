import { Component, ViewChild, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor';
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { Edge, Point, DraggedEdge } from '@ustutt/grapheditor-webcomponent/lib/edge';
import { ProjectInformation, ProjectComponent, SystemArchitectureEdgeListNode, IssueType, IssueRelation } from 'src/app/types/types-interfaces';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Issue } from 'src/app/model/issue';
import { Rect } from '@ustutt/grapheditor-webcomponent/lib/util';
import { GroupBehaviour } from '@ustutt/grapheditor-webcomponent/lib/grouping';
import { DynamicTemplateContext, DynamicNodeTemplate } from '@ustutt/grapheditor-webcomponent/lib/dynamic-templates/dynamic-template';
import { LinkHandle } from '@ustutt/grapheditor-webcomponent/lib/link-handle';
import { IssueGroupContainerParentBehaviour, IssueGroupContainerBehaviour } from './group-behaviours';

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
        const nodeClassSetter = (className: string, node: Node) => {
            if (className === node.type) {
                return true;
            }
            return false;
        };
        graph.setNodeClass = nodeClassSetter;
        minimap.setNodeClass = nodeClassSetter;
        const edgeClassSetter = (className: string, edge: Edge, sourceNode: Node, targetNode: Node) => {
            if (className === edge.type) {
                return true;
            }
            if (className === 'related-to' && edge.type === 'relatedTo') {
                return true;
            }
            if (className === 'issue-relation' && (edge.type === 'relatedTo' || edge.type === 'duplicate' || edge.type === 'dependency')) {
                return true;
            }
            return false;
        };
        graph.setEdgeClass = edgeClassSetter;
        minimap.setEdgeClass = edgeClassSetter;

        const linkHandleCalculation = (edge: Edge|DraggedEdge, sourceHandles: LinkHandle[], source: Node, targetHandles: LinkHandle[], target: Node) => {
            const handles = {
                sourceHandles: sourceHandles,
                targetHandles: targetHandles,
            };
            if (source?.allowedAnchors != null) {
                handles.sourceHandles = sourceHandles.filter(linkHandle => {
                    if (Math.abs(linkHandle.x) > Math.abs(linkHandle.y)) {
                        if (linkHandle.x > 0 && source.allowedAnchors.has('right')) {
                            return true;
                        }
                        if (linkHandle.x < 0 && source.allowedAnchors.has('left')) {
                            return true;
                        }
                    } else {
                        if (linkHandle.y > 0 && source.allowedAnchors.has('bottom')) {
                            return true;
                        }
                        if (linkHandle.y < 0 && source.allowedAnchors.has('top')) {
                            return true;
                        }
                    }
                    return false;
                });
            }
            if (target?.allowedAnchors != null) {
                handles.targetHandles = targetHandles.filter(linkHandle => {
                    if (Math.abs(linkHandle.x) > Math.abs(linkHandle.y)) {
                        if (linkHandle.x > 0 && target.allowedAnchors.has('right')) {
                            return true;
                        }
                        if (linkHandle.x < 0 && target.allowedAnchors.has('left')) {
                            return true;
                        }
                    } else {
                        if (linkHandle.y > 0 && target.allowedAnchors.has('bottom')) {
                            return true;
                        }
                        if (linkHandle.y < 0 && target.allowedAnchors.has('top')) {
                            return true;
                        }
                    }
                    return false;
                });
            }
            return handles;
        };
        graph.calculateLinkHandlesForEdge = linkHandleCalculation;
        minimap.calculateLinkHandlesForEdge = linkHandleCalculation;

        // setup edge drag behaviour
        graph.onCreateDraggedEdge = this.onCreateEdge;
        graph.onDraggedEdgeTargetChange = this.onDraggedEdgeTargetChanged;
        graph.addEventListener('edgeadd', this.onEdgeAdd);
        graph.addEventListener('edgeremove', this.onEdgeRemove);
        graph.addEventListener('edgedrop', this.onEdgeDrop);

        // setup node click behaviour
        graph.addEventListener('nodeclick', this.onNodeClick);

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
            if (event.detail.node.type !== 'issue-group-container') {
                minimap.removeNode(node);
            }
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
        const graph: GraphEditor = this.graph.nativeElement;
        let needRender = false;

        // tslint:disable-next-line: max-line-length
        if (changes.project?.previousValue?.generalInformation?.projectName !== changes.project?.currentValue?.generalInformation?.projectName) {
            this.loadProjectSettings(changes.project?.currentValue?.generalInformation?.projectName);

            // reset graph if project has changed!
            graph.edgeList = [];
            graph.nodeList = [];
            graph.groupingManager.clearAllGroups();
            needRender = true;
            // TODO reset private fields of this class
        }


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

    private onCreateEdge = (edge: DraggedEdge) => {
        const graph: GraphEditor = this.graph.nativeElement;
        const createdFromExisting = edge.createdFrom != null;

        if (createdFromExisting) {
            // only allow delete or dropping at the same node
            const original = graph.getEdge(edge.createdFrom);
            edge.validTargets.clear();
            edge.validTargets.add(original.target.toString());
            return edge;
        }

        const sourceNode = graph.getNode(edge.source);
        if (sourceNode.type === 'component') {
            // update edge properties
            edge.type = 'interface';
            edge.dragHandles = []; // no drag handles

            // update valid targets
            edge.validTargets.clear();
            // allow only interfaces as targets
            graph.nodeList.forEach(node => {
                if (node.type === 'interface') {
                    edge.validTargets.add(node.id.toString());
                }
            });
            // allow only new targets
            graph.getEdgesBySource(sourceNode.id).forEach(existingEdge => {
                edge.validTargets.delete(existingEdge.target.toString());
            });
        }
        return edge;
    }

    private onDraggedEdgeTargetChanged = (edge: DraggedEdge, sourceNode: Node, targetNode: Node) => {
        if (sourceNode.type === 'component') {
            if (targetNode?.type === 'interface') {
                edge.type = 'interface-connect';
                edge.markerEnd = {
                    template: 'interface-connector',
                    relativeRotation: 0,
                };
                delete edge.dragHandles; // default drag handle
            } else {
                // target was null/create a new interface
                edge.type = 'interface';
                delete edge.markerEnd;
                edge.dragHandles = []; // no drag handles
            }
        }
        return edge;
    }

    private onEdgeAdd = (event: CustomEvent) => {
        if (event.detail.eventSource === 'API') {
            return;
        }
        const edge: Edge = event.detail.edge;
        if (edge.type === 'interface-connect') {
            event.preventDefault(); // cancel edge creation
            // TODO create actual edge in the components data structure
            // and then update the graph via the api
            console.log('TODO: Create new interface connection', edge);
        }
    }

    private onEdgeDrop = (event: CustomEvent) => {
        if (event.detail.eventSource === 'API') {
            return;
        }
        const edge: DraggedEdge = event.detail.edge;
        if (edge.createdFrom != null) {
            return;
        }
        if (edge.type === 'interface') {
            // TODO add interface to the component data structure
            console.log('TODO: Create new interface for the component', event.detail.sourceNode, 'At position', edge.currentTarget);
        }
    }

    private onEdgeRemove = (event: CustomEvent) => {
        if (event.detail.eventSource === 'API') {
            return;
        }
        const edge: Edge = event.detail.edge;
        if (edge.type === 'interface-connect') {
            event.preventDefault(); // cancel edge deletion
            // TODO remove actual edge in the components data structure
            // and then update the graph via the api
            console.log('TODO: Remove existing interface connection', edge);
        }
    }

    private onNodeClick = (event: CustomEvent) => {
        event.preventDefault(); // prevent node selection
        const node = event.detail.node;

        if (node.type === 'component') {
            // TODO show a edit component dialog (or similar)
            console.log('Clicked on component:', node);
            return;
        }
        if (node.type === 'interface') {
            // TODO show a edit interface dialog (or similar)
            console.log('Clicked on interface:', node);
            return;
        }
        console.log('Clicked on another type of noode:', node);
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
        });

        this.updateIssueEdges(graph, relatedNodesToIssues);

        graph.completeRender();
    }

    private addIssueGroupContainer(graph: GraphEditor, node: Node) {
        const gm = graph.groupingManager;
        gm.markAsTreeRoot(node.id);
        graph.groupingManager.setGroupBehaviourOf(node.id, new IssueGroupContainerParentBehaviour());

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
        gm.setGroupBehaviourOf(issueGroupContainerNode.id, new IssueGroupContainerBehaviour());
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

            issueSet.forEach(issueId => {
                if (!this.issueToGraphNode.has(issueId)) {
                    this.issueToGraphNode.set(issueId, new Set<string>());
                }
                this.issueToGraphNode.get(issueId).add(nodeId);
            });
        } else {
            if (issueGroupNode != null) {
                gm.removeNodeFromGroup(issueGroupContainer.id, nodeId);
                graph.removeNode(issueGroupNode);
            }
        }
    }

    private updateIssueEdges(graph: GraphEditor, relatedNodeToIssues: Map<string, Set<string>>) {

        relatedNodeToIssues.forEach((issueSet, relatedNodeId) => {
            graph.groupingManager.getAllChildrenOf(relatedNodeId).forEach(sourceNodeId => {
                const sourceNode = graph.getNode(sourceNodeId);
                if (sourceNode?.type === 'issue-group-container') {
                    return;
                }
                const issues = sourceNode?.issues ?? new Set<string>();
                const oldEdges = graph.getEdgesBySource(sourceNodeId);
                const relatedToTargets = new Set<string>();
                const duplicateOfTargets = new Set<string>();
                const dependsOnTargets = new Set<string>();

                // fill target sets
                issues.forEach(issueId => {
                    const issue = this.issuesById.get(issueId);
                    issue.getLinkedIssues().forEach(linked => {
                        const targetIssueId = linked.issueID;
                        const targetNodeIds = this.issueToGraphNode.get(targetIssueId);
                        if (linked.relation === IssueRelation.DEPENDS) {
                            targetNodeIds.forEach(targetNodeId => {
                                if (targetNodeId === sourceNodeId || targetNodeId === relatedNodeId) {
                                    return; // dont generate edges to the same node or to the current component
                                }
                                dependsOnTargets.add(targetNodeId);
                            });
                        } else if (linked.relation === IssueRelation.DUPLICATES) {
                            targetNodeIds.forEach(targetNodeId => {
                                if (targetNodeId === sourceNodeId || targetNodeId === relatedNodeId) {
                                    return; // dont generate edges to the same node or to the current component
                                }
                                duplicateOfTargets.add(targetNodeId);
                            });
                        } else {
                            targetNodeIds.forEach(targetNodeId => {
                                if (targetNodeId === sourceNodeId || targetNodeId === relatedNodeId) {
                                    return; // dont generate edges to the same node or to the current component
                                }
                                relatedToTargets.add(targetNodeId);
                            });
                        }
                    });
                });

                // remove unused edges
                oldEdges.forEach(edge => {
                    if (edge.type === 'relatedTo') {
                        if (relatedToTargets.has(edge.target as string)) {
                            relatedToTargets.delete(edge.target as string);
                        } else {
                            graph.removeEdge(edge);
                        }
                    }
                    if (edge.type === 'duplicate') {
                        if (duplicateOfTargets.has(edge.target as string)) {
                            duplicateOfTargets.delete(edge.target as string);
                        } else {
                            graph.removeEdge(edge);
                        }
                    }
                    if (edge.type === 'dependency') {
                        if (dependsOnTargets.has(edge.target as string)) {
                            dependsOnTargets.delete(edge.target as string);
                        } else {
                            graph.removeEdge(edge);
                        }
                    }
                });

                // add new edges
                relatedToTargets.forEach(targetId => {
                    graph.addEdge({
                        source: sourceNodeId,
                        target: targetId,
                        type: 'relatedTo',
                        markerEnd: {
                            template: 'arrow',
                            relativeRotation: 0,
                        },
                        dragHandles: []
                    });
                });
                duplicateOfTargets.forEach(targetId => {
                    graph.addEdge({
                        source: sourceNodeId,
                        target: targetId,
                        type: 'duplicate',
                        markerEnd: {
                            template: 'arrow',
                            relativeRotation: 0,
                        },
                        dragHandles: []
                    });
                });
                dependsOnTargets.forEach(targetId => {
                    graph.addEdge({
                        source: sourceNodeId,
                        target: targetId,
                        type: 'dependency',
                        markerEnd: {
                            template: 'arrow',
                            relativeRotation: 0,
                        },
                        dragHandles: []
                    });
                });
            });
        });

    }
}
