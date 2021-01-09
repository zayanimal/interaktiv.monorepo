import React from 'react';
import { InputLabel, TextField } from '@material-ui/core';
import { handleInput } from '@utils/handlers';
import { UserControlProps } from '@admin/containers/UserControl';
import { bem } from '@utils/formatters';

const grid = bem('FlexGrid');

const UserContactsFields: React.FC<UserControlProps> = (props) => {
    const {
        email,
        setEmail,
        phone,
        setPhone,
        position,
        setPosition,
        errorEmail,
        errorPhone,
        errorPosition,
    } = props;

    return (
        <>
            <InputLabel>Почта</InputLabel>
            <TextField
                error={!!errorEmail}
                helperText={errorEmail}
                className={grid('input')}
                type="email"
                value={email}
                onChange={handleInput(setEmail)}
            />
            <InputLabel>Телефон</InputLabel>
            <TextField
                error={!!errorPhone}
                helperText={errorPhone}
                className={grid('input')}
                type="text"
                value={phone}
                onChange={handleInput(setPhone)}
            />
            <InputLabel>Должность</InputLabel>
            <TextField
                error={!!errorPosition}
                helperText={errorPosition}
                className={grid('input')}
                type="text"
                value={position}
                onChange={handleInput(setPosition)}
            />
        </>
    );
};

export { UserContactsFields };