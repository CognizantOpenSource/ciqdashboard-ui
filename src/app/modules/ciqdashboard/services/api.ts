// © [2021] Cognizant. All rights reserved.


// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
* IDashboardAPI
* @author Cognizant
*/
export class IDashboardAPI {

    private base: string;
    private category;
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
    getProject(id: string, category): string {
        return `${this.projects}${id}/?category=${category}`;
    }
    searchProject(name): string {
        return `${this.projects}search/?name=${name}`;
    }
    getDashboards(projectId, category) {
        return `${this.projects}${projectId}/dashboards/?category=${category}`;
    }
    get dashboards() {
        return `${this.base}dashboards/`;
    }
    get addtemplate() {
        return `${this.base}dashboard-template/`;
    }
    getDashboard(id: string, category): string {
        return `${this.dashboards}${id}/?category=${category}`;
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
    get items() {
        return `${this.base}items/`;
    }
    getItem(id) {
        return `${this.items}${id}/`;
    }
    //getItemData(id, dashboardName, projectName, category, categoryID) {
        getItemData(id,pageId,dashboardId,dashboardName,projectName,category, categoryID) {
        return `${this.getItem(id)}chart-data/?dashboardId=${dashboardId}&category=${category}&layerId=${categoryID}&pageId=${pageId}`;
        // console.log("api :" + category + " :" + categoryID);
        // return `${this.getItem(id)}chart-data/?projectName=${projectName}&dashboardName=${dashboardName}&category=${category}&lobId=63883fae290cb7172392335f&orgId=63883f1e290cb7172392335e`;//&category=${category}&lobId=${lobId}`;
        // switch (category) {
        //     case 'PRJ': {
        //         //return `${this.getItem(id)}chart-data/?projectName=${projectName}&dashboardName=${dashboardName}&category=${category}&lobId=null&orgId=null`;
        //     }
        //     case 'LOB': {
        //         return `${this.getItem(id)}chart-data/?projectName=${projectName}&dashboardName=${dashboardName}&category=${category}&lobId=${categoryID}&orgId=null`;
        //     }
        //     case 'ORG': {
        //         return `${this.getItem(id)}chart-data/?projectName=${projectName}&dashboardName=${dashboardName}&category=${category}&lobId=null&orgId=${categoryID}`;
        //     }
        //     default: {
        //         return `${this.getItem(id)}chart-data/?projectName=${projectName}&dashboardName=${dashboardName}&category=${category}&lobId=null&orgId=null`;//&category=${category}&lobId=${lobId}`;
        //     }
        // }
    }
    getdirectchartData(id,dashboardId,dashboardName,projectName,category, categoryID){
        return `${this.items}calculate-directchart-data?dashboardId=${dashboardId}&category=${category}&layerId=${categoryID}`;
    }
    get previewItem() {
        return `${this.items}preview/`;
    }
    searchItems(keywords) {
        return `${this.items}search?searchString=${keywords}`;
    }
    getFieldValues(source, field) {
        return `${this.base}collector/distinct-values-by-field?source-name=${source}&field-name=${field}`;
    }

    //Data Source Releated Services

    getDataSource(id): string {
        return `${this.base}data-sources/${id}`;
    }

    getFieldsTypes(name: string) {
        return `${this.base}collector/fields-types?collection-name=${name}`;
    }

    detDataSourceByid(id): string {
        return `${this.base}data-sources/${id}`;
    }

    getcollectionName() {
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

    get createView() {
        return `${this.base}collector/create-view`;
    }

    get resourceMapping() {
        return `${this.base}project-mapping/`;
    }
    get projectMapping() {
        return `${this.resourceMapping}projects/`;
    }
    get teamsMapping() {
        return `${this.resourceMapping}teams/`;
    }
    getTeamsProject(teamId: any, projectId: any): string {
        return `${this.getTeam(teamId)}projects/${projectId}/`;
    }
    getTeam(teamId: any): string {
        return `${this.teamsMapping}${teamId}/`;
    }
    getProjectMapping(projectId): string {
        return `${this.projectMapping}${projectId}/`;
    }
    getUserProjects(userId: string): string {
        return `${this.resourceMapping}users/${userId}`;
    }

    get orgs() {
        return `${this.base}organization/create`;
    }
    getORGs() {
        return `${this.base}organization/`;
    }
    getORG(id: string): string {
        return `${this.base}${id}/`;
    }
    get lobs() {
        return `${this.base}lob/create`;
    }
    getLOBs() {
        return `${this.base}lob/`;
    }
    getLOB(id: string): string {
        return `${this.base}${id}/`;
    }
    getLOBByID(id: string): string {
        return `${this.base}lob/${id}`;
    }
    getLOBsByOrgID(id: string): string {
        return `${this.base}lob/org/${id}`;
    }
    getProjectsByLobID(id: string): string {
        return `${this.base}projects/lob/${id}`;
    }
    get templates() {
        return `${this.base}dashboard-template/get-all-templates/`;
    }
}
