/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#include "dialogpicturespreview.h"
#include "ui_dialogpicturespreview.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogPicturesPreview::DialogPicturesPreview(SystemPicture* picture,
                                             PictureKind kind,
                                             QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogPicturesPreview),
    m_kind(kind),
    m_initialPictureID(picture->id())
{
    ui->setupUi(this);
    

    ui->widget->setChooseRect(true);
    ui->widget->setPictureKind(kind);
    ui->widget->changePicture(picture);
    ui->widget->showAvailableContent(false);

    connect(this, SIGNAL(accepted()), this, SLOT(on_accepted()));
    connect(this, SIGNAL(rejected()), this, SLOT(on_rejected()));
    connect(this, SIGNAL(dialogIsClosing()), this, SLOT(on_rejected()));
}

DialogPicturesPreview::~DialogPicturesPreview()
{
    delete ui;
}

SystemPicture* DialogPicturesPreview::picture() const {
    return ui->widget->picture();
}

int DialogPicturesPreview::indexX() const {
    return ui->widget->indexX();
}

void DialogPicturesPreview::setIndexX(int i) {
    ui->widget->setIndexX(i);
}

int DialogPicturesPreview::indexY() const {
    return ui->widget->indexY();
}

void DialogPicturesPreview::setIndexY(int i) {
    ui->widget->setIndexY(i);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogPicturesPreview::closeEvent(QCloseEvent *){
    emit dialogIsClosing();
}

// -------------------------------------------------------

void DialogPicturesPreview::on_accepted(){
    RPM::get()->project()->writePicturesDatas();
}

// -------------------------------------------------------

void DialogPicturesPreview::on_rejected(){
    RPM::get()->project()->readPicturesDatas();

    // Update new picture adress
    ui->widget->setPicture(reinterpret_cast<SystemPicture *>(SuperListItem
        ::getById(RPM::get()->project()->picturesDatas()->model(m_kind)
        ->invisibleRootItem(), m_initialPictureID)));
}
