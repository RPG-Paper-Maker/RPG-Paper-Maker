/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#ifndef PANELPROGRESSIONTABLE_H
#define PANELPROGRESSIONTABLE_H

// -------------------------------------------------------
//
//  CLASS PanelProgressionTable
//
//  A panel used for progression tables (monsters rewards).
//
// -------------------------------------------------------

#include <QWidget>
#include "systemprogressiontable.h"

namespace Ui {
class PanelProgressionTable;
}

class PanelProgressionTable : public QWidget
{
    Q_OBJECT

public:
    static const QString NAME_EXPERIENCE;

    explicit PanelProgressionTable(QWidget *parent = nullptr);
    ~PanelProgressionTable();
    SystemProgressionTable * progression() const;
    void setProgression(SystemProgressionTable *progression);
    int maxLevel() const;
    void setMaxLevel(int l);

    void updateProgress();

private:
    Ui::PanelProgressionTable *ui;
    SystemProgressionTable *m_progression;
    bool m_updating;
    int m_maxLevel;

public slots:
    void on_spinBoxInit_valueChanged(int i);
    void on_spinBoxFinal_valueChanged(int i);
    void on_horizontalSlider_valueChanged(int i);
    void on_pushButtonReset_clicked();
};

#endif // PANELPROGRESSIONTABLE_H
