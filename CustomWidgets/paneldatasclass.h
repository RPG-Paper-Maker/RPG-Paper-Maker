/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef PANELDATASCLASS_H
#define PANELDATASCLASS_H

#include <QWidget>
#include "systemclass.h"

// -------------------------------------------------------
//
//  CLASS PanelDatasClass
//
//  A panel used for classes, heroes, and monsters.
//
// -------------------------------------------------------

namespace Ui {
class PanelDatasClass;
}

class PanelDatasClass : public QWidget
{
    Q_OBJECT

public:
    static const QString NAME_LEVEL;
    static const QString NAME_EXPERIENCE;

    explicit PanelDatasClass(QWidget *parent = nullptr);
    ~PanelDatasClass();

    void initialize();
    void update(SystemClass *sysClass, SystemClass *originalClass);

private:
    Ui::PanelDatasClass *ui;
    SystemClass *m_class;
    SystemClass *m_originalClass;
    bool m_completingTableExp;

    int getInheritValue(int v1, int v2);
    void updateExperience();
    void updateTotalExperience();

public slots:
    void on_spinBoxClassInitialLevel_valueChanged(int i);
    void on_spinBoxClassMaxLevel_valueChanged(int i);
    void on_spinBoxClassBase_valueChanged(int i);
    void on_spinBoxClassInflation_valueChanged(int i);
    void on_pushButtonSetClassValues_clicked();
    void on_cellUpdateValueExp(int row, int column);
};

#endif // PANELDATASCLASS_H
