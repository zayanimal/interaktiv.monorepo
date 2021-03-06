/* eslint-disable @typescript-eslint/indent */
import { createAction, createAsyncAction } from 'typesafe-actions'

export const getUsersList = createAsyncAction(
    '[ADMIN] GET_USERS_REQUEST',
    '[ADMIN] GET_USERS_SUCCESS',
    '[ADMIN] GET_USERS_FAILURE'
)<number, unknown, undefined>()

export const removeUser = createAction('[ADMIN] REMOVE_USER')<string>()

export const setFiltredUsersList = createAction('[ADMIN] SET_FILTRED_USERS_LIST')<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any[]
>()

export const setUserEditMode = createAction('[ADMIN] SET_USER_EDIT_MODE')<boolean>()

export const setUserEditName = createAction('[ADMIN] SET_USER_EDIT_NAME')<string>()
