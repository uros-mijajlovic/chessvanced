var currentMove = 0;
export function changeBarForCurrentMove(index) {
    currentMove = index;
}
export const verticalLinePlugin = {
    id: 'verticalLinePlugin',
    afterEvent: function (chart, event) {
        if (event.event.type == 'click') {
            const { ctx, tooltip, chartArea: { top, right, bottom, left, width, height }, scales: { x, y } } = chart;
            currentMove = tooltip.dataPoints[0].dataIndex;
            console.log(currentMove);
        }
    },
    afterDatasetsDraw(chart, args, options) {
        const { ctx, tooltip, chartArea: { top, right, bottom, left, width, height }, scales: { x, y } } = chart;
        const xPos = x.getPixelForValue(currentMove);
        ctx.restore();
        ctx.strokeStyle = "rgba(170, 252, 255, 0.8)";
        ctx.strokeRect(xPos, top, 0, height);
        ctx.save();
    }
};
export const hoverLinePlugin = {
    id: 'hoverLinePlugin',
    beforeDatasetsDraw(chart, args, options) {
        const { ctx, tooltip, chartArea: { top, right, bottom, left, width, height }, scales: { x, y } } = chart;
        if (tooltip._active.length > 0) {
            const xPos = x.getPixelForValue(tooltip.dataPoints[0].dataIndex);
            ctx.save();
            ctx.strokeStyle = "gray";
            ctx.strokeRect(xPos, top, 0, height);
        }
    }
};
