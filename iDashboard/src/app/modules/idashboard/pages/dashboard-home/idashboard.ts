import { UnSubscribable } from 'src/app/components/unsub';
import { DashboardItemsService } from '../../services/idashboard-items.service';

export class IDashBoard extends UnSubscribable {
    loadedItem;
    constructor(public dashItemService: DashboardItemsService) {
        super()
        setTimeout(() => this.dashItemService.loadItems(), 100);
    }

    updateDashBoardData(dash: any, force = false) {
        //update dashboardData
        dash.pages.forEach((page, pi) => {
            page.items.filter(it => it && (!it.data || force) && it.id).forEach((it, i) => this.updateItemData(it, pi, i));
        });
        setTimeout(_ => {
            window.dispatchEvent(new Event('resize'));
        }, 1500);
    }

    updateItemData(it, page, item) {
        const filters = (it.filters || []).filter(f => f.active);
        if (it.itemGroup == 'datalabel' || it.type == 'label' || it.itemGroup == 'dataimg' || it.type == 'img') {
            this.dashItemService.getItem(it.id).subscribe(itd => {
                it.data = itd.data;
                it.options = { ...itd.options, ...(it.options || {}) };
                this.loadedItem = { page, item, value: it };
            });
        } else
            this.dashItemService.getItemData(it, filters).subscribe(itd => {
                it.data = itd.data;
                if (it.type === 'table') {
                    it.projection = itd.projection;
                }
                it.options = { ...itd.options, ...(it.options || {}) };
                this.loadedItem = { page, item, value: it };
            });
    }
}