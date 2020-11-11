
import http from '@/api/request'

export function getSupplierList(data) {
    return http.post('/fileApi/fileManage/getSupplierList', data);
}

export function updateSupplier(data) {
    return http.postFormdata('/fileApi/fileManage/updateSupplier', data);
}