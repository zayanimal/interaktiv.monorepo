export type LazyComponents = 'Users' | 'Companies' | 'Orders'

export interface IRouterItem {
    key: string
    path: string
    name: string
    icon: string
    component: LazyComponents
}
