/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELDAMAGESKIND_H
#define PANELDAMAGESKIND_H

#include <QWidget>
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS PanelDamagesKind
//
//  The panel for damages and costs.
//
// -------------------------------------------------------

namespace Ui {
class PanelDamagesKind;
}

class PanelDamagesKind : public QWidget
{
    Q_OBJECT

public:
    explicit PanelDamagesKind(QWidget *parent = nullptr);
    ~PanelDamagesKind();

    void initialize(PrimitiveValue *statisticID, PrimitiveValue *currencyID,
        SuperListItem *variableID, SuperListItem *kind);
    void hideAll();
    void showElement();

private:
    Ui::PanelDamagesKind *ui;
    PrimitiveValue *m_statisticID;
    PrimitiveValue *m_currencyID;
    SuperListItem *m_variableID;
    SuperListItem *m_kind;

public slots:
    void on_comboBoxChoice_currentIndexChanged(int index);
};

#endif // PANELDAMAGESKIND_H
