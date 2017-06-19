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

#include "panelpicturepreview.h"
#include "ui_panelpicturepreview.h"
#include "wanok.h"
#include <QDirIterator>

QString PanelPicturePreview::pathIconRed = ":/icons/Ressources/point_r.png";
QString PanelPicturePreview::pathIconBlue = ":/icons/Ressources/point_b.png";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelPicturePreview::PanelPicturePreview(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelPicturePreview),
    m_pictureKind(PictureKind::None)
{
    ui->setupUi(this);

    ui->widgetPanelIDs->showButtonMax(false);
    connect(ui->checkBoxContent, SIGNAL(toggled(bool)),
            this, SLOT(showAvailableContent(bool)));

    ui->treeViewAvailableContent->initializeModel(new QStandardItemModel);
    ui->treeViewAvailableContent->setHasContextMenu(false);
    ui->treeViewAvailableContent->setCanBeControled(false);
    ui->treeViewAvailableContent->setCanMove(false);
}

PanelPicturePreview::~PanelPicturePreview()
{
    SuperListItem::deleteModel(ui->treeViewAvailableContent->getModel());
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelPicturePreview::setPictureKind(PictureKind kind){
    bool isNone = kind == PictureKind::None;
    m_pictureKind = kind;

    showPictures(!isNone);

    if (!isNone){
        ui->widgetPanelIDs->initializeModel(
                    Wanok::get()->project()->picturesDatas()->model(kind));

        // Connection of list
        connect(ui->widgetPanelIDs->list()->selectionModel(),
                SIGNAL(currentChanged(QModelIndex,QModelIndex)),
                this, SLOT(on_listIDsIndexChanged(QModelIndex,QModelIndex)));

        QModelIndex index = ui->widgetPanelIDs->list()->getModel()->index(0,0);
        ui->widgetPanelIDs->list()->setCurrentIndex(index);

        // Loading first available content
        loadAvailableContent();

        connect(ui->treeViewAvailableContent->selectionModel(),
                SIGNAL(currentChanged(QModelIndex,QModelIndex)),
                this, SLOT(on_listIndexChanged(QModelIndex,QModelIndex)));
    }
}

// -------------------------------------------------------

void PanelPicturePreview::showPictures(bool b){
    this->setVisible(b);
}

// -------------------------------------------------------

void PanelPicturePreview::updateImage(QStandardItem* item){
    SystemPicture* super;

    super = (SystemPicture*) item->data().value<qintptr>();
    if (super != nullptr){
        if (super->id() == -1){
            ui->widgetPreview->setNoneImage();
        }
        else{
            ui->widgetPreview->setImage(super->getPath(m_pictureKind));
        }
        ui->widgetPreview->repaint();
    }
}

// -------------------------------------------------------

void PanelPicturePreview::loadAvailableContent(){

    // Clear
    SuperListItem::deleteModel(ui->treeViewAvailableContent->getModel(), false);
    ui->treeViewAvailableContent->getModel()->clear();

    // Load content from folders
    loadContentFromFolder(SystemPicture::getFolder(m_pictureKind, false),
                          false);
    loadContentFromFolder(SystemPicture::getFolder(m_pictureKind, true),
                          true);
}

// -------------------------------------------------------

void PanelPicturePreview::loadContentFromFolder(QString path, bool isBR){
    QDirIterator files(path, QDir::Files);
    QIcon icon = isBR ? QIcon(PanelPicturePreview::pathIconBlue)
                      : QIcon(PanelPicturePreview::pathIconRed);
    QStandardItem* item;
    SystemPicture* super;

    while (files.hasNext()){
        files.next();
        super = new SystemPicture(1, files.fileName(), isBR);
        item = new QStandardItem;
        item->setData(
                    QVariant::fromValue(reinterpret_cast<quintptr>(super)));
        item->setIcon(icon);
        item->setText(super->name());
        ui->treeViewAvailableContent->getModel()->appendRow(item);
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelPicturePreview::showAvailableContent(bool b){
    ui->treeViewAvailableContent->setVisible(b);
    ui->pushButtonMove->setVisible(b);
    ui->pushButtonRefresh->setVisible(b);
    ui->pushButtonAdd->setVisible(b);
}

// -------------------------------------------------------

void PanelPicturePreview::on_listIDsIndexChanged(QModelIndex index,
                                                 QModelIndex)
{
    updateImage(ui->widgetPanelIDs->list()->getModel()->itemFromIndex(index));
}

// -------------------------------------------------------

void PanelPicturePreview::on_listIndexChanged(QModelIndex index,
                                              QModelIndex)
{
    updateImage(ui->treeViewAvailableContent->getModel()->itemFromIndex(index));
}
