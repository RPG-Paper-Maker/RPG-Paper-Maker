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

#ifndef PANELSPRITEWALLS_H
#define PANELSPRITEWALLS_H

#include <QWidget>
#include "systemspritewall.h"

// -------------------------------------------------------
//
//  CLASS PanelSpriteWalls
//
//  The sprite walls panel (complete list).
//
// -------------------------------------------------------

namespace Ui {
class PanelSpriteWalls;
}

class PanelSpriteWalls : public QWidget
{
    Q_OBJECT

public:
    explicit PanelSpriteWalls(QWidget *parent = 0);
    ~PanelSpriteWalls();
    void initialize();
    void update(SystemSpriteWall* sys);

private:
    Ui::PanelSpriteWalls *ui;

private slots:
    void on_pageSelected(QModelIndex index, QModelIndex);
    void on_pictureChanged(SystemPicture* picture);
};

#endif // PANELSPRITEWALLS_H
