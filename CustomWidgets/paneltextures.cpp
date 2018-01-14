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

#include "paneltextures.h"
#include "ui_paneltextures.h"
#include "systemspritewall.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelTextures::PanelTextures(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelTextures)
{
    ui->setupUi(this);
}

PanelTextures::~PanelTextures()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QRect PanelTextures::getTilesetTexture() const{
    return ui->widgetTilesetSelector->currentTexture();
}

// -------------------------------------------------------

void PanelTextures::setTilesetImage(QString path){
    ui->widgetTilesetSelector->setImage(path);
    updateTilesetImage();
}

// -------------------------------------------------------

void PanelTextures::setTilesetImageNone(){
    ui->widgetTilesetSelector->setImageNone();
    updateTilesetImage();
}

// -------------------------------------------------------

void PanelTextures::updateTilesetImage(){
    this->setGeometry(0, 0,
                      ui->widgetTilesetSelector->width(),
                      ui->widgetTilesetSelector->height());
    setFixedSize(ui->widgetTilesetSelector->width(),
                 ui->widgetTilesetSelector->height());
}

// -------------------------------------------------------

void PanelTextures::showTileset() {
    ui->comboBox->hide();
    ui->widgetTilesetSelector->show();
}

// -------------------------------------------------------

int PanelTextures::getID(MapEditorSubSelectionKind subSelection) const {
    Map* map = Wanok::get()->project()->currentMap();

    if (map != nullptr) {
        SystemTileset* tileset = map->mapProperties()->tileset();
        int index = ui->comboBox->currentIndex();

        switch(subSelection) {
        case MapEditorSubSelectionKind::SpritesWall:
            return SuperListItem::getIdByIndex(tileset->modelSpriteWalls(),
                                               index);
        default:
            break;
        }
    }

    return -1;
}

// -------------------------------------------------------

void PanelTextures::showComboBox() {
    ui->comboBox->show();
    ui->widgetTilesetSelector->hide();
    this->setGeometry(0, 0, 210, 27);
    setFixedSize(210, 27);
}

// -------------------------------------------------------

void PanelTextures::showSpriteWalls(SystemTileset* tileset) {
    showComboBox();

    tileset->updateModelSpriteWalls();
    QStandardItemModel* model = tileset->modelSpriteWalls();
    QStandardItemModel* modelComplete = Wanok::get()->project()
            ->specialElementsDatas()->modelSpriteWalls();

    // ComboBox filling
    ui->comboBox->clear();
    SuperListItem::fillComboBox(ui->comboBox, model);
    for (int i = 0; i < ui->comboBox->count(); i++) {
        SuperListItem* super = (SuperListItem*) model->item(i)->data()
                .value<quintptr>();
        SystemSpriteWall* wall = (SystemSpriteWall*) SuperListItem::getById(
                    modelComplete->invisibleRootItem(), super->id());

        ui->comboBox->setItemIcon(i, QIcon(wall->picture()
                                           ->getPath(PictureKind::Walls)));
    }
}
