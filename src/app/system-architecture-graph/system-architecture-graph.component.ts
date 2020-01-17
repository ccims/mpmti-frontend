import { Component, OnInit, Input } from '@angular/core';
import { Project, ProjectComponent, ProjectComponentInterface, SystemArchitectureEdgeListNode } from '../types/types-interfaces';

@Component({
  selector: 'app-system-architecture-graph',
  templateUrl: './system-architecture-graph.component.html',
  styleUrls: ['./system-architecture-graph.component.css']
})
export class SystemArchitectureGraphComponent implements OnInit {

  @Input()
  private project: Project;
  private components: ProjectComponent[]; // TODO ask backend for list of project's components
  private componentInterfaces: ProjectComponentInterface[]; // TODO ask backend for list of project's component interfaces
  private systemArchitectureGraphEdges: SystemArchitectureEdgeListNode[]; // TODO ask backend for system architecture edge list

  constructor() { }

  ngOnInit() {
    this.components = [
      {
        componentName: 'shopping-cart-service',
        interfaces: []
      },
      {
        componentName: 'order-service',
        interfaces: []
      },
      {
        componentName: 'shipping-service',
        interfaces: []
      },
      {
        componentName: 'payment-service',
        interfaces: []
      }
    ];
    this.componentInterfaces = [
      { interfaceName: 'order-service-interface' },
      { interfaceName: 'shipping-service-interface' },
      { interfaceName: 'payment-service-interface' }
    ];
    this.systemArchitectureGraphEdges = [
      {
        componentName: 'shopping-cart-service',
        edgesToInterfaces: [ 'order-service-interface' ],
        edgesToComponents: []
      },
      {
        componentName: 'order-service',
        edgesToInterfaces: [ 'payment-service-interface' ],
        edgesToComponents: []
      },
      {
        componentName: 'order-service',
        edgesToInterfaces: [ 'shipping-service-interface' ],
        edgesToComponents: []
      },
      {
        componentName: 'shipping-service',
        edgesToInterfaces: [ 'payment-service-interface' ],
        edgesToComponents: []
      }
    ];
  }
}
