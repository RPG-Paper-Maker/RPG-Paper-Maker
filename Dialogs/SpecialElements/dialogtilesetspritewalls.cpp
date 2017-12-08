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

#include "dialogtilesetspritewalls.h"
#include "ui_dialogtilesetspritewalls.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogTilesetSpriteWalls::DialogTilesetSpriteWalls(SystemTileset *tileset,
                                                   QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogTilesetSpriteWalls),
    m_tileset(tileset)
{
    ui->setupUi(this);
    setFixedSize(geometry().width(), geometry().height());

    initialize();
}

DialogTilesetSpriteWalls::~DialogTilesetSpriteWalls()
{
    SuperListItem::deleteModel(model());
    delete ui;
}

QStandardItemModel* DialogTilesetSpriteWalls::model() const {
    return ui->panelSuperList->list()->getModel();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogTilesetSpriteWalls::initialize() {
    QStandardItemModel* model = new QStandardItemModel;
    SuperListItem::copyModel(model, m_tileset->modelSpriteWalls());

    ui->panelSuperList->list()->setCanBrutRemove(true);
    ui->panelSuperList->showButtonMax(false);
    ui->panelSuperList->showEditName(false);
    ui->panelSuperList->initializeModel(model);
    if (ui->panelSuperList->list()->getModel()->invisibleRootItem()->rowCount()
        > 0)
    {
        ui->panelSuperList->list()->setIndex(0);
    }

    // Connexions
    connect(ui->widget->superList()->list(), SIGNAL(deleteIDs()),
            this, SLOT(on_deletingIDs()));
    connect(ui->widget->superList(), SIGNAL(nameChanged(QStandardItem*)),
            this, SLOT(on_nameChanged(QStandardItem*)));
    connect(ui->widget->superList()->list(), SIGNAL(doubleClicked(QModelIndex)),
            this, SLOT(on_pushButtonMove_clicked()));
}

// -------------------------------------------------------

void DialogTilesetSpriteWalls::move() {
    int index = ui->widget->currentIndex();
    QStandardItemModel* model = ui->panelSuperList->list()->getModel();

    SystemTileset::moveModel(
                model, Wanok::get()->project()->specialElementsDatas()
                ->modelSpriteWalls(), index);
}

// -------------------------------------------------------

void DialogTilesetSpriteWalls::remove() {
    int index = ui->panelSuperList->list()->getIndex();
    if (index >= 0) {
        QStandardItemModel* model = ui->panelSuperList->list()->getModel();
        model->removeRow(index);
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogTilesetSpriteWalls::on_pushButtonMove_clicked() {
    move();
}

// -------------------------------------------------------

void DialogTilesetSpriteWalls::on_pushButtonDelete_clicked() {
    remove();
}

// -------------------------------------------------------

void DialogTilesetSpriteWalls::on_deletingIDs() {

    // When deleting IDs, we need to update the list and also delete these
    // removed IDs in the tileset list
    SystemTileset::updateModel(ui->panelSuperList->list()->getModel(),
                               Wanok::get()->project()->specialElementsDatas()
                               ->modelSpriteWalls());
}

// -------------------------------------------------------

void DialogTilesetSpriteWalls::on_nameChanged(QStandardItem* item)
{
    QStandardItemModel* model = ui->panelSuperList->list()->getModel();
    SuperListItem* super = (SuperListItem*) item->data().value<quintptr>();
    int index = SuperListItem::getIndexById(model->invisibleRootItem(),
                                            super->id());
    if (index >= 0) {
        QStandardItem* item = model->item(index);
        SuperListItem* superTileset =
                (SuperListItem*) item->data().value<quintptr>();
        superTileset->setName(super->name());
        item->setText(superTileset->toString());
    }
}

// -------------------------------------------------------

void DialogTilesetSpriteWalls::accept() {
    QStandardItemModel* model = m_tileset->modelSpriteWalls();

    // Clear
    SuperListItem::deleteModel(model, false);

    // Copy
    SuperListItem::copyModel(model, this->model());

    QDialog::accept();
}
