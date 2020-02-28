import { IssueLink, IssueType, Label, IssueLocation, IssueComment } from '../types/types-interfaces';
import * as _ from 'lodash';
import * as Uuid from 'uuid/v5';
const UUID_NAMESPACE: string = '005640e5-a15f-475e-b95f-73ef41c611fa';

export class Issue {
    readonly id: string;
    private title: string;
    private textBody: string;
    private isOpen: boolean;
    private readonly linkedIssues: IssueLink[] = [];
    private type: IssueType;
    private readonly labels: Label[] = [];
    private readonly locations: IssueLocation[] = [];
    private readonly comments: IssueComment[] = [];
    // TODO Artefact links
    // TODO assignees

    public constructor(title: string, textBody: string, isOpen: boolean, linkedIssues: IssueLink[], type: IssueType,
        // tslint:disable-next-line: align
        labels: Label[], locations: IssueLocation[], comments: IssueComment[]) {
        this.id = Uuid(title + textBody, UUID_NAMESPACE);
        this.title = title;
        this.textBody = textBody;
        this.isOpen = isOpen;
        linkedIssues.forEach((issueLink) => {
            this.addLinkedIssue(issueLink);
        });
        this.type = type;
        labels.forEach((label) => {
            this.addLabel(label);
        });
        locations.forEach((location) => {
            this.addLocation(location);
        });
        comments.forEach((comment) => {
            this.addComment(comment);
        });
    }


    public addComment(comment: IssueComment) {
        if (comment && this.comments.lastIndexOf(comment) === -1) {
            this.comments.push(_.cloneDeep(comment));
        }
    }

    public addLocation(location: IssueLocation) {
        if (location && this.locations.lastIndexOf(location) === -1) {
            this.locations.push(_.cloneDeep(location));
        }
    }

    public addLabel(label: Label) {
        if (label && this.labels.lastIndexOf(label) === -1) {
            this.labels.push(_.cloneDeep(label));
        }
    }

    public addLinkedIssue(issueLink: IssueLink) {
        if (issueLink && this.linkedIssues.indexOf(issueLink) === -1) {
            this.linkedIssues.push(_.cloneDeep(issueLink));
        }
    }

    public getTitle() {
        return this.title;
    }

    public getTextBody() {
        return this.textBody;
    }

    public getIsOpen() {
        return this.isOpen;
    }

    public getLinkedIssues() {
        return _.cloneDeep(this.linkedIssues);
    }

    public getType() {
        return this.type;
    }

    public setType(type: IssueType) {
        this.type = type;
    }

    public getLabels() {
        return _.cloneDeep(this.labels);
    }

    public getLocations() {
        return _.cloneDeep(this.locations);
    }

    public getComments() {
        return _.cloneDeep(this.comments);
    }
}
