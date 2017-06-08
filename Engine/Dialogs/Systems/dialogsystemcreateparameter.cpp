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

#include "dialogsystemcreateparameter.h"
#include "ui_dialogsystemcreateparameter.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemCreateParameter::DialogSystemCreateParameter(
        SystemCreateParameter &param,
        QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemCreateParameter),
    m_param(param)
{
    ui->setupUi(this);
    setFixedSize(geometry().width(), geometry().height());

    initialize();
}

DialogSystemCreateParameter::~DialogSystemCreateParameter()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemCreateParameter::initialize(){
    ui->lineEditName->setText(m_param.name());
    ui->widgetDefaultValue->initializeModel(m_param.defaultValue());
    ui->widgetDefaultValue->initializePrimitives();
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemCreateParameter::on_lineEditName_textChanged(const QString &
                                                              text)
{
    m_param.setName(text);
}
