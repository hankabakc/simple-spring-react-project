import { OrderResponse } from '@/types/Type';

export function groupOrders(orderList: OrderResponse[]): Record<number, OrderResponse[]> {
    const grouped: Record<number, OrderResponse[]> = {};
    for (const item of orderList) {
        if (!grouped[item.orderId]) grouped[item.orderId] = [];
        grouped[item.orderId].push(item);
    }
    return grouped;
}