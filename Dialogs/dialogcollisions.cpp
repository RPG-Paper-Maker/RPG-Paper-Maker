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

#include "dialogcollisions.h"
#include "ui_dialogcollisions.h"
#include "wanok.h"

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
    setFixedSize(geometry().width(), geometry().height());

    initializeTilesets();
    initializeCharacters();
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

void DialogCollisions::initializeTilesets() {

    // Initialize name & pictures
    ui->panelSuperListTilesets->list()->initializeNewItemInstance(
                new SystemTileset);
    ui->panelSuperListTilesets->initializeModel(Wanok::get()->project()
                                                ->gameDatas()->tilesetsDatas()
                                                ->model());
    connect(ui->panelSuperListTilesets->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_tilesetSelected(QModelIndex,QModelIndex)));
    ui->widgetTilesetPictureSettings->setKind(PictureKind::Tilesets);

    // Select the first tileset
    QModelIndex index = ui->panelSuperListTilesets->list()->getModel()
            ->index(0,0);
    ui->panelSuperListTilesets->list()->setIndex(0);
    on_tilesetSelected(index,index);
}

// -------------------------------------------------------

void DialogCollisions::updateTileset(SystemTileset* tileset) {
    SystemPicture* picture = tileset->picture();
    ui->widgetTilesetPictureSettings->setSquares(picture->collisions());
    ui->widgetTilesetPictureSettings->updateImage(picture);
}

// -------------------------------------------------------

void DialogCollisions::initializeCharacters() {

    // Initialize name & pictures
    ui->panelSuperListCharacters->list()->initializeNewItemInstance(
                new SystemPicture);
    ui->panelSuperListCharacters->initializeModel(Wanok::get()->project()
                                              ->picturesDatas()
                                              ->model(PictureKind::Characters));
    connect(ui->panelSuperListCharacters->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_characterSelected(QModelIndex,QModelIndex)));
    ui->widgetCharacterPraticable->setKind(PictureKind::Characters);
    ui->widgetCharacterPraticable->deleteDirectionTab();

    // Select the first tileset
    QModelIndex index = ui->panelSuperListCharacters->list()->getModel()
            ->index(0,0);
    ui->panelSuperListCharacters->list()->setIndex(0);
    on_characterSelected(index,index);
}

// -------------------------------------------------------

void DialogCollisions::updateCharacter(SystemPicture* picture) {
    ui->widgetCharacterPraticable->setSquares(picture->collisions());
    ui->widgetCharacterPraticable->updateImage(picture);
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
