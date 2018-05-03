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

#ifndef DIALOGCOLLISIONS_H
#define DIALOGCOLLISIONS_H

#include <QDialog>
#include "systemtileset.h"
#include "panelsuperlist.h"

// -------------------------------------------------------
//
//  CLASS DialogCollisions
//
//  A dialog used for editing collisions in the game.
//
// -------------------------------------------------------

namespace Ui {
class DialogCollisions;
}

class DialogCollisions : public QDialog
{
    Q_OBJECT

public:
    explicit DialogCollisions(QWidget *parent = 0);
    ~DialogCollisions();

private:
    Ui::DialogCollisions *ui;

    void disablePanelListEdition(PanelSuperList *panel);
    void initializeTilesets();
    void updateTileset(SystemTileset* tileset);
    void initializeCharacters();
    void updateCharacter(SystemPicture* picture);

private slots:
    void on_tilesetSelected(QModelIndex index, QModelIndex);
    void on_characterSelected(QModelIndex index, QModelIndex);
};

#endif // DIALOGCOLLISIONS_H
