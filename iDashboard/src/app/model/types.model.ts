export enum ClientType {
    jenkins, travis, circleci, bamboo
}
export enum NodeType {
    docker = 'docker', vm = 'vm', any = 'any', native = 'native'
}
export enum SourceType {
    git, svn
}
export enum StageType {
    source = 'source', group = 'group', test = 'test', deploy = 'deploy', agent = 'agent', config = 'config'
}
export enum TestType {
    security = 'security', api = 'api', functional = 'functional', unit = 'unit', static = 'static-analysis'
}
export enum Theme {
    default = 'default',
    dark = 'dark'
}
