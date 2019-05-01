/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "dialogcollisions.h"
#include "ui_dialogcollisions.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCollisions::DialogCollisions(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogCollisions)
{
    ui->setupUi(this);
    

    initializeTilesets();
    initializeCharacters();
    initializeAutotiles();
    initializeWalls();
}

DialogCollisions::~DialogCollisions()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCollisions::disablePanelListEdition(PanelSuperList* panel) {
    panel->showEditName(false);
    panel->showButtonMax(false);
    panel->list()->setHasContextMenu(false);
    panel->list()->setCanDragAndDrop(false);
}

// -------------------------------------------------------

void DialogCollisions::initializeTilesets() {

    // Initialize name & pictures
    ui->panelSuperListTilesets->list()->initializeNewItemInstance(
                new SystemTileset);
    ui->panelSuperListTilesets->initializeModel(RPM::get()->project()
                                                ->gameDatas()->tilesetsDatas()
                                                ->model());
    connect(ui->panelSuperListTilesets->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_tilesetSelected(QModelIndex,QModelIndex)));
    ui->widgetTilesetPictureSettings->setKind(PictureKind::Tilesets);
    disablePanelListEdition(ui->panelSuperListTilesets);

    // Select the first tileset
    QModelIndex index = ui->panelSuperListTilesets->list()->getModel()
            ->index(0,0);
    ui->panelSuperListTilesets->list()->setIndex(0);
    on_tilesetSelected(index,index);
}

// -------------------------------------------------------

void DialogCollisions::updateTileset(SystemTileset* tileset) {
    SystemPicture* picture = tileset->picture();
    ui->widgetTilesetPictureSettings->updateImage(picture);
}

// -------------------------------------------------------

void DialogCollisions::initializeCharacters() {

    // Initialize name & pictures
    ui->panelSuperListCharacters->list()->initializeNewItemInstance(
                new SystemPicture);
    ui->panelSuperListCharacters->list()->setAreNegIDsEnabled(false);
    ui->panelSuperListCharacters->initializeModel(RPM::get()->project()
                                              ->picturesDatas()
                                              ->model(PictureKind::Characters));
    connect(ui->panelSuperListCharacters->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_characterSelected(QModelIndex,QModelIndex)));
    ui->widgetCharacterPraticable->setKind(PictureKind::Characters);
    ui->widgetCharacterPraticable->deleteDirectionTab();
    ui->widgetCharacterPraticable->showRepeat();
    disablePanelListEdition(ui->panelSuperListCharacters);

    // Select the first tileset
    QModelIndex index = ui->panelSuperListCharacters->list()->getModel()
            ->index(0,0);
    ui->panelSuperListCharacters->list()->setIndex(0);
    on_characterSelected(index,index);
}

// -------------------------------------------------------

void DialogCollisions::updateCharacter(SystemPicture* picture) {
    ui->widgetCharacterPraticable->updateImage(picture);
    ui->widgetCharacterPraticable->disableNone(picture->id() == -1);
}

// -------------------------------------------------------

void DialogCollisions::initializeAutotiles() {

    // Initialize name & pictures
    ui->panelSuperListAutotiles->list()->initializeNewItemInstance(
                new SystemAutotile);
    ui->panelSuperListAutotiles->initializeModel(RPM::get()->project()
                                                 ->specialElementsDatas()
                                                 ->modelAutotiles());
    connect(ui->panelSuperListAutotiles->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_autotileSelected(QModelIndex,QModelIndex)));
    ui->widgetAutotilePictureSettings->setKind(PictureKind::Autotiles);
    disablePanelListEdition(ui->panelSuperListAutotiles);

    // Select the first tileset
    QModelIndex index = ui->panelSuperListAutotiles->list()->getModel()
            ->index(0,0);
    ui->panelSuperListAutotiles->list()->setIndex(0);
    on_autotileSelected(index,index);
}

// -------------------------------------------------------

void DialogCollisions::updateAutotile(SystemAutotile* autotile) {
    SystemPicture* picture = autotile->picture();
    ui->widgetAutotilePictureSettings->updateImageAutotile(picture);
}

// -------------------------------------------------------

void DialogCollisions::initializeWalls() {

    // Initialize name & pictures
    ui->panelSuperListWalls->list()->initializeNewItemInstance(
                new SystemSpriteWall);
    ui->panelSuperListWalls->initializeModel(RPM::get()->project()
                                             ->specialElementsDatas()
                                             ->modelSpriteWalls());
    connect(ui->panelSuperListWalls->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_wallSelected(QModelIndex,QModelIndex)));
    ui->widgetWallPraticable->setKind(PictureKind::Walls);
    ui->widgetWallPraticable->deleteDirectionTab();
    disablePanelListEdition(ui->panelSuperListWalls);

    // Select the first tileset
    QModelIndex index = ui->panelSuperListWalls->list()->getModel()
            ->index(0,0);
    ui->panelSuperListWalls->list()->setIndex(0);
    on_wallSelected(index,index);
}

// -------------------------------------------------------

void DialogCollisions::updateWall(SystemSpriteWall *wall) {
    SystemPicture* picture = wall->picture();
    ui->widgetWallPraticable->updateImage(picture);
    ui->widgetWallPraticable->disableNone(picture->id() == -1);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCollisions::on_tilesetSelected(QModelIndex index, QModelIndex) {
    QStandardItem* selected = ui->panelSuperListTilesets->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr)
        updateTileset((SystemTileset*)selected->data().value<quintptr>());
}

// -------------------------------------------------------

void DialogCollisions::on_characterSelected(QModelIndex index, QModelIndex) {
    QStandardItem* selected = ui->panelSuperListCharacters->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr)
        updateCharacter((SystemPicture*)selected->data().value<quintptr>());
}

// -------------------------------------------------------

void DialogCollisions::on_autotileSelected(QModelIndex index, QModelIndex) {
    QStandardItem* selected = ui->panelSuperListAutotiles->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr)
        updateAutotile((SystemAutotile*)selected->data().value<quintptr>());
}

// -------------------------------------------------------

void DialogCollisions::on_wallSelected(QModelIndex index, QModelIndex) {
    QStandardItem* selected = ui->panelSuperListWalls->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr)
        updateWall((SystemSpriteWall*)selected->data().value<quintptr>());
}
