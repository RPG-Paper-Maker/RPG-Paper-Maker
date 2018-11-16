/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#ifndef DIALOGCOMMANDTELEPORTOBJECTSELECT_H
#define DIALOGCOMMANDTELEPORTOBJECTSELECT_H

#include <QDialog>
#include <QModelIndex>
#include "treemapdatas.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandTeleportObjectSelect
//
//  A dialog used for selecting a position for teleporting
//  (displaying the maps).
//
// -------------------------------------------------------

namespace Ui {
class DialogSelectPosition;
}

class DialogSelectPosition : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSelectPosition(int idMap, int x, int y,
                                               int yPlus, int z,
                                               QWidget *parent = 0);
    ~DialogSelectPosition();
    int idMap() const;
    QString mapName() const;
    int x() const;
    int y() const;
    int yPlus() const;
    int z() const;
    TreeMapTag* currentTag() const;

private:
    Ui::DialogSelectPosition *ui;
    TreeMapDatas* m_treeMapDatas;

private slots:
    void on_spinBoxX_valueChanged(int i);
    void on_spinBoxY_valueChanged(int i);
    void on_spinBoxYplus_valueChanged(int i);
    void on_spinBoxZ_valueChanged(int i);
    void accept();
};

#endif // DIALOGCOMMANDTELEPORTOBJECTSELECT_H
