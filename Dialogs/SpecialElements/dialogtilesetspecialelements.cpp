/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#include "dialogtilesetspecialelements.h"
#include "ui_dialogtilesetspecialelements.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogTilesetSpecialElements::DialogTilesetSpecialElements(
        SystemTileset *tileset, PictureKind kind, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogTilesetSpecialElements),
    m_tileset(tileset),
    m_kind(kind)
{
    ui->setupUi(this);
    

    setWindowTitle(SystemPicture::getPictureTitle(kind));
    ui->widget->initialize(
                RPM::get()->project()->specialElementsDatas()->model(kind),
                kind);
    initialize();
}

DialogTilesetSpecialElements::~DialogTilesetSpecialElements()
{
    SuperListItem::deleteModel(model());
    delete ui;
}

QStandardItemModel* DialogTilesetSpecialElements::model() const {
    return ui->panelSuperList->list()->getModel();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogTilesetSpecialElements::initialize() {
    QStandardItemModel* model = new QStandardItemModel;
    SuperListItem::copyModel(model, m_tileset->model(m_kind));

    ui->panelSuperList->list()->setCanBrutRemove(true);
    ui->panelSuperList->showButtonMax(false);
    ui->panelSuperList->showEditName(false);
    ui->panelSuperList->initializeModel(model);
    if (this->model()->invisibleRootItem()->rowCount() > 0)
        ui->panelSuperList->list()->setIndex(0);

    // Connexions
    connect(ui->widget->superList()->list(), SIGNAL(deleteIDs()),
            this, SLOT(on_deletingIDs()));
    connect(ui->widget->superList(), SIGNAL(nameChanged(QStandardItem*)),
            this, SLOT(on_nameChanged(QStandardItem*)));
    connect(ui->widget->superList()->list(), SIGNAL(doubleClicked(QModelIndex)),
            this, SLOT(on_pushButtonMove_clicked()));
}

// -------------------------------------------------------

void DialogTilesetSpecialElements::move() {
    int index = ui->widget->currentIndex();
    QStandardItemModel* model = this->model();

    SystemTileset::moveModel(model, RPM::get()->project()
                             ->specialElementsDatas()->model(m_kind), index);
}

// -------------------------------------------------------

void DialogTilesetSpecialElements::remove() {
    int index = ui->panelSuperList->list()->getIndex();
    if (index >= 0)
        model()->removeRow(index);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogTilesetSpecialElements::on_pushButtonMove_clicked() {
    move();
}

// -------------------------------------------------------

void DialogTilesetSpecialElements::on_pushButtonDelete_clicked() {
    remove();
}

// -------------------------------------------------------

void DialogTilesetSpecialElements::on_deletingIDs() {

    // When deleting IDs, we need to update the list and also delete these
    // removed IDs in the tileset list
    SystemTileset::updateModel(ui->panelSuperList->list()->getModel(),
                               RPM::get()->project()->specialElementsDatas()
                               ->model(m_kind));
}

// -------------------------------------------------------

void DialogTilesetSpecialElements::on_nameChanged(QStandardItem* item)
{
    SuperListItem* super = (SuperListItem*) item->data().value<quintptr>();
    int index = SuperListItem::getIndexById(model()->invisibleRootItem(),
                                            super->id());
    if (index >= 0) {
        QStandardItem* item = model()->item(index);
        SuperListItem* superTileset =
                (SuperListItem*) item->data().value<quintptr>();
        superTileset->setName(super->name());
        item->setText(superTileset->toString());
    }
}

// -------------------------------------------------------

void DialogTilesetSpecialElements::accept() {
    QStandardItemModel* model = m_tileset->model(m_kind);

    // Clear
    SuperListItem::deleteModel(model, false);

    // Copy
    SuperListItem::copyModel(model, this->model());

    QDialog::accept();
}
