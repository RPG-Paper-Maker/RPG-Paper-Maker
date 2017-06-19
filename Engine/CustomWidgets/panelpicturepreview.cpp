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
}

PanelPicturePreview::~PanelPicturePreview()
{
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

        // Connection of lists
        connect(ui->widgetPanelIDs->list()->selectionModel(),
                SIGNAL(currentChanged(QModelIndex,QModelIndex)),
                this, SLOT(on_listIDsIndexChanged(QModelIndex,QModelIndex)));

        QModelIndex index = ui->widgetPanelIDs->list()->getModel()->index(0,0);
        ui->widgetPanelIDs->list()->setCurrentIndex(index);
    }
}

// -------------------------------------------------------

void PanelPicturePreview::showPictures(bool b){
    this->setVisible(b);
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
    QStandardItem* item;
    SystemPicture* super;

    item = ui->widgetPanelIDs->list()->getModel()->itemFromIndex(index);
    super = (SystemPicture*) item->data().value<qintptr>();

    if (super != nullptr){
        QImage image;

        if (super->id() == -1){

        }
        else{
            image = QImage(super->getPath(m_pictureKind));
        }
    }
}
