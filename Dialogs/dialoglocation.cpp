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

#include "dialoglocation.h"
#include "ui_dialoglocation.h"
#include <QFileDialog>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogLocation::DialogLocation(QString location, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogLocation)
{
    ui->setupUi(this);
    setFixedSize(geometry().width(), geometry().height());

    ui->lineEdit->setText(location);
    ui->lineEdit->setCursorPosition(0);
}

DialogLocation::~DialogLocation()
{
    delete ui;
}

QString DialogLocation::location() const { return ui->lineEdit->text(); }

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogLocation::on_pushButton_clicked(){
    QString dir = QFileDialog::getExistingDirectory(this,"Select a location",
                                                    location());
    if (dir.count() > 0)
        ui->lineEdit->setText(dir);
}
