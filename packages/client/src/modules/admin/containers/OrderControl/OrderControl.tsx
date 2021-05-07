import React, { useEffect } from 'react'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import { Table } from '@interaktiv/ui'
import { GoodsList } from '@shared/components/GoodsList'
import { OrderControlDrawer } from '@admin/components/OrderControlDrawer'
import { orderControlSelectors } from '@admin/store/selectors'
import { orderControlActions } from '@admin/store/actions'
import { bem } from '@interaktiv/utils'
import type { RootStateTypes } from '@config/roots'
import { columns } from './OrderControl.columns'

const cn = bem('OrderControl')
const grid = bem('FlexGrid')

const mapStateToProps = (state: RootStateTypes) => ({
    goodsInputValue: orderControlSelectors.goodsInputValue(state),
    goods: orderControlSelectors.goods(state),
    goodsInOrder: orderControlSelectors.goodsInOrder(state),
    goodsSelected: orderControlSelectors.goodsSelected(state),
    goodsListOpen: orderControlSelectors.goodsListOpen(state),
    drawerOpen: orderControlSelectors.drawerOpen(state)
})

const mapDispatchToProps = {
    fetchPrice: orderControlActions.fetchPriceList.request,
    sendNewProject: orderControlActions.sendNewProject,
    setGoodsInputValue: orderControlActions.setGoodsInputValue,
    filterModels: orderControlActions.filterModels,
    cleanPrice: orderControlActions.cleanPriceList,
    putGoodInOrder: orderControlActions.putGoodInOrder,
    deleteModelInOrder: orderControlActions.deleteModelInOrder,
    updateModelInOrder: orderControlActions.updateModelInOrder,
    showGoodsList: orderControlActions.showGoodsList,
    setDrawerOpen: orderControlActions.setDrawerOpen
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

const OrderControl: React.FC<Props> = (props) => {
    const {
        fetchPrice,
        goodsSelected,
        goodsInputValue,
        setGoodsInputValue,
        filterModels,
        cleanPrice,
        goods,
        goodsInOrder,
        putGoodInOrder,
        goodsListOpen,
        showGoodsList,
        sendNewProject,
        drawerOpen,
        setDrawerOpen
    } = props

    useEffect(() => {
        fetchPrice()

        return () => {
            cleanPrice()
        }
    }, [fetchPrice, cleanPrice])

    const orderHandler = (value: string | null): void => {
        if (goodsInOrder.some(({ model }) => model === value)) return

        putGoodInOrder({
            // eslint-disable-next-line prefer-object-spread
            ...Object.assign(
                {},
                goods.find(({ model }) => model === value)
            ),
            count: 1
        })
    }

    const onDrawerOpen = () => setDrawerOpen(true)

    return (
        <div className={grid('row')}>
            <div className={grid('col-3')}>
                <Button
                    color="secondary"
                    variant="outlined"
                    style={{ width: '100%' }}
                    onClick={onDrawerOpen}>
                    Заказчик
                </Button>
                <GoodsList
                    value={goodsInputValue}
                    setValue={setGoodsInputValue}
                    selected={goodsSelected}
                    filterModels={filterModels}
                    onPick={orderHandler}
                    listState={goodsListOpen}
                    onShowList={showGoodsList}
                />
            </div>
            <div className={grid('col-9')}>
                <div style={{ height: 'calc(100vh - 12em)' }}>
                    <Table columns={columns} list={[]} />
                </div>
                <div className={cn('controls')}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={sendNewProject}>
                        Отправить запрос
                    </Button>
                </div>
            </div>
            <OrderControlDrawer open={drawerOpen} onSetOpen={setDrawerOpen} />
        </div>
    )
}

const OrderControlConnected = connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderControl)

export { OrderControlConnected as OrderControl }
