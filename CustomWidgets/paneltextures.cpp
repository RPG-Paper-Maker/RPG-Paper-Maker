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

void PanelTextures::hideAll() {
    ui->widgetTilesetSelector->hide();
    ui->widgetWallPreview->hide();
    ui->comboBox->hide();
    ui->labelInformation->hide();
}

// -------------------------------------------------------

void PanelTextures::showTileset() {
    hideAll();
    ui->widgetTilesetSelector->show();
}

// -------------------------------------------------------

int PanelTextures::getID() const {
    SystemTileset* tileset = Wanok::get()->project()->currentMap()
            ->mapProperties()->tileset();
    int index = ui->comboBox->currentIndex();

    return SuperListItem::getIdByIndex(tileset->model(m_kind), index);
}

// -------------------------------------------------------

void PanelTextures::showComboBox() {
    updateComboBoxSize();

    // Setting label text
    if (ui->comboBox->count() == 0) {
        ui->labelInformation->show();
        ui->labelInformation->setText(createlabelText());
        this->setGeometry(0, 0,
                          this->parentWidget()->geometry().width(),
                          this->parentWidget()->geometry().height());
        setFixedSize(this->parentWidget()->geometry().width(),
                     this->parentWidget()->geometry().height());
        ui->comboBox->hide();
    }
    else {
        ui->labelInformation->hide();
        ui->comboBox->show();
    }
}

// -------------------------------------------------------

void PanelTextures::updateComboBoxSize() {
    ui->comboBox->setGeometry(0, 0, this->parentWidget()->geometry().width(),
                              ui->comboBox->geometry().height());
    ui->comboBox->setFixedSize(this->parentWidget()->geometry().width(),
                               ui->comboBox->geometry().height());

    int width = qMax(ui->widgetTilesetSelector->width(),
                     this->parentWidget()->geometry().width());
    this->setGeometry(0, 0, width, ui->widgetTilesetSelector->height());
    setFixedSize(width, ui->widgetTilesetSelector->height());
}

// -------------------------------------------------------

void PanelTextures::showSpriteWalls(SystemTileset* tileset) {
    tileset->updateModelSpriteWalls();
    QStandardItemModel* model = tileset->modelSpriteWalls();
    QStandardItemModel* modelComplete = Wanok::get()->project()
            ->specialElementsDatas()->modelSpriteWalls();

    // Update picture kind
    m_kind = PictureKind::Walls;

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

    // Ui display
    hideAll();
    showComboBox();
    ui->widgetWallPreview->show();
}

// -------------------------------------------------------

QString PanelTextures::createlabelText() {
    QString kindText = "";
    switch (m_kind) {
    case PictureKind::Walls:
        kindText = "walls";
        break;
    default:
        break;
    }

    return "You don't have any " + kindText + " in this tileset. You can add "
           "it in the tileset tab in the datas manager.";
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelTextures::onSplitterMoved(int, int) {
    updateComboBoxSize();
}

// -------------------------------------------------------

void PanelTextures::on_comboBox_currentIndexChanged(int) {
    int id = getID();
    SystemSpecialElement* special =
            (SystemSpecialElement*) SuperListItem::getById(
                Wanok::get()->project()->specialElementsDatas()->model(m_kind)
                ->invisibleRootItem(), id);
    ui->widgetWallPreview->updatePicture(special->picture(), m_kind);
}
