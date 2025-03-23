import React from "react";
import classNames from 'classnames';

interface ButtonProps{
    children?: React.ReactNode,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    className?: string,
    disabled?: boolean,
}



export const Button = ({children = 'Default button', onClick =() => {}, className = '', disabled = false}: ButtonProps) => {

    function onClickAction(e: React.MouseEvent<HTMLButtonElement>) {
        if (disabled) {
            e.preventDefault();
        } else {
            onClick(e);
        }
    }

    const classes = classNames( 'btn',
        className
        )

    




    return(
        <button
            className={classes}
            disabled={disabled}
            onClick={onClickAction}
            >{children}</button>
    );
};