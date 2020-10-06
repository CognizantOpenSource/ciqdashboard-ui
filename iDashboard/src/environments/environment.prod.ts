export const environment = {
  production: true,
  api: {
    auth: `${window.location.origin}/api/`,
    workbench : `${window.location.origin}/api/workbench/`,
    reports : `${window.location.origin}/api/reports/`,
    execution : `${window.location.origin}/api/execution/`,
    idashboard :  `${window.location.origin}/idashboard/`
  },
  storagePrefix: 'idash-ui'
};