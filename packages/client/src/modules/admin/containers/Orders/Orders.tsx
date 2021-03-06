import React, { useEffect } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { connect } from 'react-redux'
import { RootStateTypes } from '@config/roots'
import { systemActions } from '@system/store/actions'
import { ordersActions } from '@admin/store/actions'
import { ordersSelectors } from '@admin/store/selectors'
import { OrdersList } from '@admin/components/OrdersList'
import { OrderControl } from '@admin/containers/OrderControl'

const mapStateToProps = (state: RootStateTypes) => ({
    list: ordersSelectors.list(state),
    meta: ordersSelectors.meta(state)
})

const mapDispatchToProps = {
    setHeaderTitle: systemActions.setHeaderTitle,
    getOrdersList: ordersActions.getOrdersList.request
}

export type OrdersProps = ReturnType<typeof mapStateToProps> &
    typeof mapDispatchToProps

const Orders: React.FC<OrdersProps> = (props) => {
    const { setHeaderTitle, getOrdersList } = props
    const { path } = useRouteMatch()

    useEffect(() => {
        setHeaderTitle('Управление заказами')

        const GET_COUNT = 1

        getOrdersList(GET_COUNT)
    }, [setHeaderTitle, getOrdersList])

    return (
        <Switch>
            <Route exact path={path} render={() => <OrdersList {...props} />} />
            <Route path={`${path}/add`} render={() => <OrderControl />} />
        </Switch>
    )
}

const OrdersConnected = connect(mapStateToProps, mapDispatchToProps)(Orders)

export { OrdersConnected as Orders }
