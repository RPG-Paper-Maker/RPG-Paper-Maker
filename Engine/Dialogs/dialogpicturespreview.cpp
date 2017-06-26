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

#include "dialogpicturespreview.h"
#include "ui_dialogpicturespreview.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogPicturesPreview::DialogPicturesPreview(SystemPicture* picture,
                                             PictureKind kind,
                                             QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogPicturesPreview)
{
    ui->setupUi(this);
    setFixedSize(geometry().width(), geometry().height());

    ui->widget->setPictureKind(kind);
    ui->widget->setPicture(picture);
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
    Wanok::get()->project()->writePicturesDatas();
}

// -------------------------------------------------------

void DialogPicturesPreview::on_rejected(){
    Wanok::get()->project()->readPicturesDatas();
}
