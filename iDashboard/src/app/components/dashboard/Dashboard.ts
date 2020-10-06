import { UnSubscribable } from 'src/app/components/unsub';
import { IJobReport, IBuildReport } from 'src/app/model/report.model';

export class Dashboard extends UnSubscribable {

    changeDateFormat(dateObject: Date) {
        dateObject.setHours(0, 0, 0, 0);
        return dateObject;
    }
    predicateBuildByJobNameAndStatus(build: IBuildReport, jobName: string, status: string): boolean {
        return (!jobName || jobName === '' || build.jobName.toLowerCase() === jobName.toLowerCase())
            && ((!status || status === '') || build.status.toLowerCase() === status.toLowerCase());
    }
    predicateBuildByName(build: IBuildReport, jobName: string): boolean {
        return (!jobName || jobName === '')
            || (build.jobName + ' #' + build.id).toLowerCase().includes(jobName.toLowerCase());
    }
    predicateJobByName(job: IJobReport, name: string): boolean {
        return (!name || name === '')
            || job.name.toLowerCase().includes(name.toLowerCase());
    }
    predicateBuildByDate(buildDate: Date, startDate: Date, endDate: Date): boolean {
        return (!startDate)
            || (startDate <= buildDate &&
                buildDate <= endDate);
    }
    predicateJobByDate(jobDate: Date, startDate: Date, endDate: Date): boolean {
        return (!startDate)
            || (startDate <= jobDate && jobDate <= endDate);
    }
    predicateBuildByFilter(build: IBuildReport, filterObject: any): boolean {
        return this.durationFilter(this.toMinutes(build.duration), filterObject) &&
            this.statusFilter(build.status, filterObject);
    }
    predicateJobByFilter(job: IJobReport, filterObject: any): boolean {
        return this.durationFilter(this.toMinutes(job.builds[0].duration), filterObject) &&
            this.statusFilter(job.builds[0].status, filterObject);
    }
    durationFilter(duration: number, filterObject: any): boolean {
        if (filterObject.durationFrom && filterObject.durationTo) {
            return filterObject.durationFrom <= duration && duration <= filterObject.durationTo;
        } else if (filterObject.rangeSelect === 'gt' && filterObject.durationFrom) {
            return filterObject.durationFrom <= duration;
        } else if (filterObject.rangeSelect === 'lt' && filterObject.durationFrom) {
            return filterObject.durationFrom >= duration;
        }
        return true;
    }
    toMinutes(duration: number): number {
        duration = Math.ceil(duration / 1000);
        const hours: any = Math.floor(duration / 3600);
        return Math.floor((duration - (hours * 3600)) / 60);
    }
    statusFilter(status: string, filterObject: any): boolean {
        const statusCheckedList = filterObject.statusList.filter(statusObject => statusObject.checked);
        if (statusCheckedList.length > 0) {
            const statusFilterList = statusCheckedList.map(statusObject =>
                status === statusObject.status.toLowerCase());
            return statusFilterList.includes(true);
        }
        return true;
    }
    getStatusList() {
        return [{ id: 1, status: 'Passed', checked: false },
        { id: 2, status: 'Failed', checked: false }, { id: 3, status: 'Skipped', checked: false },
        { id: 4, status: 'Aborted', checked: false }];
    }
}
