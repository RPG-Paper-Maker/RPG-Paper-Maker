/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
