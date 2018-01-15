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

#include "panelspecialelements.h"
#include "ui_panelspecialelements.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelSpecialElements::PanelSpecialElements(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelSpecialElements)
{
    ui->setupUi(this);

    initialize();
}

PanelSpecialElements::~PanelSpecialElements()
{
    delete ui;
}

int PanelSpecialElements::currentIndex() const {
    return superList()->list()->getIndex();
}

PanelSuperList *PanelSpecialElements::superList() const {
    return ui->panelSuperList;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelSpecialElements::initialize() {
    ui->panelSuperList->list()->initializeNewItemInstance(new SystemSpriteWall);
    ui->panelSuperList->initializeModel(Wanok::get()->project()
                                        ->specialElementsDatas()
                                        ->modelSpriteWalls());
    connect(ui->panelSuperList->list()->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(on_pageSelected(QModelIndex,QModelIndex)));
    ui->widgetPicture->setKind(PictureKind::Walls);
    ui->widgetTilesetSettings->setKind(PictureKind::Walls);
    connect(ui->widgetPicture, SIGNAL(pictureChanged(SystemPicture*)),
            this, SLOT(on_pictureChanged(SystemPicture*)));
    QModelIndex index = ui->panelSuperList->list()->getModel()->index(0,0);
    ui->panelSuperList->list()->setIndex(0);
    on_pageSelected(index,index);
}

// -------------------------------------------------------

void PanelSpecialElements::update(SystemSpriteWall* sys) {
    SystemPicture* picture = sys->picture();

    ui->widgetPicture->setPicture(picture);
    ui->widgetTilesetSettings->updateImage(picture);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelSpecialElements::on_pageSelected(QModelIndex index, QModelIndex) {
    QStandardItem* selected = ui->panelSuperList->list()->getModel()
            ->itemFromIndex(index);
    if (selected != nullptr)
        update((SystemSpriteWall*) selected->data().value<quintptr>());
}

// -------------------------------------------------------

void PanelSpecialElements::on_pictureChanged(SystemPicture* picture) {
    SystemSpriteWall* wall = (SystemSpriteWall*) ui->panelSuperList->list()
            ->getSelected()->data().value<quintptr>();
    wall->setPictureID(picture->id());
    ui->widgetTilesetSettings->updateImage(picture);
}
