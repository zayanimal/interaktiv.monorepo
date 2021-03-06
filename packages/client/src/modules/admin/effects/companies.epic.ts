import { merge, of } from 'rxjs'
import { catchError, filter, map, mergeMap } from 'rxjs/operators'
import { Epic } from '@config/interfaces'
import { isActionOf } from 'typesafe-actions'
import { systemActions } from '@system/store/actions'
import { companiesActions } from '@admin/store/actions'

export const getCompaniesList: Epic = (action$, _, { company }) =>
    action$.pipe(
        filter(isActionOf(companiesActions.getCompaniesList.request)),
        mergeMap(({ payload }) => company.getList$(payload)),
        map(({ response }) => companiesActions.getCompaniesList.success(response)),
        catchError((err, caught) =>
            merge(caught, of(systemActions.errorNotification(err.message)))
        )
    )
