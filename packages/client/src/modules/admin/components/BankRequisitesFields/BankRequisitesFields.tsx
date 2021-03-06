import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Clear from '@material-ui/icons/Clear'
import { Fields } from '@interaktiv/ui/Fields'
import { bem } from '@interaktiv/utils'
import { BANK_FIELDS } from '@admin/constants'
import { CompanyControlProps } from '@admin/containers/CompanyControl'
import './BankRequisitesFields.scss'

const cn = bem('BankRequisitesFields')

const BankRequisitesFields: React.FC<CompanyControlProps> = (props) => {
    const { bankRequisites, updateBankForm, deleteBankForm } = props

    const TIMEOUT = 10

    const onDelete = (id: string) => () =>
        setTimeout(() => deleteBankForm(id), TIMEOUT)

    return bankRequisites ? (
        <>
            {bankRequisites.map((req) => (
                <div key={req.id} className={cn()}>
                    <IconButton
                        size="small"
                        className={cn('button')}
                        onClick={onDelete(req.id)}>
                        <Clear className={cn('icon')} />
                    </IconButton>
                    <Fields
                        fields={BANK_FIELDS}
                        entity={req}
                        handler={updateBankForm}
                    />
                </div>
            ))}
        </>
    ) : null
}

export { BankRequisitesFields }
