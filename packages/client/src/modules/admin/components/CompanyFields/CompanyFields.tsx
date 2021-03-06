import React from 'react'
import { CompanyControlProps } from '@admin/containers/CompanyControl'
import { Fields } from '@interaktiv/ui/Fields'
import { CONTACT_FIELDS, FORM_FIELDS } from '@admin/constants/data-fields.constant'

const CompanyFields: React.FC<CompanyControlProps> = (props) => {
    const { companyForm, updateCompanyForm, contactForm, updateContactForm } = props

    return (
        <>
            <Fields
                fields={FORM_FIELDS}
                entity={companyForm}
                handler={updateCompanyForm}
            />
            <Fields
                fields={CONTACT_FIELDS}
                entity={contactForm}
                handler={updateContactForm}
            />
        </>
    )
}

export { CompanyFields }
