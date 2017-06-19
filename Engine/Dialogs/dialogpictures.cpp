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

#include "dialogpictures.h"
#include "ui_dialogpictures.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogPictures::DialogPictures(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogPictures)
{
    ui->setupUi(this);
    setFixedSize(geometry().width(), geometry().height());

    // Tree model
    ui->treeView->setModel(createFoldersModel());
    ui->treeView->expandAll();
    connect(ui->treeView->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)),
            this,
            SLOT(on_folderSelected(QModelIndex,QModelIndex)));

    // Keep space when hiding widget
    QSizePolicy sp_retain;
    sp_retain = ui->widgetPicturePreview->sizePolicy();
    sp_retain.setRetainSizeWhenHidden(true);
    ui->widgetPicturePreview->setSizePolicy(sp_retain);
}

DialogPictures::~DialogPictures()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QStandardItemModel* DialogPictures::createFoldersModel() const{
    QStandardItemModel* model = new QStandardItemModel;
    QStandardItem* itemPictures, *itemHUD, *itemTextures2D;
    QIcon icon(":/icons/Ressources/dir.png");
    QList<QString> listNames;
    QList<PictureKind> listEnums;

    // Pictures
    itemPictures = new QStandardItem;
    itemPictures->setData(QVariant::fromValue(
                      reinterpret_cast<PictureKind>(PictureKind::None)));
    itemPictures->setIcon(icon);
    itemPictures->setText("Pictures");
    model->appendRow(itemPictures);

    // HUD
    itemHUD = new QStandardItem;
    itemHUD->setData(QVariant::fromValue(
                      reinterpret_cast<PictureKind>(PictureKind::None)));
    itemHUD->setIcon(icon);
    itemHUD->setText("HUD");
    itemPictures->appendRow(itemHUD);
    listNames << "Bars" << "Icons";
    listEnums << PictureKind::Bars << PictureKind::Icons;
    addfolders(icon, itemHUD, listNames, listEnums);

    // Textures 2D
    itemTextures2D = new QStandardItem;
    itemTextures2D->setData(QVariant::fromValue(
                      reinterpret_cast<PictureKind>(PictureKind::None)));
    itemTextures2D->setIcon(icon);
    itemTextures2D->setText("Texures2D");
    itemPictures->appendRow(itemTextures2D);
    listNames.clear();
    listEnums.clear();
    listNames << "Autotiles" << "Characters" << "Reliefs" << "Tilesets";
    listEnums << PictureKind::Autotiles << PictureKind::Characters
              << PictureKind::Reliefs << PictureKind::Tilesets;
    addfolders(icon, itemTextures2D, listNames, listEnums);

    return model;
}

// -------------------------------------------------------

void DialogPictures::addfolders(QIcon &icon,
                                QStandardItem* root,
                                QList<QString> &names,
                                QList<PictureKind> &enums) const
{
    QStandardItem* item;

    for (int i = 0; i < names.size(); i++){
        item= new QStandardItem;
        item->setData(QVariant::fromValue(
                          reinterpret_cast<PictureKind>(enums.at(i))));
        item->setIcon(icon);
        item->setText(names.at(i));
        root->appendRow(item);
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogPictures::on_folderSelected(const QModelIndex& current,
                                       const QModelIndex&)
{
    QStandardItemModel* model = (QStandardItemModel*) ui->treeView->model();
    QStandardItem* item = model->itemFromIndex(current);
    PictureKind k = item->data().value<PictureKind>();
    ui->widgetPicturePreview->setPictureKind(k);
}
