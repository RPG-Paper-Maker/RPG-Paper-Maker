/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
