export const projects = [
  {
    name: "project 1",
    id: "project_1",
  },
  {
    name: "project 2",
    id: "project_2",
  },
  {
    name: "project 3",
    id: "project_3",
  },
];
export function sourceInfos(name){
  return {
    ...(datasets.find(ds => ds.name === name) || datasets[0]),
    fields : [{ name: 'name', type: 'string', label: 'Name' },
    { name: 'time', type: 'date', label: 'Time' },
    { name: 'duration', type: 'number', label: 'Duration' },
    { name: 'status', type: 'string', label: 'Status' }]
  }
}
export const datasets = [...['requirement', 'issues',]
  .map(name => ({ name, group: 'alm', image: 'assets/img/microfocus.png' })),
...['functionl-tests-report', 'security-report', 'unit-tests-report']
  .map(name => ({ name, group: 'SCM', image: 'assets/img/gitlab.png' })),
...['functionl-tests-report', 'security-report', 'unit-tests-report']
  .map(name => ({ name, group: 'Defect Management', image: 'assets/img/jira.png' })),
...['functionl-tests-report', 'security-report', 'unit-tests-report']
  .map(name => ({ name, group: 'Test Management', image: 'assets/img/microfocus.png' })),
...['functionl-tests-report', 'security-report', 'unit-tests-report']
  .map(name => ({ name, group: 'Artifact Repository', image: 'assets/img/artifactory.png' })),
...['functionl-tests-report', 'security-report', 'unit-tests-report']
  .map(name => ({ name, group: 'Project Management', image: 'assets/img/jira.png' })),
...['functionl-tests-report', 'security-report', 'unit-tests-report']
  .map(name => ({ name, group: 'Deployment', image: 'assets/img/aws.png' })),
...['functionl-tests-report', 'security-report', 'unit-tests-report']
  .map(name => ({ name, group: 'Configuration Management', image: 'assets/img/chef.png' })),
...['functionl-tests-report', 'security-report', 'unit-tests-report']
  .map(name => ({ name, group: 'Code Quality', image: 'assets/img/sonar.png' })),
...['functionl-tests-report', 'security-report', 'unit-tests-report']
  .map(name => ({ name, group: 'Security', image: 'assets/img/fortify.png' })),
...['commits', 'gitlab_commite', 'github_issues']
  .map(name => ({ name, group: 'CI Automation', image: 'assets/img/jenkins.png' }))];

export function items() {
  return [...dashboards.flatMap(d => d.items)];
}
export function previewItemData(item) {
  return (dashboards.flatMap(d => d.items).find(it => it.type == item.type) || {}).data;
}

const gridConfig = { rows: 8, columns: 8 };

export const users = [
  {
    id: "101",
    name: "user data table",
    items: [
      {
        id: "10101",
        name: "user list",
        description: "View the list of user",
        tabletitle: "User List",
        config: {
          pagination: true,
          paginationmsg: "Data per Page"
        },
        columns: [
          {
            "name": "id",
            "displayName": "UserID"

          },
          {
            "name": "name",
            "displayName": "Name"

          }, {
            "name": "wins",
            "displayName": "Wins"

          }, {

            "name": "creation",
            "displayName": "CreationDate"
          },
        ],
        data: [
          {
            id: 1,
            name: "Thaarun",
            creation: "Sep 25, 2017",
            wins: 5
          },
          { id: 2, name: "Shyam", creation: "Jun 20, 2017", wins: 6 },
          { id: 3, name: "Maya", creation: "Jun 20, 2017", wins: 5 },
          { id: 4, name: "Dharsan", creation: "Jun 20, 2017", wins: 11 },
          { id: 5, name: "Gopal", creation: "Jun 20, 2017", wins: 10 },
          { id: 6, name: "Gopi", creation: "Sep 25, 2017", wins: 5 },
          { id: 7, name: "Murali", creation: "Apr 29, 2015", wins: 5 },
          { id: 8, name: "Sendhil", creation: "Jun 20, 2017", wins: 6 },
          { id: 9, name: "Karthi", creation: "Jun 20, 2017", wins: 5 },
          { id: 10, name: "Shankar", creation: "Jun 20, 2017", wins: 10 }

        ]
      }
    ]
  }
];

