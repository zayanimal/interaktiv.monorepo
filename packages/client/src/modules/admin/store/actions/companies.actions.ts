import { createAction, createAsyncAction } from 'typesafe-actions'

export const getCompaniesList = createAsyncAction(
    '[ADMIN] GET_COMPANIES_REQUEST',
    '[ADMIN] GET_COMPANIES_SUCCESS',
    '[ADMIN] GET_COMPANIES_FAILURE'
)<number, unknown, undefined>()

export const setFiltredCompaniesList = createAction(
    '[ADMIN] SET_FILTRED_COMPANIES_LIST'
)<string>()

export const setCompanyEditMode = createAction(
    '[ADMIN] SET_COMPANY_EDIT_MODE'
)<boolean>()

export const setCompanyEditName = createAction(
    '[ADMIN] SET_COMPANY_EDIT_NAME'
)<string>()
