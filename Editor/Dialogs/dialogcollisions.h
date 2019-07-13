/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOLLISIONS_H
#define DIALOGCOLLISIONS_H

#include <QDialog>
#include "systemtileset.h"
#include "systemautotile.h"
#include "systemspritewall.h"
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
    void initializeAutotiles();
    void updateAutotile(SystemAutotile* autotile);
    void initializeWalls();
    void updateWall(SystemSpriteWall* wall);

private slots:
    void on_tilesetSelected(QModelIndex index, QModelIndex);
    void on_characterSelected(QModelIndex index, QModelIndex);
    void on_autotileSelected(QModelIndex index, QModelIndex);
    void on_wallSelected(QModelIndex index, QModelIndex);
};

#endif // DIALOGCOLLISIONS_H
