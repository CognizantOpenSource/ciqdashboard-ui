
export class IDashboardAPI {

    private base: string;
    constructor(base: string) {
        this.base = base;
    }
    get userSettings() {
        return `${this.base}users/settings`;
    }
    get systemSettings() {
        return `${this.base}system/settings`;
    }
    get reloadWhitelist() {
        return `${this.systemSettings}/reload-whitelist`;
    }
    get projects() {
        return `${this.base}projects/`;
    }

    get datasource() {
        return `${this.base}data-sources/`;
    }

    getProject(id: string): string {
        return `${this.projects}${id}/`;
    }
    searchProject(name): string {
        return `${this.projects}search/?name=${name}`;
    }
    getDashboards(projectId) {
        return `${this.getProject(projectId)}dashboards/`;
    }
    get dashboards() {
        return `${this.base}dashboards/`;
    }
    getDashboard(id: string): string {
        return `${this.dashboards}${id}/`;
    }
    searchDashboard(name): string {
        return `${this.dashboards}search/?name=${name}`;
    }
    get dataSources() {
        return `${this.base}data-sources/`;
    }
    getSourceInfo(name) {
        return `${this.dataSources}search?name=${name}`;
    }
    get items(){
        return `${this.base}items/`; 
    }
    getItem(id){
        return `${this.items}${id}/`;
    }
    getItemData(id){
        return `${this.getItem(id)}chart-data/`;
    }
    get previewItem(){
        return `${this.items}preview/`;
    }
    searchItems(keywords){
        return `${this.items}search?searchString=${keywords}`;
    }
    getFieldValues(source,field){
        return `${this.base}collector/distinct-values-by-field?source-name=${source}&field-name=${field}`;
    }

    //Data Source Releated Services

    getDataSource(id): string {
    return `${this.base}data-sources/${id}`;
    }

    getFieldsTypes(name: string) {
    return `${this.base}/collector/fields-types?collection-name=${name}`;
    }

    detDataSourceByid(id): string {
    return `${this.base}data-sources/${id}`;
    }

    getcollectionName(){
    return `${this.base}collector/collection-names`;
    }

    searchDatasource(name): string {
    return `${this.base}data-sources/search?name=${name}`;
    }

    get addExtdata() {
        return `${this.base}collector/create-collection`;
    }

    get updateExtdata() {
        return `${this.base}collector/update-collection`;
    }
}