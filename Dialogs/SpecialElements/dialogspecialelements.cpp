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

#include "dialogspecialelements.h"
#include "ui_dialogspecialelements.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSpecialElements::DialogSpecialElements(PictureKind kind,
                                             QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSpecialElements)
{
    ui->setupUi(this);
    setFixedSize(geometry().width(), geometry().height());

    setWindowTitle(SystemPicture::getPictureTitle(kind));
    ui->widget->initialize(
                Wanok::get()->project()->specialElementsDatas()->model(kind),
                kind);
}

DialogSpecialElements::~DialogSpecialElements()
{
    delete ui;
}
