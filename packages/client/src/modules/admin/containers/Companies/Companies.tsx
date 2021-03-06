import React, { useEffect } from 'react'
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'
import { connect } from 'react-redux'
import { RootStateTypes } from '@config/roots'
import { systemActions } from '@system/store/actions'
import { companiesActions, companyControlActions } from '@admin/store/actions'
import { companySelectors } from '@admin/store/selectors'
import { CompaniesList } from '@admin/components/CompaniesList'
import { CompanyControl } from '@admin/containers/CompanyControl'

const mapStateToProps = (state: RootStateTypes) => ({
    list: companySelectors.list(state),
    meta: companySelectors.meta(state)
})

const mapDispatchToProps = {
    setHeaderTitle: systemActions.setHeaderTitle,
    getCompaniesList: companiesActions.getCompaniesList.request,
    deleteCompany: companyControlActions.deleteCompany,
    setCompanyEditName: companiesActions.setCompanyEditName,
    setFetched: companyControlActions.setFetched,
    clearForms: companyControlActions.clearForms
}

export type CompaniesProps = ReturnType<typeof mapStateToProps> &
    typeof mapDispatchToProps

const Companies: React.FC<CompaniesProps> = (props) => {
    const { setHeaderTitle, getCompaniesList, meta, clearForms } = props
    const { pathname } = useLocation()
    const { path } = useRouteMatch()

    useEffect(() => {
        if (pathname === '/companies') {
            setHeaderTitle('Управление компаниями')
            clearForms()

            const GET_COUNT = 1

            if (!meta.currentPage) {
                getCompaniesList(GET_COUNT)
            }
        }
    }, [getCompaniesList, setHeaderTitle, pathname, meta, clearForms])

    return (
        <Switch>
            <Route path={`${path}/add`} component={CompanyControl} />
            <Route path={`${path}/edit/:id`} component={CompanyControl} />
            <Route exact path={path} render={() => <CompaniesList {...props} />} />
        </Switch>
    )
}

const CompaniesConnected = connect(mapStateToProps, mapDispatchToProps)(Companies)

export { CompaniesConnected as Companies }
