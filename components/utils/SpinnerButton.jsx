import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SpinnerButton = ({ isLoading, type, onClick, children, loadingText, ...props }) => {   
    const { t } = useTranslation();
    if(!type)type = 'button';
    return (
        <Button onClick={onClick} disabled={isLoading} type={type} {...props}>
            {isLoading ? (
            <>
                <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2 text-white"
                />
                <span className="text-white">{ loadingText ? loadingText : t('loading')}</span>
            </>
            ) : (
            children
            )}
        </Button>
    );
};

export default SpinnerButton;
