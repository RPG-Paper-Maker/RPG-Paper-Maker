/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

type Props = {
    onOK: () => void,
    onCancel: () => void
};

function FooterOK({ onOK, onCancel }: Props) {
    return (
        <div>
            <button onClick={onCancel}>Cancel</button>
            <button onClick={onOK}>OK</button>
        </div>
    );
}

export default FooterOK;