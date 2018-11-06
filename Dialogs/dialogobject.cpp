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

#include "dialogobject.h"
#include "ui_dialogobject.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogObject::DialogObject(SystemCommonObject *object, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogObject)
{
    ui->setupUi(this);

    ui->widget->initializeList(Wanok::get()->project()->gameDatas()
                               ->commonEventsDatas()->modelCommonObjects());
    ui->widget->initializeModel(object);
    ui->widget->updateModel();
}

DialogObject::~DialogObject()
{
    delete ui;
}
