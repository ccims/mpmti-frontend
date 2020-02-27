import { Component, ViewChild, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor';
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { Edge, Point } from '@ustutt/grapheditor-webcomponent/lib/edge';
import { ProjectInformation, ProjectComponent, SystemArchitectureEdgeListNode } from 'src/app/types/types-interfaces';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Issue } from 'src/app/model/issue';
import { Rect } from '@ustutt/grapheditor-webcomponent/lib/util';

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
                graph.addNode({
                    id: comp.uuid,
                    ...position,
                    title: comp.componentName,
                    type: 'component',
                    data: comp,
                });
                comp.interfaces.forEach(inter => {
                    const position: Point = this.nodePositions?.[inter.uuid] ?? {x: 150, y: 0};
                    graph.addNode({
                        id: inter.uuid,
                        ...position,
                        title: inter.interfaceName,
                        type: 'interface',
                        data: inter,
                    });
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

}
