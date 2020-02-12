import { Component, ViewChild, Input, OnChanges, OnInit } from '@angular/core';
import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor';
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { Edge } from '@ustutt/grapheditor-webcomponent/lib/edge';
import { ProjectComponent, ProjectComponentInterface, SystemArchitectureEdgeListNode } from 'src/app/types/types-interfaces';

@Component({
    selector: 'app-issue-graph',
    templateUrl: './issue-graph.component.html',
    styleUrls: ['./issue-graph.component.css']
})
export class IssueGraphComponent implements OnChanges, OnInit {

    @ViewChild('graph', { static: true }) graph;

    @Input() components: ProjectComponent[];
    @Input() componentInterfaces: ProjectComponentInterface[];
    @Input() systemArchitectureGraphEdges: SystemArchitectureEdgeListNode[];

    constructor() { }

    ngOnInit() {
        const graph: GraphEditor = this.graph.nativeElement;
        graph.setNodeClass = (className, node) => {
            if (className === node.type) {
                return true;
            }
            return false;
        };
    }

    ngOnChanges() {
        const nodes: Node[] = [];
        this.components.forEach(comp => {
            nodes.push({
                id: comp.componentName,
                x: 0,
                y: 0,
                title: comp.componentName,
                type: 'component',
                data: comp,
            });
        });

        this.componentInterfaces.forEach(inter => {
            nodes.push({
                id: inter.interfaceName,
                x: 150,
                y: 0,
                title: inter.interfaceName,
                type: 'interface',
                data: inter,
            });
        });

        const edges: Edge[] = [];
        this.systemArchitectureGraphEdges.forEach(graphEdges => {
            graphEdges.edgesToInterfaces.forEach(toInterface => {
                edges.push({
                    source: graphEdges.componentUuid,
                    target: toInterface,
                    type: 'interface-connect',
                    markerEnd: {
                        template: 'arrow',
                        rotate: { relativeAngle: 0 },
                    }
                });
            });
            graphEdges.edgesToComponents.forEach(toComponent => {
                edges.push({
                    source: graphEdges.componentUuid,
                    target: toComponent,
                    type: 'component-connect',
                    markerEnd: {
                        template: 'arrow',
                        rotate: { relativeAngle: 0 },
                    }
                });
            });
        });

        const graph: GraphEditor = this.graph.nativeElement;
        graph.setNodes(nodes);
        graph.setEdges(edges, true);
    }

}
