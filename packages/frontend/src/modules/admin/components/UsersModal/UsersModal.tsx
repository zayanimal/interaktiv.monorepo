import React from 'react';
import { Modal } from '@system/components/Modal';
import {
    Input,
    Select,
    MenuItem
} from '@material-ui/core';
import { bem } from '@utils/formatters';
import './UsersModal.scss';

const cn = bem('UsersModal');

interface Props {
    open: boolean;
}

const UsersModal: React.FC<Props> = (props) => {
    const { open } = props;

    return (
        <Modal
            open={open}
            title="Добавить пользователя"
            action={{
                actionName: 'Добавить',
                actionCall: () => {}
            }}
        >
            <div className={cn()}>
                <Input
                    className={cn('input')}
                    type="text"
                    placeholder="Пользователь"
                />
                <Input
                    className={cn('input')}
                    type="password"
                    placeholder="Пароль"
                />
                <Select
                    className={cn('select')}
                    placeholder="Роль"
                    onOpen={() => {}}
                >
                    <MenuItem value={10}>customer</MenuItem>
                </Select>
                <Select
                    className={cn('select')}
                    placeholder="Права"
                    onOpen={() => {}}
                >
                    <MenuItem value={10}>ALL_ORDERS</MenuItem>
                </Select>
            </div>
        </Modal>
    );
};

export { UsersModal };
