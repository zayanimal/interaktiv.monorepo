import { createReducer, getType } from 'typesafe-actions'
import { companiesActions } from '@admin/store/actions'
import { ICompaniesInitialState } from '@admin/types'

const initialState = {
    list: [],
    meta: {
        currentPage: 0,
        itemCount: 0,
        itemsPerPage: 0,
        totalItems: 0,
        totalPages: 0
    },
    companyEditMode: true,
    companyEditName: ''
}

export const companies = createReducer<ICompaniesInitialState>(initialState, {
    [getType(companiesActions.getCompaniesList.success)]: (state, { payload }) => ({
        ...state,
        list: [...state.list, ...payload.items],
        meta: payload.meta
    }),

    [getType(companiesActions.setFiltredCompaniesList)]: (state, { payload }) => ({
        ...state,
        list: state.list.filter((item) => item?.id !== payload)
    }),

    [getType(companiesActions.setCompanyEditMode)]: (state, { payload }) => ({
        ...state,
        companyEditMode: payload
    }),

    [getType(companiesActions.setCompanyEditName)]: (state, { payload }) => ({
        ...state,
        companyEditName: payload
    })
})
