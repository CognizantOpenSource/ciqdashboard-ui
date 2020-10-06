import { ClientType, NodeType, StageType, SourceType, TestType } from './types.model';


class Task {
    steps?: Array<IStep>;
}
class AgentNode { name: string; id: string; type: NodeType; agentType: string; toolId?: string; data?: any; }
class Source extends Task {
    id: string; type: SourceType; repo: string; auth: Auth;

}
class Auth { token: string; }

interface IStep {
    type: string;
    data: { [key: string]: any };
}
export class Test extends Task {
    type: TestType; client: string; script: Array<string>;
    steps?: Array<IStep>;
}


export class Stage {
    id: string; toolId?: string; type: StageType; desc?: string; name: string;
    group?: string;
    node?: AgentNode;
    source?: Stage;
    agent?: AgentNode;
    data: Source | Test;
    environments: Array<any>;
    input: any;
    tools: any;
    stageOptions: any;
}
export class StageGroup {
    id: string; type: StageType; desc?: string;
    parallel: boolean; data: Stage[];
}

export class Pipeline {
    agent?: AgentNode;
    stages: Array<Stage | StageGroup>; environments: Array<any>; options: Array<any>;
    triggers: any; tools: any; parameters: Array<any>;
    post: Map<string, IStep>;
    scriptDefinitions: Array<any>;
}
export class CI {
    id: string; client: ClientType; targetVersion: string;
    node: AgentNode; pipeline: Pipeline;
}
export class Project {
    name: string;
    id?: string;
    version: string;
    platform: string;
    ci: CI;
    links?: any;
    creationDate?: number;
    public static parse(obj: any): Project {
        return Object.assign(new Project(), obj);
    }
    public static fromJson(json: string): Project {
        return Project.parse(JSON.parse(json));
    }

}
export interface ILink {
    name: string;
    ref: string;
    desc?: string;
    image?: string;
}
