/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef COMBOBOX_WHEEL_H
#define COMBOBOX_WHEEL_H

#include <QComboBox>

// -------------------------------------------------------
//
//  CLASS ComboBoxWheel
//
//  A combobox that doesn't change index with mousewheel.
//
// -------------------------------------------------------

class ComboBoxWheel : public QComboBox
{
    Q_OBJECT
public:
    explicit ComboBoxWheel(QWidget *parent = nullptr);

protected:
    void wheelEvent(QWheelEvent *);
};

#endif // QCOMBOBOX_WHEEL_H