export const dashboards = [
  {
    id: "101",
    name: "demo dashboard - history",
    gridConfig,
    active: true,

    items: [
      {
        id: "10101",
        name: "build history 123",
        type: "line-chart-series",
        description: "Build History Every Day 123",
        charttitle: "line-chart-series",
        config: {
          view: [600, 300],
          gradient: true,
          xAxis: true,
          yAxis: true,
          legend: true,
          showXAxisLabel: true,
          showYAxisLabel: true,
          xAxisLabel: "testtt",
          yAxisLabel: "testtt",
          autoScale: true,
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "Bharath Subramanian",
            value: 47,
            children: null,
            series: [
              {
                name: "2020-04-09",
                value: 6,
                children: null,
                series: null,
              },
              {
                name: "2020-03-25",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-03-23",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-04-08",
                value: 4,
                children: null,
                series: null,
              },
              {
                name: "2020-04-01",
                value: 1,
                children: null,
                series: null,
              },
              {
                name: "2020-04-22",
                value: 7,
                children: null,
                series: null,
              },
              {
                name: "2020-04-21",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-03-30",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-04-16",
                value: 1,
                children: null,
                series: null,
              },
              {
                name: "2020-03-24",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-04-23",
                value: 1,
                children: null,
                series: null,
              },
              {
                name: "2020-04-06",
                value: 1,
                children: null,
                series: null,
              },
              {
                name: "2020-04-03",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-03-31",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-04-02",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-04-13",
                value: 3,
                children: null,
                series: null,
              },
              {
                name: "2020-04-20",
                value: 5,
                children: null,
                series: null,
              },
              {
                name: "2020-04-28",
                value: 1,
                children: null,
                series: null,
              },
              {
                name: "2020-04-15",
                value: 1,
                children: null,
                series: null,
              },
            ],
          },
          {
            name: "Ramanjaneyulu Kummari",
            value: 34,
            children: null,
            series: [
              {
                name: "2020-07-01",
                value: 17,
                children: null,
                series: null,
              },
              {
                name: "2020-06-29",
                value: 3,
                children: null,
                series: null,
              },
              {
                name: "2020-06-30",
                value: 1,
                children: null,
                series: null,
              },
              {
                name: "2020-07-02",
                value: 13,
                children: null,
                series: null,
              },
            ],
          },
          {
            name: "karuna",
            value: 62,
            children: null,
            series: [
              {
                name: "2020-05-04",
                value: 1,
                children: null,
                series: null,
              },
              {
                name: "2020-05-19",
                value: 1,
                children: null,
                series: null,
              },
              {
                name: "2020-06-01",
                value: 5,
                children: null,
                series: null,
              },
              {
                name: "2020-05-26",
                value: 1,
                children: null,
                series: null,
              },
              {
                name: "2020-06-03",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-06-02",
                value: 1,
                children: null,
                series: null,
              },
              {
                name: "2020-05-21",
                value: 5,
                children: null,
                series: null,
              },
              {
                name: "2020-05-06",
                value: 3,
                children: null,
                series: null,
              },
              {
                name: "2020-06-24",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-05-09",
                value: 1,
                children: null,
                series: null,
              },
              {
                name: "2020-06-30",
                value: 4,
                children: null,
                series: null,
              },
              {
                name: "2020-06-12",
                value: 1,
                children: null,
                series: null,
              },
              {
                name: "2020-06-05",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-05-05",
                value: 1,
                children: null,
                series: null,
              },
              {
                name: "2020-05-20",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-05-08",
                value: 1,
                children: null,
                series: null,
              },
              {
                name: "2020-06-26",
                value: 3,
                children: null,
                series: null,
              },
              {
                name: "2020-06-08",
                value: 4,
                children: null,
                series: null,
              },
              {
                name: "2020-06-04",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-05-22",
                value: 7,
                children: null,
                series: null,
              },
              {
                name: "2020-06-29",
                value: 3,
                children: null,
                series: null,
              },
              {
                name: "2020-06-19",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-05-29",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-06-22",
                value: 1,
                children: null,
                series: null,
              },
              {
                name: "2020-05-07",
                value: 5,
                children: null,
                series: null,
              },
            ],
          },
          {
            name: "Ramanjaneyulu Kummari",
            value: 174,
            children: null,
            series: [
              {
                name: "2020-06-23",
                value: 6,
                children: null,
                series: null,
              },
              {
                name: "2020-06-01",
                value: 5,
                children: null,
                series: null,
              },
              {
                name: "2020-05-29",
                value: 5,
                children: null,
                series: null,
              },
              {
                name: "2020-03-23",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-05-05",
                value: 4,
                children: null,
                series: null,
              },
              {
                name: "2020-04-30",
                value: 1,
                children: null,
                series: null,
              },
              {
                name: "2020-05-22",
                value: 6,
                children: null,
                series: null,
              },
              {
                name: "2020-06-26",
                value: 9,
                children: null,
                series: null,
              },
              {
                name: "2020-06-19",
                value: 7,
                children: null,
                series: null,
              },
              {
                name: "2020-06-16",
                value: 1,
                children: null,
                series: null,
              },
              {
                name: "2020-06-14",
                value: 1,
                children: null,
                series: null,
              },
              {
                name: "2020-06-05",
                value: 5,
                children: null,
                series: null,
              },
              {
                name: "2020-04-29",
                value: 3,
                children: null,
                series: null,
              },
              {
                name: "2020-05-20",
                value: 4,
                children: null,
                series: null,
              },
              {
                name: "2020-06-30",
                value: 6,
                children: null,
                series: null,
              },
              {
                name: "2020-06-29",
                value: 3,
                children: null,
                series: null,
              },
              {
                name: "2020-06-09",
                value: 5,
                children: null,
                series: null,
              },
              {
                name: "2020-05-11",
                value: 6,
                children: null,
                series: null,
              },
              {
                name: "2020-06-17",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-06-04",
                value: 5,
                children: null,
                series: null,
              },
              {
                name: "2020-06-18",
                value: 4,
                children: null,
                series: null,
              },
              {
                name: "2020-07-01",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-05-26",
                value: 3,
                children: null,
                series: null,
              },
              {
                name: "2020-05-12",
                value: 6,
                children: null,
                series: null,
              },
              {
                name: "2020-06-15",
                value: 5,
                children: null,
                series: null,
              },
              {
                name: "2020-05-07",
                value: 3,
                children: null,
                series: null,
              },
              {
                name: "2020-06-02",
                value: 3,
                children: null,
                series: null,
              },
              {
                name: "2020-05-06",
                value: 3,
                children: null,
                series: null,
              },
              {
                name: "2020-06-12",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-05-08",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-06-24",
                value: 14,
                children: null,
                series: null,
              },
              {
                name: "2020-05-27",
                value: 3,
                children: null,
                series: null,
              },
              {
                name: "2020-06-11",
                value: 3,
                children: null,
                series: null,
              },
              {
                name: "2020-05-28",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-06-10",
                value: 6,
                children: null,
                series: null,
              },
              {
                name: "2020-06-08",
                value: 4,
                children: null,
                series: null,
              },
              {
                name: "2020-06-22",
                value: 3,
                children: null,
                series: null,
              },
              {
                name: "2020-06-25",
                value: 8,
                children: null,
                series: null,
              },
              {
                name: "2020-05-14",
                value: 2,
                children: null,
                series: null,
              },
              {
                name: "2020-05-09",
                value: 3,
                children: null,
                series: null,
              },
              {
                name: "2020-05-21",
                value: 7,
                children: null,
                series: null,
              },
            ],
          },
          {
            name: "158771",
            value: 19,
            children: null,
            series: [
              {
                name: "2020-06-29",
                value: 6,
                children: null,
                series: null,
              },
              {
                name: "2020-06-28",
                value: 6,
                children: null,
                series: null,
              },
              {
                name: "2020-06-20",
                value: 6,
                children: null,
                series: null,
              },
              {
                name: "2020-04-28",
                value: 1,
                children: null,
                series: null,
              },
            ],
          },
        ],
      },
      {
        id: "10102",
        name: "bar-chart-horizontal",
        type: "bar-chart-horizontal",
        description: "bar-chart-horizontal",
        charttitle: "bar-chart-horizontal",
        config: {
          view: [400, 200],
          gradient: false,
          xAxis: true,
          yAxis: true,
          legend: true,
          showXAxisLabel: true,
          showYAxisLabel: true,
          xAxisLabel: "testtt",
          yAxisLabel: "testtt",
          autoScale: true,
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "Germany",
            value: 8940000,
          },
          {
            name: "USA",
            value: 5000000,
          },
          {
            name: "France",
            value: 7200000,
          },
        ],
      },
      {
        id: "10103",
        name: "bar-chart-vertical",
        type: "bar-chart-vertical",
        description: "bar-chart-vertical",
        charttitle: "bar-chart-vertical",
        config: {
          view: [850, 300],
          gradient: false,
          xAxis: true,
          yAxis: true,
          legend: true,
          showXAxisLabel: true,
          showYAxisLabel: true,
          xAxisLabel: "testtt",
          yAxisLabel: "testtt",
          autoScale: true,
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "Germany",
            value: 8940000,
          },
          {
            name: "USA",
            value: 5000000,
          },
          {
            name: "France",
            value: 7200000,
          },
        ],
      },
      {
        id: "10104",
        name: "bar-vertical-normalized",
        type: "bar-vertical-normalized",
        description: "bar-vertical-normalized",
        charttitle: "bar-vertical-normalized",
        config: {
          view: [400, 200],
          gradient: false,
          xAxis: true,
          yAxis: true,
          legend: true,
          showXAxisLabel: true,
          showYAxisLabel: true,
          xAxisLabel: "testtt",
          yAxisLabel: "testtt",
          autoScale: true,
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "Germany",
            series: [
              {
                name: "2010",
                value: 73000000,
              },
              {
                name: "2011",
                value: 89400000,
              },
              {
                name: "1990",
                value: 62000000,
              },
            ],
          },

          {
            name: "USA",
            series: [
              {
                name: "2010",
                value: 309000000,
              },
              {
                name: "2011",
                value: 311000000,
              },
              {
                name: "1990",
                value: 250000000,
              },
            ],
          },

          {
            name: "France",
            series: [
              {
                name: "2010",
                value: 50000020,
              },
              {
                name: "2011",
                value: 58000000,
              },
              {
                name: "1990",
                value: 58000000,
              },
            ],
          },
          {
            name: "UK",
            series: [
              {
                name: "2010",
                value: 62000000,
              },
              {
                name: "1990",
                value: 57000000,
              },
            ],
          },
        ],
      },
      {
        id: "10105",
        name: "bar-horizontal-normalized",
        type: "bar-horizontal-normalized",
        description: "Commit History Every Day",
        charttitle: "bar-horizontal-normalized",
        config: {
          view: [400, 200],
          gradient: false,
          xAxis: true,
          yAxis: true,
          legend: true,
          showXAxisLabel: true,
          showYAxisLabel: true,
          xAxisLabel: "testtt",
          yAxisLabel: "testtt",
          autoScale: true,
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "Germany",
            series: [
              {
                name: "2010",
                value: 73000000,
              },
              {
                name: "2011",
                value: 89400000,
              },
              {
                name: "1990",
                value: 62000000,
              },
            ],
          },

          {
            name: "USA",
            series: [
              {
                name: "2010",
                value: 309000000,
              },
              {
                name: "2011",
                value: 311000000,
              },
              {
                name: "1990",
                value: 250000000,
              },
            ],
          },

          {
            name: "France",
            series: [
              {
                name: "2010",
                value: 50000020,
              },
              {
                name: "2011",
                value: 58000000,
              },
              {
                name: "1990",
                value: 58000000,
              },
            ],
          },
          {
            name: "UK",
            series: [
              {
                name: "2010",
                value: 62000000,
              },
              {
                name: "1990",
                value: 57000000,
              },
            ],
          },
        ],
      },
      {
        id: "10106",
        name: "bar-horizontal-stacked",
        type: "bar-horizontal-stacked",
        description: "bar-horizontal-stacked",
        charttitle: "bar-horizontal-stacked",
        config: {
          view: [400, 200],
          gradient: false,
          xAxis: true,
          yAxis: true,
          legend: true,
          showXAxisLabel: true,
          showYAxisLabel: true,
          xAxisLabel: "testtt",
          yAxisLabel: "testtt",
          autoScale: true,
          animations: true,
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "Germany",
            series: [
              {
                name: "2010",
                value: 73000000,
              },
              {
                name: "2011",
                value: 89400000,
              },
              {
                name: "1990",
                value: 62000000,
              },
            ],
          },

          {
            name: "USA",
            series: [
              {
                name: "2010",
                value: 309000000,
              },
              {
                name: "2011",
                value: 311000000,
              },
              {
                name: "1990",
                value: 250000000,
              },
            ],
          },

          {
            name: "France",
            series: [
              {
                name: "2010",
                value: 50000020,
              },
              {
                name: "2011",
                value: 58000000,
              },
              {
                name: "1990",
                value: 58000000,
              },
            ],
          },
          {
            name: "UK",
            series: [
              {
                name: "2010",
                value: 62000000,
              },
              {
                name: "1990",
                value: 57000000,
              },
            ],
          },
        ],
      },
      {
        id: "10107",
        name: "bar-vertical-stacked",
        type: "bar-vertical-stacked",
        description: "bar-vertical-stacked",
        charttitle: "bar-vertical-stacked",
        config: {
          view: [400, 200],
          gradient: false,
          xAxis: true,
          yAxis: true,
          legend: true,
          showXAxisLabel: true,
          showYAxisLabel: true,
          xAxisLabel: "testtt",
          yAxisLabel: "testtt",
          autoScale: true,
          animations: true,
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "Germany",
            series: [
              {
                name: "2010",
                value: 73000000,
              },
              {
                name: "2011",
                value: 89400000,
              },
              {
                name: "1990",
                value: 62000000,
              },
            ],
          },

          {
            name: "USA",
            series: [
              {
                name: "2010",
                value: 309000000,
              },
              {
                name: "2011",
                value: 311000000,
              },
              {
                name: "1990",
                value: 250000000,
              },
            ],
          },

          {
            name: "France",
            series: [
              {
                name: "2010",
                value: 50000020,
              },
              {
                name: "2011",
                value: 58000000,
              },
              {
                name: "1990",
                value: 58000000,
              },
            ],
          },
          {
            name: "UK",
            series: [
              {
                name: "2010",
                value: 62000000,
              },
              {
                name: "1990",
                value: 57000000,
              },
            ],
          },
        ],
      },
      {
        id: "10108",
        name: "bar-horizontal-group",
        type: "bar-horizontal-group",
        description: "bar-horizontal-group",
        charttitle: "bar-horizontal-group",
        config: {
          view: [400, 200],
          gradient: false,
          xAxis: true,
          yAxis: true,
          legend: true,
          showXAxisLabel: true,
          showYAxisLabel: true,
          xAxisLabel: "testtt",
          yAxisLabel: "testtt",
          animations: true,
          schemeType: "linear",
          legendPositionDown: "below",
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "Germany",
            series: [
              {
                name: "2010",
                value: 7300000,
              },
              {
                name: "2011",
                value: 8940000,
              },
            ],
          },

          {
            name: "USA",
            series: [
              {
                name: "2010",
                value: 7870000,
              },
              {
                name: "2011",
                value: 8270000,
              },
            ],
          },

          {
            name: "France",
            series: [
              {
                name: "2010",
                value: 5000002,
              },
              {
                name: "2011",
                value: 5800000,
              },
            ],
          },
        ],
      },
      {
        id: "10109",
        name: "bar-vertical-group",
        type: "bar-vertical-group",
        description: "bar-vertical-group",
        charttitle: "bar-vertical-group",
        config: {
          view: [400, 200],
          gradient: false,
          xAxis: true,
          yAxis: true,
          legend: true,
          showXAxisLabel: true,
          showYAxisLabel: true,
          xAxisLabel: "testtt",
          yAxisLabel: "testtt",
          animations: true,
          schemeType: "linear",
          legendPositionDown: "below",
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "Germany",
            series: [
              {
                name: "2010",
                value: 7300000,
              },
              {
                name: "2011",
                value: 8940000,
              },
            ],
          },

          {
            name: "USA",
            series: [
              {
                name: "2010",
                value: 7870000,
              },
              {
                name: "2011",
                value: 8270000,
              },
            ],
          },

          {
            name: "France",
            series: [
              {
                name: "2010",
                value: 5000002,
              },
              {
                name: "2011",
                value: 5800000,
              },
            ],
          },
        ],
      },
      {
        id: "10110",
        name: "pie-chart",
        type: "pie-chart",
        description: "pie-chart",
        charttitle: "pie-chart",
        config: {
          view: [400, 200],
          gradient: false,
          legend: true,
          explodeSlices: false,
          showLabels: true,
          doughnut: false,
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "Germany",
            value: 8940000,
          },
          {
            name: "USA",
            value: 5000000,
          },
          {
            name: "France",
            value: 7200000,
          },
        ],
      },
      {
        id: "10111",
        name: "pie-chart-advanced",
        type: "pie-chart-advanced",
        description: "pie-chart-advanced",
        charttitle: "pie-chart-advanced",
        config: {
          view: [400, 200],
          gradient: false,
          doughnut: true,
          legend: true,
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "Germany",
            value: 1,
          },
          {
            name: "USA",
            value: 2,
          },
          {
            name: "France",
            value: 3,
          },
        ],
      },
      {
        id: "10112",
        name: "pie-chart-grid",
        type: "pie-chart-grid",
        description: "pie-chart-grid",
        charttitle: "pie-chart-grid",
        config: {
          view: [400, 200],
          gradient: false,
          animations: false,
          label: "Total",
          tooltipDisabled: false,
          minWidth: 150,
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "Germany",
            value: 1,
          },
          {
            name: "USA",
            value: 2,
          },
          {
            name: "France",
            value: 3,
          },
        ],
      },
      {
        id: "10113",
        name: "line-chart-area-stacked",
        type: "line-chart-area-stacked",
        description: "line-chart-area-stacked",
        charttitle: "line-chart-area-stacked",
        config: {
          view: [400, 200],
          gradient: false,
          legend: false,
          showXAxisLabel: true,
          showYAxisLabel: true,
          xAxis: true,
          yAxis: true,
          xAxisLabel: true,
          yAxisLabel: true,
          animations: false,
          tooltipDisabled: false,
          showGridLines: true,
          legendPositionDown: "right",
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "Germany",
            series: [
              {
                name: "1990",
                value: 62000000,
              },
              {
                name: "2010",
                value: 73000000,
              },
              {
                name: "2011",
                value: 89400000,
              },
            ],
          },

          {
            name: "USA",
            series: [
              {
                name: "1990",
                value: 250000000,
              },
              {
                name: "2010",
                value: 309000000,
              },
              {
                name: "2011",
                value: 311000000,
              },
            ],
          },

          {
            name: "France",
            series: [
              {
                name: "1990",
                value: 58000000,
              },
              {
                name: "2010",
                value: 50000020,
              },
              {
                name: "2011",
                value: 58000000,
              },
            ],
          },
          {
            name: "UK",
            series: [
              {
                name: "1990",
                value: 57000000,
              },
              {
                name: "2010",
                value: 62000000,
              },
            ],
          },
        ],
      },
      {
        id: "10114",
        name: "area-chart",
        type: "area-chart",
        description: "area-chart",
        charttitle: "area-chart",
        config: {
          view: [400, 200],
          gradient: false,
          legend: false,
          showXAxisLabel: true,
          showYAxisLabel: true,
          xAxis: true,
          yAxis: true,
          xAxisLabel: true,
          yAxisLabel: true,
          animations: false,
          showGridLines: true,
          legendPositionDown: "right",
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "Germany",
            series: [
              {
                name: "1990",
                value: 62000000,
              },
              {
                name: "2010",
                value: 73000000,
              },
              {
                name: "2011",
                value: 89400000,
              },
            ],
          },

          {
            name: "USA",
            series: [
              {
                name: "1990",
                value: 250000000,
              },
              {
                name: "2010",
                value: 309000000,
              },
              {
                name: "2011",
                value: 311000000,
              },
            ],
          },

          {
            name: "France",
            series: [
              {
                name: "1990",
                value: 58000000,
              },
              {
                name: "2010",
                value: 50000020,
              },
              {
                name: "2011",
                value: 58000000,
              },
            ],
          },
          {
            name: "UK",
            series: [
              {
                name: "1990",
                value: 57000000,
              },
              {
                name: "2010",
                value: 62000000,
              },
            ],
          },
        ],
      },
      {
        id: "10115",
        name: "area-chart-normalized",
        type: "area-chart-normalized",
        description: "area-chart-normalized",
        charttitle: "area-chart-normalized",
        config: {
          view: [400, 200],
          gradient: false,
          legend: false,
          showXAxisLabel: true,
          showYAxisLabel: true,
          xAxis: true,
          yAxis: true,
          xAxisLabel: true,
          yAxisLabel: true,
          animations: false,
          showGridLines: true,
          legendPositionDown: "right",
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "Germany",
            series: [
              {
                name: "1990",
                value: 62000000,
              },
              {
                name: "2010",
                value: 73000000,
              },
              {
                name: "2011",
                value: 89400000,
              },
            ],
          },

          {
            name: "USA",
            series: [
              {
                name: "1990",
                value: 250000000,
              },
              {
                name: "2010",
                value: 309000000,
              },
              {
                name: "2011",
                value: 311000000,
              },
            ],
          },

          {
            name: "France",
            series: [
              {
                name: "1990",
                value: 58000000,
              },
              {
                name: "2010",
                value: 50000020,
              },
              {
                name: "2011",
                value: 58000000,
              },
            ],
          },
          {
            name: "UK",
            series: [
              {
                name: "1990",
                value: 57000000,
              },
              {
                name: "2010",
                value: 62000000,
              },
            ],
          },
        ],
      },
      {
        id: "10116",
        name: "tree-map-chart",
        type: "tree-map-chart",
        description: "tree-map-chart",
        charttitle: "tree-map-chart",
        config: {
          view: [400, 200],
          gradient: false,
          animations: false,
          tooltipDisabled: true,
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "auth-api",
            value: 21,
            children: [
              {
                name: "master",
                value: 21,
                children: [
                  {
                    name: "prabu.monkayarkarasiayyappan@cognizant.com",
                    value: 1,
                    children: null,
                    series: null,
                  },
                  {
                    name: "bharath.subramanian@cognizant.com",
                    value: 7,
                    children: null,
                    series: null,
                  },
                  {
                    name: "ramanjaneyulu.kummari@cognizant.com",
                    value: 12,
                    children: null,
                    series: null,
                  },
                  {
                    name: "karunakaran.ks@cognizant.com",
                    value: 1,
                    children: null,
                    series: null,
                  },
                ],
                series: null,
              },
              {
                name: "dev",
                value: 21,
                children: [
                  {
                    name: "prabu.monkayarkarasiayyappan@cognizant.com",
                    value: 1,
                    children: null,
                    series: null,
                  },
                  {
                    name: "bharath.subramanian@cognizant.com",
                    value: 7,
                    children: null,
                    series: null,
                  },
                  {
                    name: "ramanjaneyulu.kummari@cognizant.com",
                    value: 12,
                    children: null,
                    series: null,
                  },
                  {
                    name: "karunakaran.ks@cognizant.com",
                    value: 1,
                    children: null,
                    series: null,
                  },
                ],
                series: null,
              },
            ],
          },
          {
            name: "workbench-api",
            value: 21,
            children: [
              {
                name: "master",
                value: 21,
                children: [
                  {
                    name: "prabu.monkayarkarasiayyappan@cognizant.com",
                    value: 1,
                    children: null,
                    series: null,
                  },
                  {
                    name: "bharath.subramanian@cognizant.com",
                    value: 7,
                    children: null,
                    series: null,
                  },
                  {
                    name: "ramanjaneyulu.kummari@cognizant.com",
                    value: 12,
                    children: null,
                    series: null,
                  },
                  {
                    name: "karunakaran.ks@cognizant.com",
                    value: 1,
                    children: null,
                    series: null,
                  },
                ],
                series: null,
              },
              {
                name: "dev",
                value: 21,
                children: [
                  {
                    name: "prabu.monkayarkarasiayyappan@cognizant.com",
                    value: 1,
                    children: null,
                    series: null,
                  },
                  {
                    name: "bharath.subramanian@cognizant.com",
                    value: 7,
                    children: null,
                    series: null,
                  },
                  {
                    name: "ramanjaneyulu.kummari@cognizant.com",
                    value: 12,
                    children: null,
                    series: null,
                  },
                  {
                    name: "karunakaran.ks@cognizant.com",
                    value: 1,
                    children: null,
                    series: null,
                  },
                ],
                series: null,
              },
            ],
          },
          {
            name: "dashboard-api",
            value: 21,
            children: [
              {
                name: "master",
                value: 21,
                children: [
                  {
                    name: "prabu.monkayarkarasiayyappan@cognizant.com",
                    value: 1,
                    children: null,
                    series: null,
                  },
                  {
                    name: "bharath.subramanian@cognizant.com",
                    value: 7,
                    children: null,
                    series: null,
                  },
                  {
                    name: "ramanjaneyulu.kummari@cognizant.com",
                    value: 12,
                    children: null,
                    series: null,
                  },
                  {
                    name: "karunakaran.ks@cognizant.com",
                    value: 1,
                    children: null,
                    series: null,
                  },
                ],
                series: null,
              },
              {
                name: "dev",
                value: 21,
                children: [
                  {
                    name: "prabu.monkayarkarasiayyappan@cognizant.com",
                    value: 1,
                    children: null,
                    series: null,
                  },
                  {
                    name: "bharath.subramanian@cognizant.com",
                    value: 7,
                    children: null,
                    series: null,
                  },
                  {
                    name: "ramanjaneyulu.kummari@cognizant.com",
                    value: 12,
                    children: null,
                    series: null,
                  },
                  {
                    name: "karunakaran.ks@cognizant.com",
                    value: 1,
                    children: null,
                    series: null,
                  },
                ],
                series: null,
              },
            ],
          },
        ],
      },
      {
        id: "10117",
        name: "bubble-chart",
        type: "bubble-chart",
        description: "bubble-chart",
        charttitle: "bubble-chart",
        config: {
          view: [400, 200],
          gradient: false,
          legend: true,
          showXAxisLabel: true,
          showYAxisLabel: true,
          xAxis: true,
          yAxis: true,
          xAxisLabel: "Population",
          yAxisLabel: "Years",
          xScaleMin: true,
          xScaleMax: true,
          yScaleMin: 70,
          yScaleMax: 85,
          minRadius: 5,
          maxRadius: 20,
          animations: false,
          showGridLines: true,
          rotateXAxisTicks: false,
          legendPositionDown: "right",
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "Germany",
            series: [
              {
                name: "2010",
                x: "2010",
                y: 80.3,
                r: 80.4,
              },
              {
                name: "2000",
                x: "2000",
                y: 80.3,
                r: 78,
              },
              {
                name: "1990",
                x: "1990",
                y: 75.4,
                r: 79,
              },
            ],
          },
          {
            name: "United States",
            series: [
              {
                name: "2010",
                x: "2010",
                y: 78.8,
                r: 310,
              },
              {
                name: "2000",
                x: "2000",
                y: 76.9,
                r: 283,
              },
              {
                name: "1990",
                x: "1990",
                y: 75.4,
                r: 253,
              },
            ],
          },
          {
            name: "France",
            series: [
              {
                name: "2010",
                x: "2010",
                y: 81.4,
                r: 63,
              },
              {
                name: "2000",
                x: "2000",
                y: 79.1,
                r: 59.4,
              },
              {
                name: "1990",
                x: "1990",
                y: 77.2,
                r: 56.9,
              },
            ],
          },
          {
            name: "United Kingdom",
            series: [
              {
                name: "2010",
                x: "2010",
                y: 80.2,
                r: 62.7,
              },
              {
                name: "2000",
                x: "2000",
                y: 77.8,
                r: 58.9,
              },
              {
                name: "1990",
                x: "1990",
                y: 75.7,
                r: 57.1,
              },
            ],
          },
        ],
      },
      {
        id: "10118",
        name: "cardchartexample",
        type: "card-chart",
        description: "card chart example",
        charttitle: "card-chart",
        config: {
          view: [400, 200],
          gradient: false,
          cardColor: "#232837",
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "Germany",
            value: 8940000,
          },
          {
            name: "USA",
            value: 5000000,
          },
          {
            name: "France",
            value: 7200000,
          },
          {
            name: "UK",
            value: 5200000,
          },
          {
            name: "Italy",
            value: 7700000,
          },
          {
            name: "Spain",
            value: 4300000,
          },
        ],
      },
      {
        id: "10119",
        name: "gauge-chart",
        type: "gauge-chart",
        description: "gauge-chart",
        charttitle: "gauge-chart",
        config: {
          view: [800, 400],
          gradient: false,
          cardColor: "#232837",
          legend: false,
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "Germany",
            value: 8940000,
          },
          {
            name: "USA",
            value: 5000000,
          },
          {
            name: "France",
            value: 7200000,
          },
          {
            name: "UK",
            value: 5200000,
          },
          {
            name: "Italy",
            value: 7700000,
          },
          {
            name: "Spain",
            value: 4300000,
          },
        ],
      },
      {
        id: "10120",
        name: "polar-chart",
        type: "polar-chart",
        description: "polar-chart",
        charttitle: "polar-chart",
        config: {
          view: [600, 400],
          gradient: false,
          showXAxisLabel: true,
          showYAxisLabel: true,
          xAxis: true,
          yAxis: true,
          xAxisLabel: "Year",
          yAxisLabel: "Population",
          animations: true,
          legend: true,
          domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
        },
        data: [
          {
            name: "Germany",
            series: [
              {
                name: "1990",
                value: 62000000,
              },
              {
                name: "2010",
                value: 73000000,
              },
              {
                name: "2011",
                value: 89400000,
              },
            ],
          },

          {
            name: "USA",
            series: [
              {
                name: "1990",
                value: 250000000,
              },
              {
                name: "2010",
                value: 309000000,
              },
              {
                name: "2011",
                value: 311000000,
              },
            ],
          },

          {
            name: "France",
            series: [
              {
                name: "1990",
                value: 58000000,
              },
              {
                name: "2010",
                value: 50000020,
              },
              {
                name: "2011",
                value: 58000000,
              },
            ],
          },
          {
            name: "UK",
            series: [
              {
                name: "1990",
                value: 57000000,
              },
              {
                name: "2010",
                value: 62000000,
              },
              {
                name: "2011",
                value: 72000000,
              },
            ],
          },
        ],
      },
    ],
  },
];

const id = () =>
  (
    Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
  ).toUpperCase();
