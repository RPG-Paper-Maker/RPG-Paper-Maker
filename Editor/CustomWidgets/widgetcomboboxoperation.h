/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETCOMBOBOXOPERATION_H
#define WIDGETCOMBOBOXOPERATION_H

#include <QComboBox>

// -------------------------------------------------------
//
//  CLASS WidgetComboBoxOperation
//
//  A comboBox used for operation comparaison.
//
// -------------------------------------------------------

class WidgetComboBoxOperation : public QComboBox
{
    Q_OBJECT
public:
    explicit WidgetComboBoxOperation(QWidget *parent = nullptr);

    static QString toString(int operation);
    QString operation() const;
};

#endif // WIDGETCOMBOBOXOPERATION_H
