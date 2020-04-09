/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

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
#include "systemmountain.h"
#include "systemobject3d.h"
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
    explicit DialogCollisions(QWidget *parent = nullptr);
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
    void initializeMountains();
    void updateMountain(SystemMountain *mountain);
    void initializeObjects3D();
    void updateObject3D(SystemObject3D *object);
    void translate();

private slots:
    void on_tilesetSelected(QModelIndex index, QModelIndex);
    void on_characterSelected(QModelIndex index, QModelIndex);
    void on_autotileSelected(QModelIndex index, QModelIndex);
    void on_wallSelected(QModelIndex index, QModelIndex);
    void on_mountainSelected(QModelIndex index, QModelIndex);
    void on_object3DSelected(QModelIndex index, QModelIndex);
    void on_comboBoxCollisionMountains_currentIndexChanged(int index);
    void on_comboBoxCollisionObject3D_currentIndexChanged(int index);
};

#endif // DIALOGCOLLISIONS_H
